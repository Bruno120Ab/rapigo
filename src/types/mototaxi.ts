export interface Mototaxista {
  id: string;
  nome: string;
  telefone: string;
  foto: string;
  ativo: boolean;
}

export interface Solicitacao {
  id: string;
  endereco: string;
  dataHora: Date;
  status: 'pendente' | 'aceita' | 'concluida';
}

export type StatusMototaxista = 'ativo' | 'inativo';