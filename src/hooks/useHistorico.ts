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
    const novoHistorico = [solicitacao, ...historico].slice(0, 5); // Manter apenas as últimas 5
    setHistorico(novoHistorico);
    localStorage.setItem("historico-viagens", JSON.stringify(novoHistorico));
  };

  return {
    historico,
    adicionarViagem
  };
};