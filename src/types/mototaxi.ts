export interface Mototaxista {
  id: string;
  nome: string;
  telefone: string;
  foto: string;
  ativo: boolean;
  tipoVeiculo: 'moto' | 'carro';
}

export interface Solicitacao {
  id: string;
  nome: string;
  endereco: string;
  destino?: string;
  coordenadasOrigem?: { lat: number; lng: number };
  coordenadasDestino?: { lat: number; lng: number };
  dataHora: Date;
  dataAgendamento?: Date;
  status: 'pendente' | 'aceita' | 'concluida';
  isAgendamento?: boolean;
}

export type StatusMototaxista = 'ativo' | 'inativo';