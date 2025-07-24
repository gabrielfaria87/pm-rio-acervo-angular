import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../services/auth';
import { EfetivoService } from '../../services/efetivo';

interface RelatorioConfig {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'efetivo' | 'documentos' | 'atividades' | 'estatisticas';
  icone: string;
  parametros: RelatorioParametro[];
}

interface RelatorioParametro {
  nome: string;
  tipo: 'data' | 'select' | 'text' | 'checkbox';
  label: string;
  opcoes?: { valor: string; label: string }[];
  obrigatorio: boolean;
}

interface DadosRelatorio {
  titulo: string;
  dataGeracao: Date;
  parametros: { [key: string]: any };
  dados: any[];
  graficos?: GraficoConfig[];
}

interface GraficoConfig {
  tipo: 'pie' | 'bar' | 'line';
  titulo: string;
  dados: { label: string; valor: number; cor?: string }[];
}

@Component({
  selector: 'app-relatorios',
  imports: [CommonModule, Navbar, ReactiveFormsModule],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.scss'
})
export class Relatorios implements OnInit {
  relatoriosDisponiveis: RelatorioConfig[] = [];
  relatorioSelecionado: RelatorioConfig | null = null;
  parametrosForm: FormGroup;
  dadosRelatorio: DadosRelatorio | null = null;
  isGeneratingReport = false;

