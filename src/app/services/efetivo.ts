import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Policial, Tarefa, Secao, Meta } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EfetivoService {
  private policiaisSubject = new BehaviorSubject<Policial[]>([]);
  public policiais$: Observable<Policial[]> = this.policiaisSubject.asObservable();

  private tarefasSubject = new BehaviorSubject<Tarefa[]>([]);
  public tarefas$: Observable<Tarefa[]> = this.tarefasSubject.asObservable();

  private secoesSubject = new BehaviorSubject<Secao[]>([]);
  public secoes$: Observable<Secao[]> = this.secoesSubject.asObservable();

  constructor() {
    this.loadMockData();
  }

  private loadMockData(): void {
    // Dados mockados para demonstração
    const mockPoliciais: Policial[] = [
      {
        id: '1',
        nome: 'João Silva Santos',
        graduacao: 'Coronel',
        secao: 'Administração',
        funcao: 'Diretor Geral',
        foto: 'assets/images/coronel.jpg',
        email: 'joao.santos@pmerj.gov.br',
        ativo: true
      },
      {
        id: '2',
        nome: 'Maria Oliveira Costa',
        graduacao: 'Major',
        secao: 'Conservação',
        funcao: 'Chefe de Seção',
        foto: 'assets/images/major.jpg',
        email: 'maria.costa@pmerj.gov.br',
        ativo: true
      },
      {
        id: '3',
        nome: 'Carlos Eduardo Lima',
        graduacao: 'Capitão',
        secao: 'Tecnologia',
        funcao: 'Analista Sênior',
        foto: 'assets/images/capitao.jpg',
        email: 'carlos.lima@pmerj.gov.br',
        ativo: true
      }
    ];

    const mockSecoes: Secao[] = [
      {
        id: '1',
        nome: 'Administração',
        descricao: 'Responsável pela gestão administrativa do arquivo',
        responsavel: 'João Silva Santos',
        metas: []
      },
      {
        id: '2',
        nome: 'Conservação',
        descricao: 'Preservação e conservação dos documentos históricos',
        responsavel: 'Maria Oliveira Costa',
        metas: []
      },
      {
        id: '3',
        nome: 'Tecnologia',
        descricao: 'Digitalização e sistemas de informação',
        responsavel: 'Carlos Eduardo Lima',
        metas: []
      }
    ];

    this.policiaisSubject.next(mockPoliciais);
    this.secoesSubject.next(mockSecoes);
  }

  // CRUD Policiais
  getPoliciais(): Observable<Policial[]> {
    return this.policiais$;
  }

  getPolicialById(id: string): Policial | undefined {
    return this.policiaisSubject.value.find(p => p.id === id);
  }

  addPolicial(policial: Omit<Policial, 'id'>): void {
    const newPolicial: Policial = {
      ...policial,
      id: this.generateId()
    };

    const currentPoliciais = this.policiaisSubject.value;
    this.policiaisSubject.next([...currentPoliciais, newPolicial]);
  }

  updatePolicial(id: string, updates: Partial<Policial>): void {
    const currentPoliciais = this.policiaisSubject.value;
    const updatedPoliciais = currentPoliciais.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    this.policiaisSubject.next(updatedPoliciais);
  }

  deletePolicial(id: string): void {
    const currentPoliciais = this.policiaisSubject.value;
    const filteredPoliciais = currentPoliciais.filter(p => p.id !== id);
    this.policiaisSubject.next(filteredPoliciais);
  }

  // CRUD Tarefas
  getTarefas(): Observable<Tarefa[]> {
    return this.tarefas$;
  }

  addTarefa(tarefa: Omit<Tarefa, 'id' | 'criadoEm'>): void {
    const newTarefa: Tarefa = {
      ...tarefa,
      id: this.generateId(),
      criadoEm: new Date()
    };

    const currentTarefas = this.tarefasSubject.value;
    this.tarefasSubject.next([...currentTarefas, newTarefa]);
  }

  updateTarefa(id: string, updates: Partial<Tarefa>): void {
    const currentTarefas = this.tarefasSubject.value;
    const updatedTarefas = currentTarefas.map(t =>
      t.id === id ? { ...t, ...updates } : t
    );
    this.tarefasSubject.next(updatedTarefas);
  }

  deleteTarefa(id: string): void {
    const currentTarefas = this.tarefasSubject.value;
    const filteredTarefas = currentTarefas.filter(t => t.id !== id);
    this.tarefasSubject.next(filteredTarefas);
  }

  // Seções
  getSecoes(): Observable<Secao[]> {
    return this.secoes$;
  }

  getPolicialPorSecao(secao: string): Policial[] {
    return this.policiaisSubject.value.filter(p => p.secao === secao);
  }

  getTarefasPorPolicial(policialId: string): Tarefa[] {
    return this.tarefasSubject.value.filter(t => t.responsavelId === policialId);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
