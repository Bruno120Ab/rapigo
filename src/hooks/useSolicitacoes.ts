import { useState } from "react";
import { Solicitacao } from "@/types/mototaxi";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook para salvar pedidos no banco de dados (Lovable Cloud)
 * Quando o usuário estiver logado, os pedidos são salvos automaticamente
 */
export const useSolicitacoes = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

  /**
   * Adiciona uma nova solicitação tanto localmente quanto no banco (se usuário logado)
   */
  const adicionarSolicitacao = async (novaSolicitacao: Omit<Solicitacao, 'id'>): Promise<Solicitacao> => {
    // Criar solicitação local com ID temporário
    const solicitacaoLocal: Solicitacao = {
      ...novaSolicitacao,
      id: Date.now().toString()
    };
    
    setSolicitacoes(prev => [...prev, solicitacaoLocal]);

    // Tentar salvar no banco de dados se usuário estiver logado
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('pedidos')
          .insert({
            cliente_id: user.id,
            nome_cliente: novaSolicitacao.nome,
            endereco_origem: novaSolicitacao.endereco,
            endereco_destino: novaSolicitacao.destino || null,
            tipo_servico: novaSolicitacao.serviceType || 'corrida',
            status: 'pendente',
            data_solicitacao: novaSolicitacao.dataHora.toISOString(),
            data_agendamento: novaSolicitacao.dataAgendamento?.toISOString() || null,
            coordenadas_origem: novaSolicitacao.coordenadasOrigem 
              ? JSON.stringify(novaSolicitacao.coordenadasOrigem) 
              : null,
            coordenadas_destino: novaSolicitacao.coordenadasDestino 
              ? JSON.stringify(novaSolicitacao.coordenadasDestino) 
              : null,
            observacoes: null
          })
          .select()
          .single();

        if (error) {
          console.error('Erro ao salvar pedido no banco:', error);
          toast.error('Pedido salvo localmente, mas não foi possível sincronizar com o servidor');
        } else if (data) {
          // Atualizar o ID local com o ID do banco
          solicitacaoLocal.id = data.id;
          console.log('Pedido salvo no banco com sucesso:', data);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar usuário ou salvar pedido:', error);
    }

    return solicitacaoLocal;
  };

  return {
    solicitacoes,
    adicionarSolicitacao
  };
};