import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../services/auth';

interface PostIt {
  id: string;
  texto: string;
  cor: string;
  posicaoX: number;
  posicaoY: number;
  largura: number;
  altura: number;
  autor: string;
  datacriacao: Date;
}

interface ElementoDesenho {
  id: string;
  tipo: 'linha' | 'retangulo' | 'circulo' | 'texto';
  x1: number;
  y1: number;
  x2?: number;
  y2?: number;
  largura?: number;
  altura?: number;
  cor: string;
  espessura: number;
  texto?: string;
}

@Component({
  selector: 'app-gestao-visual',
  imports: [CommonModule, Navbar, ReactiveFormsModule, FormsModule],
  templateUrl: './gestao-visual.html',
  styleUrl: './gestao-visual.scss'
})
export class GestaoVisual implements OnInit, AfterViewInit {
  @ViewChild('quadroCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private startX = 0;
  private startY = 0;
  
  postIts: PostIt[] = [];
  elementosDesenho: ElementoDesenho[] = [];
  
  // Ferramentas
  ferramentaSelecionada: 'postit' | 'linha' | 'retangulo' | 'circulo' | 'texto' | 'borracha' = 'postit';
  corSelecionada = '#000000';
  espessuraSelecionada = 2;
  
  // Modal Post-it
  isModalPostItOpen = false;
  postItForm: FormGroup;
  postItSelecionado: PostIt | null = null;
  
  // Cores disponíveis para post-its
  coresPostIt = [
    { nome: 'Amarelo', valor: '#FFEB3B' },
    { nome: 'Rosa', valor: '#E91E63' },
    { nome: 'Verde', valor: '#4CAF50' },
    { nome: 'Azul', valor: '#2196F3' },
    { nome: 'Laranja', valor: '#FF9800' },
    { nome: 'Roxo', valor: '#9C27B0' }
  ];

  constructor(
    private fb: FormBuilder,
    public authService: AuthService
  ) {
    this.postItForm = this.fb.group({
      texto: ['', [Validators.required, Validators.maxLength(200)]],
      cor: ['#FFEB3B', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  ngAfterViewInit(): void {
    this.inicializarCanvas();
  }

  private inicializarCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    // Definir tamanho do canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = 600;
    
    // Configurar contexto
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    this.redesenharQuadro();
  }

  private carregarDados(): void {
    // Dados mockados para demonstração
    this.postIts = [
      {
        id: '1',
        texto: 'Revisar documentos históricos',
        cor: '#FFEB3B',
        posicaoX: 100,
        posicaoY: 150,
        largura: 150,
        altura: 120,
        autor: 'João Silva',
        datacriacao: new Date('2024-01-15')
      },
      {
        id: '2',
        texto: 'Implementar sistema digital',
        cor: '#4CAF50',
        posicaoX: 300,
        posicaoY: 200,
        largura: 150,
        altura: 120,
        autor: 'Maria Santos',
        datacriacao: new Date('2024-01-16')
      },
      {
        id: '3',
        texto: 'Reunião semanal - Sexta 14h',
        cor: '#E91E63',
        posicaoX: 500,
        posicaoY: 100,
        largura: 150,
        altura: 120,
        autor: 'Pedro Costa',
        datacriacao: new Date('2024-01-17')
      }
    ];
  }

  selecionarFerramenta(ferramenta: 'postit' | 'linha' | 'retangulo' | 'circulo' | 'texto' | 'borracha'): void {
    this.ferramentaSelecionada = ferramenta;
  }

  onCanvasMouseDown(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.startX = event.clientX - rect.left;
    this.startY = event.clientY - rect.top;
    
    if (this.ferramentaSelecionada === 'postit') {
      this.criarPostIt(this.startX, this.startY);
    } else {
      this.isDrawing = true;
    }
  }

  onCanvasMouseMove(event: MouseEvent): void {
    if (!this.isDrawing) return;
    
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;
    
    this.redesenharQuadro();
    
    // Desenhar preview da forma sendo criada
    this.ctx.strokeStyle = this.corSelecionada;
    this.ctx.lineWidth = this.espessuraSelecionada;
    
    switch (this.ferramentaSelecionada) {
      case 'linha':
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(currentX, currentY);
        this.ctx.stroke();
        break;
        
      case 'retangulo':
        this.ctx.beginPath();
        this.ctx.rect(this.startX, this.startY, currentX - this.startX, currentY - this.startY);
        this.ctx.stroke();
        break;
        
      case 'circulo':
        const radius = Math.sqrt(Math.pow(currentX - this.startX, 2) + Math.pow(currentY - this.startY, 2));
        this.ctx.beginPath();
        this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        break;
    }
  }

  onCanvasMouseUp(event: MouseEvent): void {
    if (!this.isDrawing) return;
    
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const endX = event.clientX - rect.left;
    const endY = event.clientY - rect.top;
    
    // Salvar elemento desenho
    if (this.ferramentaSelecionada !== 'postit') {
      this.salvarElementoDesenho(this.startX, this.startY, endX, endY);
    }
    
    this.isDrawing = false;
  }

  private salvarElementoDesenho(x1: number, y1: number, x2: number, y2: number): void {
    const elemento: ElementoDesenho = {
      id: Date.now().toString(),
      tipo: this.ferramentaSelecionada as 'linha' | 'retangulo' | 'circulo',
      x1,
      y1,
      x2,
      y2,
      cor: this.corSelecionada,
      espessura: this.espessuraSelecionada
    };
    
    if (this.ferramentaSelecionada === 'retangulo') {
      elemento.largura = Math.abs(x2 - x1);
      elemento.altura = Math.abs(y2 - y1);
    }
    
    this.elementosDesenho.push(elemento);
    this.redesenharQuadro();
  }

  private redesenharQuadro(): void {
    if (!this.ctx) return;
    
    // Limpar canvas
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    
    // Desenhar fundo
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    
    // Desenhar elementos de desenho
    this.elementosDesenho.forEach(elemento => {
      this.ctx.strokeStyle = elemento.cor;
      this.ctx.lineWidth = elemento.espessura;
      
      switch (elemento.tipo) {
        case 'linha':
          this.ctx.beginPath();
          this.ctx.moveTo(elemento.x1, elemento.y1);
          this.ctx.lineTo(elemento.x2!, elemento.y2!);
          this.ctx.stroke();
          break;
          
        case 'retangulo':
          this.ctx.beginPath();
          this.ctx.rect(elemento.x1, elemento.y1, elemento.largura!, elemento.altura!);
          this.ctx.stroke();
          break;
          
        case 'circulo':
          const radius = Math.sqrt(Math.pow(elemento.x2! - elemento.x1, 2) + Math.pow(elemento.y2! - elemento.y1, 2));
          this.ctx.beginPath();
          this.ctx.arc(elemento.x1, elemento.y1, radius, 0, 2 * Math.PI);
          this.ctx.stroke();
          break;
      }
    });
  }

  criarPostIt(x: number, y: number): void {
    this.postItSelecionado = null;
    this.postItForm.reset();
    this.postItForm.patchValue({ cor: '#FFEB3B' });
    this.isModalPostItOpen = true;
    
    // Salvar posição para criar o post-it
    this.startX = x;
    this.startY = y;
  }

  editarPostIt(postIt: PostIt): void {
    if (!this.authService.isAdmin()) return;
    
    this.postItSelecionado = postIt;
    this.postItForm.patchValue({
      texto: postIt.texto,
      cor: postIt.cor
    });
    this.isModalPostItOpen = true;
  }

  salvarPostIt(): void {
    if (this.postItForm.valid) {
      const formData = this.postItForm.value;
      
      if (this.postItSelecionado) {
        // Editar post-it existente
        this.postItSelecionado.texto = formData.texto;
        this.postItSelecionado.cor = formData.cor;
      } else {
        // Criar novo post-it
        const novoPostIt: PostIt = {
          id: Date.now().toString(),
          texto: formData.texto,
          cor: formData.cor,
          posicaoX: this.startX - 75, // Centralizar
          posicaoY: this.startY - 60,
          largura: 150,
          altura: 120,
          autor: this.authService.getCurrentUser()?.nome || 'Usuário',
          datacriacao: new Date()
        };
        
        this.postIts.push(novoPostIt);
      }
      
      this.closeModal();
    }
  }

  excluirPostIt(postIt: PostIt): void {
    if (!this.authService.isAdmin()) return;
    
    if (confirm(`Tem certeza que deseja excluir este post-it?`)) {
      this.postIts = this.postIts.filter(p => p.id !== postIt.id);
    }
  }

  limparQuadro(): void {
    if (!this.authService.isAdmin()) return;
    
    if (confirm('Tem certeza que deseja limpar todo o quadro?')) {
      this.postIts = [];
      this.elementosDesenho = [];
      this.redesenharQuadro();
    }
  }

  closeModal(): void {
    this.isModalPostItOpen = false;
    this.postItSelecionado = null;
    this.postItForm.reset();
  }

  getCorNome(cor: string): string {
    const corEncontrada = this.coresPostIt.find(c => c.valor === cor);
    return corEncontrada ? corEncontrada.nome : 'Personalizada';
  }
}