  // Controles de interface
  isParametrosModalOpen = false;
  isVisualizandoRelatorio = false;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private efetivoService: EfetivoService
  ) {
    this.parametrosForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.carregarRelatoriosDisponiveis();
  }

  private carregarRelatoriosDisponiveis(): void {
    this.relatoriosDisponiveis = [
      {
        id: 'efetivo-por-secao',
        nome: 'Efetivo por Seção',
        descricao: 'Relatório detalhado do efetivo distribuído por seções',
        tipo: 'efetivo',
        icone: '👥',
        parametros: [
          {
            nome: 'incluirInativos',
            tipo: 'checkbox',
            label: 'Incluir policiais inativos',
            obrigatorio: false
          }
        ]
      },
      {
        id: 'efetivo-por-graduacao',
        nome: 'Efetivo por Graduação',
        descricao: 'Distribuição do efetivo por graduação/posto',
        tipo: 'efetivo',
        icone: '🏅',
        parametros: [
          {
            nome: 'secao',
            tipo: 'select',
            label: 'Seção (opcional)',
            opcoes: [
              { valor: '', label: 'Todas as seções' },
              { valor: '1ª Seção', label: '1ª Seção' },
              { valor: '2ª Seção', label: '2ª Seção' },
              { valor: '3ª Seção', label: '3ª Seção' },
              { valor: '4ª Seção', label: '4ª Seção' }
            ],
            obrigatorio: false
          }
        ]
      },
      {
        id: 'documentos-por-periodo',
        nome: 'Documentos por Período',
        descricao: 'Quantidade de documentos cadastrados em um período',
        tipo: 'documentos',
        icone: '📄',
        parametros: [
          {
            nome: 'dataInicio',
            tipo: 'data',
            label: 'Data de início',
            obrigatorio: true
          },
          {
            nome: 'dataFim',
            tipo: 'data',
            label: 'Data de fim',
            obrigatorio: true
          }
        ]
      },
      {
        id: 'atividades-secoes',
        nome: 'Atividades das Seções',
        descricao: 'Relatório de atividades e tarefas por seção',
        tipo: 'atividades',
        icone: '📋',
        parametros: [
          {
            nome: 'periodo',
            tipo: 'select',
            label: 'Período',
            opcoes: [
              { valor: '7', label: 'Últimos 7 dias' },
              { valor: '30', label: 'Últimos 30 dias' },
              { valor: '90', label: 'Últimos 90 dias' }
            ],
            obrigatorio: true
          },
          {
            nome: 'status',
            tipo: 'select',
            label: 'Status das atividades',
            opcoes: [
              { valor: '', label: 'Todos os status' },
              { valor: 'concluida', label: 'Concluídas' },
              { valor: 'em-andamento', label: 'Em andamento' },
              { valor: 'pendente', label: 'Pendentes' }
            ],
            obrigatorio: false
          }
        ]
      },
      {
        id: 'estatisticas-gerais',
        nome: 'Estatísticas Gerais',
        descricao: 'Dashboard com estatísticas gerais do sistema',
        tipo: 'estatisticas',
        icone: '📊',
        parametros: []
      }
    ];
  }

  selecionarRelatorio(relatorio: RelatorioConfig): void {
    this.relatorioSelecionado = relatorio;
    this.construirFormularioParametros();

    if (relatorio.parametros.length === 0) {
      // Se não há parâmetros, gerar relatório diretamente
      this.gerarRelatorio();
    } else {
      this.isParametrosModalOpen = true;
    }
  }

  private construirFormularioParametros(): void {
    if (!this.relatorioSelecionado) return;

    const controles: { [key: string]: any } = {};

    this.relatorioSelecionado.parametros.forEach(param => {
      const validators = param.obrigatorio ? [Validators.required] : [];
      controles[param.nome] = ['', validators];
    });

    this.parametrosForm = this.fb.group(controles);
  }

  gerarRelatorio(): void {
    if (!this.relatorioSelecionado) return;

    const parametros = this.parametrosForm.value;
    this.isGeneratingReport = true;

    // Simular geração de relatório
    setTimeout(() => {
      this.dadosRelatorio = this.gerarDadosRelatorio(this.relatorioSelecionado!, parametros);
      this.isGeneratingReport = false;
      this.isParametrosModalOpen = false;
      this.isVisualizandoRelatorio = true;
    }, 2000);
  }

  private gerarDadosRelatorio(config: RelatorioConfig, parametros: any): DadosRelatorio {
    switch (config.id) {
      case 'efetivo-por-secao':
        return this.gerarRelatorioEfetivoPorSecao(parametros);
      case 'efetivo-por-graduacao':
        return this.gerarRelatorioEfetivoPorGraduacao(parametros);
      case 'documentos-por-periodo':
        return this.gerarRelatorioDocumentosPorPeriodo(parametros);
      case 'atividades-secoes':
        return this.gerarRelatorioAtividadesSecoes(parametros);
      case 'estatisticas-gerais':
        return this.gerarRelatorioEstatisticasGerais();
      default:
        return {
          titulo: config.nome,
          dataGeracao: new Date(),
          parametros,
          dados: []
        };
    }
  }

  private gerarRelatorioEfetivoPorSecao(parametros: any): DadosRelatorio {
    const policiais = this.efetivoService.getPoliciais();
    const dados = [
      { secao: '1ª Seção', total: 45, ativos: 42, inativos: 3 },
      { secao: '2ª Seção', total: 38, ativos: 36, inativos: 2 },
      { secao: '3ª Seção', total: 52, ativos: 48, inativos: 4 },
      { secao: '4ª Seção', total: 29, ativos: 27, inativos: 2 }
    ];

    const graficos: GraficoConfig[] = [
      {
        tipo: 'pie',
        titulo: 'Distribuição do Efetivo por Seção',
        dados: dados.map(d => ({
          label: d.secao,
          valor: d.total,
          cor: this.getCorPorSecao(d.secao)
        }))
      }
    ];

    return {
      titulo: 'Efetivo por Seção',
      dataGeracao: new Date(),
      parametros,
      dados,
      graficos
    };
  }

  private gerarRelatorioEfetivoPorGraduacao(parametros: any): DadosRelatorio {
    const dados = [
      { graduacao: 'Coronel', quantidade: 2, percentual: 1.2 },
      { graduacao: 'Tenente Coronel', quantidade: 4, percentual: 2.4 },
      { graduacao: 'Major', quantidade: 8, percentual: 4.9 },
      { graduacao: 'Capitão', quantidade: 15, percentual: 9.1 },
      { graduacao: 'Tenente', quantidade: 25, percentual: 15.2 },
      { graduacao: 'Subtenente', quantidade: 20, percentual: 12.1 },
      { graduacao: 'Sargento', quantidade: 35, percentual: 21.2 },
      { graduacao: 'Cabo', quantidade: 45, percentual: 27.3 },
      { graduacao: 'Soldado', quantidade: 11, percentual: 6.7 }
    ];

    const graficos: GraficoConfig[] = [
      {
        tipo: 'bar',
        titulo: 'Efetivo por Graduação',
        dados: dados.map(d => ({
          label: d.graduacao,
          valor: d.quantidade
        }))
      }
    ];

    return {
      titulo: 'Efetivo por Graduação',
      dataGeracao: new Date(),
      parametros,
      dados,
      graficos
    };
  }

  private gerarRelatorioDocumentosPorPeriodo(parametros: any): DadosRelatorio {
    const dados = [
      { mes: 'Janeiro', documentos: 125, digitalizados: 98, pendentes: 27 },
      { mes: 'Fevereiro', documentos: 142, digitalizados: 115, pendentes: 27 },
      { mes: 'Março', documentos: 158, digitalizados: 134, pendentes: 24 }
    ];

    const graficos: GraficoConfig[] = [
      {
        tipo: 'line',
        titulo: 'Evolução de Documentos Cadastrados',
        dados: dados.map(d => ({
          label: d.mes,
          valor: d.documentos
        }))
      }
    ];

    return {
      titulo: 'Documentos por Período',
      dataGeracao: new Date(),
      parametros,
      dados,
      graficos
    };
  }

  private gerarRelatorioAtividadesSecoes(parametros: any): DadosRelatorio {
    const dados = [
      { secao: '1ª Seção', concluidas: 15, emAndamento: 8, pendentes: 3 },
      { secao: '2ª Seção', concluidas: 12, emAndamento: 6, pendentes: 5 },
      { secao: '3ª Seção', concluidas: 18, emAndamento: 10, pendentes: 4 },
      { secao: '4ª Seção', concluidas: 9, emAndamento: 4, pendentes: 2 }
    ];

    return {
      titulo: 'Atividades das Seções',
      dataGeracao: new Date(),
      parametros,
      dados
    };
  }

  private gerarRelatorioEstatisticasGerais(): DadosRelatorio {
    const dados = [
      { indicador: 'Total de Policiais', valor: 164, variacao: '+2.1%' },
      { indicador: 'Documentos Digitalizados', valor: 1247, variacao: '+12.3%' },
      { indicador: 'Atividades Concluídas', valor: 54, variacao: '+8.7%' },
      { indicador: 'Taxa de Digitalização', valor: '87.2%', variacao: '+3.1%' }
    ];

    const graficos: GraficoConfig[] = [
      {
        tipo: 'pie',
        titulo: 'Status das Atividades',
        dados: [
          { label: 'Concluídas', valor: 54, cor: '#10b981' },
          { label: 'Em Andamento', valor: 28, cor: '#f59e0b' },
          { label: 'Pendentes', valor: 14, cor: '#ef4444' }
        ]
      }
    ];

    return {
      titulo: 'Estatísticas Gerais',
      dataGeracao: new Date(),
      parametros: {},
      dados,
      graficos
    };
  }

  private getCorPorSecao(secao: string): string {
    const cores = {
      '1ª Seção': '#3b82f6',
      '2ª Seção': '#10b981',
      '3ª Seção': '#f59e0b',
      '4ª Seção': '#ef4444'
    };
    return cores[secao as keyof typeof cores] || '#6b7280';
  }

  exportarRelatorio(formato: 'pdf' | 'excel' | 'csv'): void {
    if (!this.dadosRelatorio) return;

    // Simular exportação
    alert(`Relatório exportado em formato ${formato.toUpperCase()}!`);
  }

  imprimirRelatorio(): void {
    window.print();
  }

  closeModal(): void {
    this.isParametrosModalOpen = false;
    this.relatorioSelecionado = null;
    this.parametrosForm.reset();
  }

  voltarParaSelecao(): void {
    this.isVisualizandoRelatorio = false;
    this.dadosRelatorio = null;
    this.relatorioSelecionado = null;
  }

  getTipoIcone(tipo: string): string {
    const icones = {
      'efetivo': '👥',
      'documentos': '📄',
      'atividades': '📋',
      'estatisticas': '📊'
    };
    return icones[tipo as keyof typeof icones] || '📊';
  }

  // Métodos auxiliares para o template
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  getMaxValue(dados: { valor: number }[]): number {
    return Math.max(...dados.map(d => d.valor));
  }
}
