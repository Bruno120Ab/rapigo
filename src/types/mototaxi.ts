export interface Mototaxista {
  id: string;
  nome: string;
  telefone: string;
  foto: string;
  status: boolean;
  tipoVeiculo: 'moto' | 'carro' ;
  modelo: string;
  detalhes: string;
  detalhes_foto:string;
  ponto: string;
  Grupo: string;
  ativo?: boolean

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

export type StatusMototaxista = 'ativo' | 'Indisponível';