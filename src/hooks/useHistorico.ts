import { useState, useEffect } from "react";
import { Solicitacao } from "@/types/mototaxi";

export const useHistorico = () => {
  const [historico, setHistorico] = useState<Solicitacao[]>([]);

  useEffect(() => {
    const historicoSalvo = localStorage.getItem("historico-viagens");
    if (historicoSalvo) {
      const dados = JSON.parse(historicoSalvo);
      // Converter strings de data de volta para objetos Date
      const historicoComDatas = dados.map((item: any) => ({
        ...item,
        dataHora: new Date(item.dataHora)
      }));
      setHistorico(historicoComDatas);
    }
  }, []);

  const adicionarViagem = (solicitacao: Solicitacao) => {
    const novoHistorico = [solicitacao, ...historico].slice(0, 15); // Manter apenas as últimas 15
    setHistorico(novoHistorico);
    localStorage.setItem("historico-viagens", JSON.stringify(novoHistorico));
  };

  const adicionarAvaliacao = (viagemId: string, avaliacao: { estrelas: number; aceita: boolean; feedback: string }) => {
    const avaliacoesSalvas = localStorage.getItem("avaliacoes-viagens");
    const avaliacoes = avaliacoesSalvas ? JSON.parse(avaliacoesSalvas) : {};
    avaliacoes[viagemId] = avaliacao;
    localStorage.setItem("avaliacoes-viagens", JSON.stringify(avaliacoes));
    
    // Dispara evento customizado para notificar outros hooks
    window.dispatchEvent(new CustomEvent('avaliacaoAdicionada', { 
      detail: { viagemId, avaliacao } 
    }));
  };

  const obterAvaliacao = (viagemId: string) => {
    const avaliacoesSalvas = localStorage.getItem("avaliacoes-viagens");
    if (!avaliacoesSalvas) return null;
    const avaliacoes = JSON.parse(avaliacoesSalvas);
    return avaliacoes[viagemId] || null;
  };

  return {
    historico,
    adicionarViagem,
    adicionarAvaliacao,
    obterAvaliacao
  };
};