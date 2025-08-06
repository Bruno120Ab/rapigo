import { useState, useEffect } from "react";
import { Solicitacao } from "@/types/mototaxi";

interface Avaliacao {
  estrelas: number;
  aceita: boolean;
  feedback: string;
}

export const useAvaliacoes = () => {
  const calcularMetricasMotorista = (motoboyId: string, historico: Solicitacao[]) => {
    const viagensDoMotorista = historico.filter(v => v.motoBoy === motoboyId);
    
    if (viagensDoMotorista.length === 0) {
      return { mediaEstrelas: 0, taxaAceite: 0 };
    }

    const avaliacoesSalvas = localStorage.getItem("avaliacoes-viagens");
    const avaliacoes = avaliacoesSalvas ? JSON.parse(avaliacoesSalvas) : {};
    
    let totalEstrelas = 0;
    let viagensAvaliadas = 0;
    let viagensAceitas = 0;
    
    viagensDoMotorista.forEach(viagem => {
      const avaliacao = avaliacoes[viagem.id];
      if (avaliacao) {
        totalEstrelas += avaliacao.estrelas;
        viagensAvaliadas++;
        if (avaliacao.aceita) {
          viagensAceitas++;
        }
      }
    });
    
    const mediaEstrelas = viagensAvaliadas > 0 ? totalEstrelas / viagensAvaliadas : 0;
    const taxaAceite = viagensDoMotorista.length > 0 ? (viagensAceitas / viagensDoMotorista.length) * 100 : 0;
    
    return { mediaEstrelas, taxaAceite };
  };

  return {
    calcularMetricasMotorista
  };
};