import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../services/auth';

interface InformacaoRelevante {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: 'urgente' | 'importante' | 'informativo' | 'administrativo';
  prioridade: 'alta' | 'media' | 'baixa';
  autor: string;
  dataPublicacao: Date;
  dataExpiracao?: Date;
  ativo: boolean;
  tags: string[];
  anexos: string[];
  visualizacoes: number;
}

@Component({
  selector: 'app-informacoes-relevantes',
  imports: [CommonModule, Navbar, ReactiveFormsModule],
  templateUrl: './informacoes-relevantes.html',
  styleUrl: './informacoes-relevantes.scss'
})
export class InformacoesRelevantes implements OnInit {
  informacoes: InformacaoRelevante[] = [];
  informacoesFiltradas: InformacaoRelevante[] = [];

  // Filtros
  categoriaFiltro: string = 'todas';
  prioridadeFiltro: string = 'todas';
  termoBusca: string = '';

  // Modal
  isModalOpen = false;
  informacaoSelecionada: InformacaoRelevante | null = null;
  informacaoForm: FormGroup;

  // Configurações
  categorias = [
    { valor: 'urgente', nome: 'Urgente', cor: '#ef4444', icone: '🚨' },
    { valor: 'importante', nome: 'Importante', cor: '#f59e0b', icone: '⚠️' },
    { valor: 'informativo', nome: 'Informativo', cor: '#3b82f6', icone: 'ℹ️' },
    { valor: 'administrativo', nome: 'Administrativo', cor: '#6b7280', icone: '📋' }
  ];

  prioridades = [
    { valor: 'alta', nome: 'Alta', cor: '#dc2626' },
    { valor: 'media', nome: 'Média', cor: '#f59e0b' },
    { valor: 'baixa', nome: 'Baixa', cor: '#10b981' }
  ];

