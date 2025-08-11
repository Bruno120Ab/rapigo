export interface Mototaxista {
  id: string;
  nome: string;
  telefone: string;
  foto: string;
  ativo: boolean;
  tipoVeiculo: 'moto' | 'carro';
  detalhes: string;
  detalhes_foto:string;
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
  motoBoy: string;
  idmotoBoy: string;
  serviceType?: 'corrida' | 'entrega' | 'coleta' | 'buscar_pessoa';
}

export type StatusMototaxista = 'ativo' | 'inativo';