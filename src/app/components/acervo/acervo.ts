import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../services/auth';

interface Documento {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  dataUpload: Date;
  tamanho: string;
  formato: string;
  autor: string;
  tags: string[];
  url?: string;
}

@Component({
  selector: 'app-acervo',
  imports: [CommonModule, Navbar, ReactiveFormsModule],
  templateUrl: './acervo.html',
  styleUrl: './acervo.scss'
})
export class Acervo implements OnInit {
  documentos: Documento[] = [];
  documentosFiltrados: Documento[] = [];
  categorias = ['Todos', 'Documentos Históricos', 'Relatórios', 'Manuais', 'Legislação', 'Fotos', 'Mapas', 'Outros'];
  categoriaSelecionada = 'Todos';
  termoBusca = '';

  isModalOpen = false;
  isViewMode = false;
  documentoSelecionado: Documento | null = null;
  documentoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService
  ) {
    this.documentoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      categoria: ['Documentos Históricos', Validators.required],
      autor: [''],
      tags: [''],
      url: ['']
    });
  }

  ngOnInit(): void {
    this.carregarDocumentos();
  }

  private carregarDocumentos(): void {
    // Dados mockados para demonstração
    this.documentos = [
      {
        id: '1',
        titulo: 'Histórico da PMERJ - Século XX',
        descricao: 'Documento completo sobre a evolução da Polícia Militar do Estado do Rio de Janeiro durante o século XX.',
        categoria: 'Documentos Históricos',
        dataUpload: new Date('2023-01-15'),
        tamanho: '2.5 MB',
        formato: 'PDF',
        autor: 'Arquivo Histórico PMERJ',
        tags: ['história', 'pmerj', 'século-xx'],
        url: 'https://exemplo.com/historico-pmerj.pdf'
      },
      {
        id: '2',
        titulo: 'Relatório Anual 2023',
        descricao: 'Relatório de atividades do Arquivo Geral da PMERJ referente ao ano de 2023.',
        categoria: 'Relatórios',
        dataUpload: new Date('2024-01-10'),
        tamanho: '1.8 MB',
        formato: 'PDF',
        autor: 'Direção Geral',
        tags: ['relatório', '2023', 'atividades'],
        url: 'https://exemplo.com/relatorio-2023.pdf'
      },
      {
        id: '3',
        titulo: 'Manual de Conservação de Documentos',
        descricao: 'Guia completo para conservação e preservação de documentos históricos.',
        categoria: 'Manuais',
        dataUpload: new Date('2023-08-20'),
        tamanho: '3.2 MB',
        formato: 'PDF',
        autor: 'Seção de Conservação',
        tags: ['manual', 'conservação', 'preservação'],
        url: 'https://exemplo.com/manual-conservacao.pdf'
      },
      {
        id: '4',
        titulo: 'Lei de Criação da PMERJ',
        descricao: 'Documento original da legislação que criou a Polícia Militar do Estado do Rio de Janeiro.',
        categoria: 'Legislação',
        dataUpload: new Date('2023-03-12'),
        tamanho: '800 KB',
        formato: 'PDF',
        autor: 'Governo do Estado RJ',
        tags: ['lei', 'criação', 'legislação'],
        url: 'https://exemplo.com/lei-criacao.pdf'
      },
      {
        id: '5',
        titulo: 'Fotografias Históricas - Década de 1950',
        descricao: 'Coleção de fotografias históricas da PMERJ durante a década de 1950.',
        categoria: 'Fotos',
        dataUpload: new Date('2023-07-08'),
        tamanho: '15.3 MB',
        formato: 'ZIP',
        autor: 'Arquivo Fotográfico',
        tags: ['fotos', 'história', '1950'],
        url: 'https://exemplo.com/fotos-1950.zip'
      },
      {
        id: '6',
        titulo: 'Mapa do Rio de Janeiro - 1940',
        descricao: 'Mapa histórico da cidade do Rio de Janeiro de 1940, utilizado pela PMERJ.',
        categoria: 'Mapas',
        dataUpload: new Date('2023-05-30'),
        tamanho: '4.7 MB',
        formato: 'JPG',
        autor: 'Instituto Cartográfico',
        tags: ['mapa', 'rio-de-janeiro', '1940'],
        url: 'https://exemplo.com/mapa-rj-1940.jpg'
      }
    ];

    this.documentosFiltrados = [...this.documentos];
  }

  filtrarPorCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria;
    this.aplicarFiltros();
  }

  buscar(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.termoBusca = target.value;
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    let documentosFiltrados = [...this.documentos];

    // Filtrar por categoria
    if (this.categoriaSelecionada !== 'Todos') {
      documentosFiltrados = documentosFiltrados.filter(doc =>
        doc.categoria === this.categoriaSelecionada
      );
    }

    // Filtrar por termo de busca
    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase();
      documentosFiltrados = documentosFiltrados.filter(doc =>
        doc.titulo.toLowerCase().includes(termo) ||
        doc.descricao.toLowerCase().includes(termo) ||
        doc.autor.toLowerCase().includes(termo) ||
        doc.tags.some(tag => tag.toLowerCase().includes(termo))
      );
    }

    this.documentosFiltrados = documentosFiltrados;
  }

  getFormatoClass(formato: string): string {
    switch (formato.toLowerCase()) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'doc':
      case 'docx': return 'bg-blue-100 text-blue-800';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'bg-green-100 text-green-800';
      case 'zip':
      case 'rar': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getFormatoIcon(formato: string): string {
    switch (formato.toLowerCase()) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      case 'zip':
      case 'rar': return '📦';
      default: return '📁';
    }
  }

  visualizarDocumento(documento: Documento): void {
    this.documentoSelecionado = documento;
    this.isViewMode = true;
    this.isModalOpen = true;
  }

  editarDocumento(documento: Documento): void {
    if (!this.authService.isAdmin()) return;

    this.documentoSelecionado = documento;
    this.isViewMode = false;

    this.documentoForm.patchValue({
      titulo: documento.titulo,
      descricao: documento.descricao,
      categoria: documento.categoria,
      autor: documento.autor,
      tags: documento.tags.join(', '),
      url: documento.url || ''
    });

    this.isModalOpen = true;
  }

  novoDocumento(): void {
    if (!this.authService.isAdmin()) return;

    this.documentoSelecionado = null;
    this.isViewMode = false;
    this.documentoForm.reset();
    this.documentoForm.patchValue({ categoria: 'Documentos Históricos' });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isViewMode = false;
    this.documentoSelecionado = null;
    this.documentoForm.reset();
  }

  salvarDocumento(): void {
    if (this.documentoForm.valid) {
      const formData = this.documentoForm.value;

      const documentoData: Documento = {
        id: this.documentoSelecionado ? this.documentoSelecionado.id : Date.now().toString(),
        titulo: formData.titulo,
        descricao: formData.descricao || '',
        categoria: formData.categoria,
        autor: formData.autor || 'Não informado',
        tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [],
        url: formData.url || undefined,
        dataUpload: this.documentoSelecionado ? this.documentoSelecionado.dataUpload : new Date(),
        tamanho: this.documentoSelecionado ? this.documentoSelecionado.tamanho : '0 KB',
        formato: this.documentoSelecionado ? this.documentoSelecionado.formato : 'PDF'
      };

      if (this.documentoSelecionado) {
        // Editar documento existente
        const index = this.documentos.findIndex(d => d.id === this.documentoSelecionado!.id);
        if (index !== -1) {
          this.documentos[index] = documentoData;
        }
      } else {
        // Adicionar novo documento
        this.documentos.push(documentoData);
      }

      this.aplicarFiltros();
      this.closeModal();
    }
  }

  excluirDocumento(documento: Documento): void {
    if (!this.authService.isAdmin()) return;

    if (confirm(`Tem certeza que deseja excluir o documento "${documento.titulo}"?`)) {
      this.documentos = this.documentos.filter(d => d.id !== documento.id);
      this.aplicarFiltros();
    }
  }

  baixarDocumento(documento: Documento): void {
    if (documento.url) {
      window.open(documento.url, '_blank');
    } else {
      alert('URL do documento não disponível');
    }
  }
}