  constructor(
    private fb: FormBuilder,
    public authService: AuthService
  ) {
    this.informacaoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      conteudo: ['', [Validators.required, Validators.maxLength(2000)]],
      categoria: ['informativo', Validators.required],
      prioridade: ['media', Validators.required],
      dataExpiracao: [''],
      tags: [''],
      ativo: [true]
    });
  }

  ngOnInit(): void {
    this.carregarInformacoes();
    this.aplicarFiltros();
  }

  private carregarInformacoes(): void {
    // Dados mockados para demonstração
    this.informacoes = [
      {
        id: '1',
        titulo: 'Atualização do Sistema de Arquivo',
        conteudo: 'O sistema de arquivo digital será atualizado no próximo fim de semana. Durante este período, o acesso pode ficar intermitente entre 00h e 06h do sábado.',
        categoria: 'importante',
        prioridade: 'alta',
        autor: 'João Silva',
        dataPublicacao: new Date('2024-01-15'),
        dataExpiracao: new Date('2024-01-25'),
        ativo: true,
        tags: ['sistema', 'manutenção', 'arquivo'],
        anexos: [],
        visualizacoes: 45
      },
      {
        id: '2',
        titulo: 'Novo Protocolo de Segurança',
        conteudo: 'Implementação de novos protocolos de segurança para acesso aos documentos históricos. Todos os usuários devem ler e confirmar o recebimento desta informação.',
        categoria: 'urgente',
        prioridade: 'alta',
        autor: 'Maria Santos',
        dataPublicacao: new Date('2024-01-16'),
        ativo: true,
        tags: ['segurança', 'protocolo', 'documentos'],
        anexos: ['protocolo-seguranca.pdf'],
        visualizacoes: 78
      },
      {
        id: '3',
        titulo: 'Treinamento sobre Gestão de Documentos',
        conteudo: 'Será realizado um treinamento sobre as melhores práticas de gestão de documentos históricos. Data: 25/01/2024, Horário: 14h às 17h, Local: Auditório Central.',
        categoria: 'informativo',
        prioridade: 'media',
        autor: 'Pedro Costa',
        dataPublicacao: new Date('2024-01-17'),
        dataExpiracao: new Date('2024-01-26'),
        ativo: true,
        tags: ['treinamento', 'gestão', 'documentos'],
        anexos: ['cronograma-treinamento.pdf'],
        visualizacoes: 32
      },
      {
        id: '4',
        titulo: 'Alteração no Horário de Funcionamento',
        conteudo: 'Durante o mês de janeiro, o horário de funcionamento do arquivo será das 8h às 16h. Esta alteração visa otimizar os processos internos de organização.',
        categoria: 'administrativo',
        prioridade: 'media',
        autor: 'Ana Lima',
        dataPublicacao: new Date('2024-01-18'),
        dataExpiracao: new Date('2024-02-01'),
        ativo: true,
        tags: ['horário', 'funcionamento', 'janeiro'],
        anexos: [],
        visualizacoes: 23
      },
      {
        id: '5',
        titulo: 'Digitalização de Documentos Históricos',
        conteudo: 'Iniciamos o processo de digitalização dos documentos históricos mais antigos. Este projeto visa preservar e facilitar o acesso aos registros importantes da PMERJ.',
        categoria: 'informativo',
        prioridade: 'baixa',
        autor: 'Carlos Oliveira',
        dataPublicacao: new Date('2024-01-19'),
        ativo: true,
        tags: ['digitalização', 'preservação', 'história'],
        anexos: ['projeto-digitalizacao.pdf'],
        visualizacoes: 67
      }
    ];
  }

  aplicarFiltros(): void {
    this.informacoesFiltradas = this.informacoes.filter(info => {
      const matchCategoria = this.categoriaFiltro === 'todas' || info.categoria === this.categoriaFiltro;
      const matchPrioridade = this.prioridadeFiltro === 'todas' || info.prioridade === this.prioridadeFiltro;
      const matchBusca = this.termoBusca === '' ||
        info.titulo.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        info.conteudo.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        info.tags.some(tag => tag.toLowerCase().includes(this.termoBusca.toLowerCase()));

      return matchCategoria && matchPrioridade && matchBusca && info.ativo;
    });

    // Ordenar por prioridade e data
    this.informacoesFiltradas.sort((a, b) => {
      const prioridadeOrder = { 'alta': 3, 'media': 2, 'baixa': 1 };
      const prioridadeDiff = prioridadeOrder[b.prioridade] - prioridadeOrder[a.prioridade];

      if (prioridadeDiff !== 0) return prioridadeDiff;

      return new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime();
    });
  }

  buscar(termo: string): void {
    this.termoBusca = termo;
    this.aplicarFiltros();
  }

  filtrarPorCategoria(categoria: string): void {
    this.categoriaFiltro = categoria;
    this.aplicarFiltros();
  }

  filtrarPorPrioridade(prioridade: string): void {
    this.prioridadeFiltro = prioridade;
    this.aplicarFiltros();
  }

  visualizarInformacao(informacao: InformacaoRelevante): void {
    // Incrementar visualizações
    informacao.visualizacoes++;

    this.informacaoSelecionada = informacao;
    this.isModalOpen = true;
  }

  novaInformacao(): void {
    if (!this.authService.isAdmin()) return;

    this.informacaoSelecionada = null;
    this.informacaoForm.reset();
    this.informacaoForm.patchValue({
      categoria: 'informativo',
      prioridade: 'media',
      ativo: true
    });
    this.isModalOpen = true;
  }

  editarInformacao(informacao: InformacaoRelevante): void {
    if (!this.authService.isAdmin()) return;

    this.informacaoSelecionada = informacao;
    this.informacaoForm.patchValue({
      titulo: informacao.titulo,
      conteudo: informacao.conteudo,
      categoria: informacao.categoria,
      prioridade: informacao.prioridade,
      dataExpiracao: informacao.dataExpiracao ?
        new Date(informacao.dataExpiracao).toISOString().split('T')[0] : '',
      tags: informacao.tags.join(', '),
      ativo: informacao.ativo
    });
    this.isModalOpen = true;
  }

  salvarInformacao(): void {
    if (this.informacaoForm.valid) {
      const formData = this.informacaoForm.value;
      const tags = formData.tags ?
        formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [];

      if (this.informacaoSelecionada) {
        // Editar informação existente
        this.informacaoSelecionada.titulo = formData.titulo;
        this.informacaoSelecionada.conteudo = formData.conteudo;
        this.informacaoSelecionada.categoria = formData.categoria;
        this.informacaoSelecionada.prioridade = formData.prioridade;
        this.informacaoSelecionada.dataExpiracao = formData.dataExpiracao ?
          new Date(formData.dataExpiracao) : undefined;
        this.informacaoSelecionada.tags = tags;
        this.informacaoSelecionada.ativo = formData.ativo;
      } else {
        // Criar nova informação
        const novaInformacao: InformacaoRelevante = {
          id: Date.now().toString(),
          titulo: formData.titulo,
          conteudo: formData.conteudo,
          categoria: formData.categoria,
          prioridade: formData.prioridade,
          autor: this.authService.getCurrentUser()?.nome || 'Usuário',
          dataPublicacao: new Date(),
          dataExpiracao: formData.dataExpiracao ? new Date(formData.dataExpiracao) : undefined,
          ativo: formData.ativo,
          tags: tags,
          anexos: [],
          visualizacoes: 0
        };

        this.informacoes.push(novaInformacao);
      }

      this.aplicarFiltros();
      this.closeModal();
    }
  }

  excluirInformacao(informacao: InformacaoRelevante): void {
    if (!this.authService.isAdmin()) return;

    if (confirm(`Tem certeza que deseja excluir "${informacao.titulo}"?`)) {
      this.informacoes = this.informacoes.filter(i => i.id !== informacao.id);
      this.aplicarFiltros();
    }
  }

  toggleStatus(informacao: InformacaoRelevante): void {
    if (!this.authService.isAdmin()) return;

    informacao.ativo = !informacao.ativo;
    this.aplicarFiltros();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.informacaoSelecionada = null;
    this.informacaoForm.reset();
  }

  getCategoriaInfo(categoria: string) {
    return this.categorias.find(c => c.valor === categoria) || this.categorias[2];
  }

  getPrioridadeInfo(prioridade: string) {
    return this.prioridades.find(p => p.valor === prioridade) || this.prioridades[1];
  }

  isExpirada(informacao: InformacaoRelevante): boolean {
    return informacao.dataExpiracao ? new Date(informacao.dataExpiracao) < new Date() : false;
  }

  getDiasRestantes(informacao: InformacaoRelevante): number {
    if (!informacao.dataExpiracao) return -1;

    const hoje = new Date();
    const expiracao = new Date(informacao.dataExpiracao);
    const diffTime = expiracao.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
