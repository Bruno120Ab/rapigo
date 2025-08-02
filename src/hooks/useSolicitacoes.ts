import { useState } from "react";
import { Solicitacao } from "@/types/mototaxi";

export const useSolicitacoes = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

  const adicionarSolicitacao = (novaSolicitacao: Omit<Solicitacao, 'id'>): Solicitacao => {
    const solicitacao: Solicitacao = {
      ...novaSolicitacao,
      id: Date.now().toString()
    };
    
    setSolicitacoes(prev => [...prev, solicitacao]);
    return solicitacao;
  };

  return {
    solicitacoes,
    adicionarSolicitacao
  };
};