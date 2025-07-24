import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../services/auth';
import { EfetivoService } from '../../services/efetivo';
import { Policial } from '../../models/interfaces';

@Component({
  selector: 'app-cadastro-efetivo',
  imports: [CommonModule, Navbar, ReactiveFormsModule],
  templateUrl: './cadastro-efetivo.html',
  styleUrl: './cadastro-efetivo.scss'
})
export class CadastroEfetivo implements OnInit {
  cadastroForm: FormGroup;
  isLoading = false;
  mensagem = '';
  tipoMensagem: 'success' | 'error' = 'success';

  graduacoes = [
    'Soldado', 'Cabo', '3º Sargento', '2º Sargento', '1º Sargento',
    'Subtenente', 'Aspirante', '2º Tenente', '1º Tenente', 'Capitão',
    'Major', 'Tenente Coronel', 'Coronel'
  ];

  secoes = [
    'Administração', 'Conservação', 'Tecnologia', 'Arquivo Histórico',
    'Documentação', 'Pesquisa', 'Atendimento', 'Segurança'
  ];

  funcoes = [
    'Diretor Geral', 'Chefe de Seção', 'Analista Sênior', 'Analista Júnior',
    'Técnico em Arquivo', 'Assistente Administrativo', 'Auxiliar', 'Estagiário'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private efetivoService: EfetivoService,
    private router: Router
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      graduacao: ['', Validators.required],
      secao: ['', Validators.required],
      funcao: ['', Validators.required],
      email: ['', [Validators.email]],
      telefone: [''],
      foto: [''],
      dataIngresso: [''],
      ativo: [true]
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.authService.isAdmin()) {
      this.router.navigate(['/efetivo']);
      return;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.cadastroForm.valid) {
      this.isLoading = true;
      this.mensagem = '';

      try {
        const formData = this.cadastroForm.value;

        // Converter data se fornecida
        if (formData.dataIngresso) {
          formData.dataIngresso = new Date(formData.dataIngresso);
        }

        const novoPolicial: Omit<Policial, 'id'> = {
          nome: formData.nome,
          graduacao: formData.graduacao,
          secao: formData.secao,
          funcao: formData.funcao,
          email: formData.email || undefined,
          telefone: formData.telefone || undefined,
          foto: formData.foto || undefined,
          dataIngresso: formData.dataIngresso || undefined,
          ativo: formData.ativo
        };

        this.efetivoService.addPolicial(novoPolicial);

        this.mensagem = 'Policial cadastrado com sucesso!';
        this.tipoMensagem = 'success';

        // Limpar formulário
        this.cadastroForm.reset();
        this.cadastroForm.patchValue({ ativo: true });

        // Redirecionar após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/efetivo']);
        }, 2000);

      } catch (error) {
        this.mensagem = 'Erro ao cadastrar policial. Tente novamente.';
        this.tipoMensagem = 'error';
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.cadastroForm.controls).forEach(key => {
      const control = this.cadastroForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.cadastroForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nome: 'Nome',
      graduacao: 'Graduação',
      secao: 'Seção',
      funcao: 'Função',
      email: 'Email',
      telefone: 'Telefone'
    };
    return labels[fieldName] || fieldName;
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.cadastroForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  cancelar(): void {
    this.router.navigate(['/efetivo']);
  }
}
