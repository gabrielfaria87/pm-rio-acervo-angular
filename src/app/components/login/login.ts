import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  // Usando signals para estado reativo
  logoLoaded = signal(false);
  logoSrc = signal('assets/images/logo-pmerj.png');
  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal('');

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializar o formulário no construtor
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Verificar se já está logado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Tentar carregar a logo
    this.loadLogo();

    // Debug: Verificar se o formulário foi criado
    console.log('LoginForm criado:', this.loginForm);
    console.log('Controles do formulário:', this.loginForm.controls);
    console.log('Username control:', this.loginForm.get('username'));
  }

  loadLogo(): void {
    // Tentar carregar a logo
    const img = new Image();
    img.onload = () => this.logoLoaded.set(true);
    img.onerror = () => this.logoLoaded.set(false);
    img.src = this.logoSrc();
  }

  onLogoLoad(): void {
    this.logoLoaded.set(true);
  }

  onLogoError(): void {
    this.logoLoaded.set(false);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const { username, password } = this.loginForm.value;

      try {
        const result = await this.authService.login(username, password);

        if (result.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set(result.message);
        }
      } catch (error) {
        this.errorMessage.set('Erro interno do servidor');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  // Método para debug do input
  onUsernameInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    console.log('Input value:', target.value);
    console.log('Form value:', this.loginForm.get('username')?.value);
  }
}
