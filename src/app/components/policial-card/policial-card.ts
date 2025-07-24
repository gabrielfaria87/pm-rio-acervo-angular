import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Policial, Tarefa } from '../../models/interfaces';
import { EfetivoService } from '../../services/efetivo';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-policial-card',
  imports: [CommonModule],
  templateUrl: './policial-card.html',
  styleUrl: './policial-card.scss'
})
export class PolicialCard implements OnInit {
  @Input() policial: Policial | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  tarefas: Tarefa[] = [];

  // Kanban columns
  tarefasPendentes: Tarefa[] = [];
  tarefasEmAndamento: Tarefa[] = [];
  tarefasConcluidas: Tarefa[] = [];

  constructor(
    private efetivoService: EfetivoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.policial) {
      this.loadTarefas();
    }
  }

  ngOnChanges(): void {
    if (this.policial && this.isOpen) {
      this.loadTarefas();
    }
  }

  private loadTarefas(): void {
    if (!this.policial) return;

    this.efetivoService.getTarefas().subscribe(todasTarefas => {
      this.tarefas = todasTarefas.filter(t => t.responsavelId === this.policial!.id);
      this.organizarTarefasKanban();
    });
  }

  private organizarTarefasKanban(): void {
    this.tarefasPendentes = this.tarefas.filter(t => t.status === 'pendente');
    this.tarefasEmAndamento = this.tarefas.filter(t => t.status === 'em-andamento');
    this.tarefasConcluidas = this.tarefas.filter(t => t.status === 'concluida');
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getTipoBadgeClass(tipo: string): string {
    return tipo === 'prioritaria'
      ? 'bg-red-100 text-red-800'
      : 'bg-blue-100 text-blue-800';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'em-andamento':
        return 'bg-blue-100 text-blue-800';
      case 'concluida':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  calcularDiasRestantes(dataFim: Date): number {
    const hoje = new Date();
    const fim = new Date(dataFim);
    const diffTime = fim.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  moverTarefa(tarefa: Tarefa, novoStatus: 'pendente' | 'em-andamento' | 'concluida'): void {
    if (this.isAdmin()) {
      this.efetivoService.updateTarefa(tarefa.id, { status: novoStatus });
      this.loadTarefas(); // Recarregar tarefas
    }
  }
}
