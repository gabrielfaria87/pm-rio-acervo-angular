import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../services/auth';
import { EfetivoService } from '../../services/efetivo';
import { Tarefa, Secao } from '../../models/interfaces';

@Component({
  selector: 'app-secoes',
  imports: [CommonModule, Navbar, ReactiveFormsModule],
  templateUrl: './secoes.html',
  styleUrl: './secoes.scss'
})
export class Secoes implements OnInit {
  tarefas: Tarefa[] = [];
  secoes: Secao[] = [];
  tarefasPendentes: Tarefa[] = [];
  tarefasAndamento: Tarefa[] = [];
  tarefasConcluidas: Tarefa[] = [];

  isModalOpen = false;
  isEditMode = false;
  tarefaForm: FormGroup;
  selectedTarefa: Tarefa | null = null;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private efetivoService: EfetivoService
  ) {
    this.tarefaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      prioridade: ['Média', Validators.required],
      dataVencimento: [''],
      secaoId: ['', Validators.required],
      policialId: ['']
    });
  }

  ngOnInit(): void {
    this.efetivoService.tarefas$.subscribe(tarefas => {
      this.tarefas = tarefas;
      this.organizarTarefas();
    });

    this.efetivoService.secoes$.subscribe(secoes => {
      this.secoes = secoes;
    });
  }

  private organizarTarefas(): void {
    this.tarefasPendentes = this.tarefas.filter(t => t.status === 'pendente');
    this.tarefasAndamento = this.tarefas.filter(t => t.status === 'em-andamento');
    this.tarefasConcluidas = this.tarefas.filter(t => t.status === 'concluida');
  }

  getPrioridadeClass(prioridade: string): string {
    switch (prioridade) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Média': return 'bg-yellow-100 text-yellow-800';
      case 'Baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getSecaoNome(secaoId: number): string {
    const secao = this.secoes.find(s => parseInt(s.id) === secaoId);
    return secao ? secao.nome : 'Não definida';
  }

  getSecaoCor(secaoId: number): string {
    const secao = this.secoes.find(s => parseInt(s.id) === secaoId);
    return secao?.cor || '#6B7280';
  }

  isVencida(dataVencimento?: Date): boolean {
    if (!dataVencimento) return false;
    return new Date(dataVencimento) < new Date();
  }

  moverTarefa(tarefa: Tarefa, novoStatus: 'pendente' | 'em-andamento' | 'concluida'): void {
    if (!this.authService.isAdmin()) return;

    this.efetivoService.updateTarefa(tarefa.id, { status: novoStatus });
  }

  openModal(tarefa?: Tarefa): void {
    if (!this.authService.isAdmin()) return;

    this.isEditMode = !!tarefa;
    this.selectedTarefa = tarefa || null;

    if (tarefa) {
      this.tarefaForm.patchValue({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        prioridade: tarefa.prioridade,
        dataVencimento: tarefa.dataVencimento ?
          new Date(tarefa.dataVencimento).toISOString().split('T')[0] : '',
        secaoId: tarefa.secaoId,
        policialId: tarefa.policialId || ''
      });
    } else {
      this.tarefaForm.reset();
      this.tarefaForm.patchValue({ prioridade: 'Média' });
    }

    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.selectedTarefa = null;
    this.tarefaForm.reset();
  }

  async salvarTarefa(): Promise<void> {
    if (this.tarefaForm.valid) {
      const formData = this.tarefaForm.value;

      const tarefaData = {
        titulo: formData.titulo,
        descricao: formData.descricao || '',
        tipo: 'comum' as 'comum' | 'prioritaria',
        status: (this.isEditMode ? this.selectedTarefa!.status : 'pendente') as 'pendente' | 'em-andamento' | 'concluida',
        prioridade: formData.prioridade as 'Alta' | 'Média' | 'Baixa',
        secaoDestino: this.getSecaoNome(parseInt(formData.secaoId)),
        secaoId: parseInt(formData.secaoId),
        responsavelId: formData.policialId ? formData.policialId.toString() : '',
        policialId: formData.policialId ? parseInt(formData.policialId) : undefined,
        dataInicio: new Date(),
        dataFim: formData.dataVencimento ? new Date(formData.dataVencimento) : new Date(),
        dataVencimento: formData.dataVencimento ? new Date(formData.dataVencimento) : undefined,
        criadoPor: this.authService.getCurrentUser()?.nome || 'Sistema',
        criadoEm: new Date()
      };

      if (this.isEditMode && this.selectedTarefa) {
        this.efetivoService.updateTarefa(this.selectedTarefa.id, tarefaData);
      } else {
        this.efetivoService.addTarefa(tarefaData);
      }

      this.closeModal();
    }
  }

  excluirTarefa(tarefa: Tarefa): void {
    if (!this.authService.isAdmin()) return;

    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.efetivoService.deleteTarefa(tarefa.id);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.tarefaForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      titulo: 'Título',
      descricao: 'Descrição',
      prioridade: 'Prioridade',
      secaoId: 'Seção'
    };
    return labels[fieldName] || fieldName;
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.tarefaForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }
}
