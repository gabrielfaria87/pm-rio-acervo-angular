export interface Policial {
  id: string;
  nome: string;
  graduacao: string;
  secao: string;
  funcao: string;
  foto?: string;
  email?: string;
  telefone?: string;
  dataIngresso?: Date;
  ativo: boolean;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'comum' | 'prioritaria';
  status: 'pendente' | 'em-andamento' | 'concluida';
  prioridade?: 'Alta' | 'Média' | 'Baixa'; // Compatibilidade com o componente
  secaoDestino: string;
  secaoId?: number; // Compatibilidade com o componente
  responsavelId: string;
  policialId?: number; // Compatibilidade com o componente
  dataInicio: Date;
  dataFim: Date;
  dataVencimento?: Date; // Compatibilidade com o componente
  criadoPor: string;
  criadoEm: Date;
}

export interface Secao {
  id: string;
  nome: string;
  descricao: string;
  cor?: string; // Compatibilidade com o componente
  responsavel?: string;
  metas: Meta[];
}

export interface Meta {
  id: string;
  titulo: string;
  descricao: string;
  responsavelId: string;
  dataLimite: Date;
  status: 'pendente' | 'em-andamento' | 'concluida';
  progresso: number; // 0-100
}

export interface EventoHistorico {
  id: string;
  titulo: string;
  descricao: string;
  data: Date;
  tipo: 'evento' | 'conquista' | 'marco';
  imagem?: string;
}

export interface PostIt {
  id: string;
  texto: string;
  cor: string;
  posicaoX: number;
  posicaoY: number;
  largura: number;
  altura: number;
  criadoPor: string;
  criadoEm: Date;
}

export interface Usuario {
  id: string;
  username: string;
  nome: string;
  email: string;
  tipo: 'admin' | 'usuario';
  ativo: boolean;
  ultimoLogin?: Date;
}
