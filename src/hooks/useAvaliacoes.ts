import { useState, useEffect, useCallback } from "react";
import { Solicitacao } from "@/types/mototaxi";

interface Avaliacao {
  estrelas: number;
  aceita: boolean;
  feedback: string;
}

export const useAvaliacoes = () => {
  const [avaliacoes, setAvaliacoes] = useState<Record<string, Avaliacao>>({});
  const [versaoAvaliacoes, setVersaoAvaliacoes] = useState(0);

  // Carrega avaliações do localStorage
  useEffect(() => {
    const carregarAvaliacoes = () => {
      const avaliacoesSalvas = localStorage.getItem("avaliacoes-viagens");
      if (avaliacoesSalvas) {
        try {
          setAvaliacoes(JSON.parse(avaliacoesSalvas));
        } catch (error) {
          console.error("Erro ao carregar avaliações:", error);
          setAvaliacoes({});
        }
      }
    };

    carregarAvaliacoes();

    // Listener para mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "avaliacoes-viagens") {
        carregarAvaliacoes();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const adicionarAvaliacao = useCallback((viagemId: string, avaliacao: Avaliacao) => {
    const novasAvaliacoes = { ...avaliacoes, [viagemId]: avaliacao };
    setAvaliacoes(novasAvaliacoes);
    localStorage.setItem("avaliacoes-viagens", JSON.stringify(novasAvaliacoes));
    setVersaoAvaliacoes(prev => prev + 1); // Força re-render dos componentes que dependem das métricas
  }, [avaliacoes]);

  const calcularMetricasMotorista = useCallback((motoboyId: string, historico: Solicitacao[]) => {
    const viagensDoMotorista = historico.filter(v => v.motoBoy === motoboyId);
    
    if (viagensDoMotorista.length === 0) {
      return { mediaEstrelas: 0, taxaAceite: 0, totalViagens: 0, viagensAvaliadas: 0 };
    }

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
    
    return { 
      mediaEstrelas, 
      taxaAceite, 
      totalViagens: viagensDoMotorista.length,
      viagensAvaliadas
    };
  }, [avaliacoes, versaoAvaliacoes]);

  const obterAvaliacao = useCallback((viagemId: string) => {
    return avaliacoes[viagemId] || null;
  }, [avaliacoes]);

  return {
    avaliacoes,
    calcularMetricasMotorista,
    adicionarAvaliacao,
    obterAvaliacao
  };
};