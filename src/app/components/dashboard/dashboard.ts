import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../services/auth';
import { EfetivoService } from '../../services/efetivo';
import { Policial, Tarefa, Secao } from '../../models/interfaces';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  policiais: Policial[] = [];
  tarefas: Tarefa[] = [];
  secoes: Secao[] = [];

  // Estatísticas
  totalPoliciais = 0;
  totalTarefas = 0;
  tarefasPendentes = 0;
  tarefasEmAndamento = 0;
  tarefasConcluidas = 0;

  constructor(
    public authService: AuthService,
    private efetivoService: EfetivoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar se está logado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadData();
  }

  private loadData(): void {
    // Carregar policiais
    this.efetivoService.getPoliciais().subscribe(policiais => {
      this.policiais = policiais;
      this.totalPoliciais = policiais.length;
    });

    // Carregar tarefas
    this.efetivoService.getTarefas().subscribe(tarefas => {
      this.tarefas = tarefas;
      this.totalTarefas = tarefas.length;
      this.tarefasPendentes = tarefas.filter(t => t.status === 'pendente').length;
      this.tarefasEmAndamento = tarefas.filter(t => t.status === 'em-andamento').length;
      this.tarefasConcluidas = tarefas.filter(t => t.status === 'concluida').length;
    });

    // Carregar seções
    this.efetivoService.getSecoes().subscribe(secoes => {
      this.secoes = secoes;
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  navegarPara(rota: string): void {
    this.router.navigate([rota]);
  }
}
