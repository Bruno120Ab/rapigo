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
  destino?: string;
  coordenadasOrigem?: { lat: number; lng: number };
  coordenadasDestino?: { lat: number; lng: number };
  dataHora: Date;
  status: 'pendente' | 'aceita' | 'concluida';
}

export type StatusMototaxista = 'ativo' | 'inativo';