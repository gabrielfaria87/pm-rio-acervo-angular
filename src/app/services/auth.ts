import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$: Observable<Usuario | null> = this.currentUserSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor() {
    // Verificar se há usuário logado no localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
    }
  }

  async login(username: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      // Simulação de login - substituir por integração real com Supabase
      if (username === 'admin' && password === 'admin123') {
        const adminUser: Usuario = {
          id: '1',
          username: 'admin',
          nome: 'Administrador',
          email: 'admin@pmerj.gov.br',
          tipo: 'admin',
          ativo: true,
          ultimoLogin: new Date()
        };

        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        this.currentUserSubject.next(adminUser);
        this.isLoggedInSubject.next(true);

        return { success: true, message: 'Login realizado com sucesso!' };
      } else if (username === 'usuario' && password === 'user123') {
        const regularUser: Usuario = {
          id: '2',
          username: 'usuario',
          nome: 'Usuário Padrão',
          email: 'usuario@pmerj.gov.br',
          tipo: 'usuario',
          ativo: true,
          ultimoLogin: new Date()
        };

        localStorage.setItem('currentUser', JSON.stringify(regularUser));
        this.currentUserSubject.next(regularUser);
        this.isLoggedInSubject.next(true);

        return { success: true, message: 'Login realizado com sucesso!' };
      } else {
        return { success: false, message: 'Usuário ou senha incorretos' };
      }
    } catch (error) {
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.tipo === 'admin' || false;
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
}
