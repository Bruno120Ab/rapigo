import { CheckCircle, MapPin, User, Phone, MessageCircle, Clock, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mototaxista, Solicitacao } from "@/types/mototaxi";
import { useMototaxistas } from "@/hooks/useMototaxistas";
import { enviarNotificacao } from "@/hooks/use-notification";

interface ConfirmacaoSolicitacaoProps {
  solicitacao: Solicitacao;
  onVoltarInicio: () => void;
  onEnviarWhatsApp: () => void;
}

export const ConfirmacaoSolicitacao = ({ 
  solicitacao, 
  onVoltarInicio, 
  onEnviarWhatsApp 
}: ConfirmacaoSolicitacaoProps) => {
  const { mototaxistasAtivos } = useMototaxistas();
  
  const formatarHora = (data: Date) => {
    return data.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const [motoboySelecionado, setMotoboySelecionado] = useState<Mototaxista | null>(null);
  
    useEffect(() => {
      const dados = localStorage.getItem("mototaxista");
      if (dados) {
        try {
          const obj = JSON.parse(dados);
          setMotoboySelecionado(obj);
        } catch (e) {
          console.error("Erro ao fazer parse do mototaxista:", e);
        }
      }
    }, [solicitacao]); // Adicionar solicitacao como dependência para atualizar quando refazer viagem
 

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <CheckCircle className="h-16 w-16 text-success mx-auto" />
        </div>
        
        {solicitacao.isAgendamento && (
          <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-4">
            <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <div className="font-medium text-orange-900 dark:text-orange-100">Corrida Agendada</div>
              <div className="text-sm text-orange-700 dark:text-orange-300">
                {solicitacao.dataAgendamento?.toLocaleDateString('pt-BR')} às {solicitacao.dataAgendamento?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        )}
        <CardTitle className="text-success">Revise sua solicitação!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            Solicitação registrada às {formatarHora(solicitacao.dataHora)}
          </p>
          <div className="space-y-1">
            <p className="font-medium">
              👤 Nome: {solicitacao.nome}
            </p>
            <p className="font-medium">
              📍 Origem: {solicitacao.endereco}
            </p>
            {solicitacao.destino && (
              <p className="font-medium">
                🎯 Destino: {solicitacao.destino}
              </p>
            )}
            
          </div>
          
          <div className="bg-muted/50 p-3 rounded-lg space-y-2">

            <div className="space-y-1">
              <p className="text-sm font-medium">Seu Motoboy :</p>
             <div className="space-y-1">
            <div className="space-y-1 flex flex-col items-center">
              {motoboySelecionado ? (
                <div className="text-sm text-muted-foreground space-y-1 text-center">
                  <p><strong>Nome:</strong> {motoboySelecionado.nome}</p>
                  <p><strong>Telefone:</strong> {motoboySelecionado.telefone}</p>
                  <p><strong>Foto:</strong></p>
                  {motoboySelecionado.foto ? (
                    <img src={motoboySelecionado.foto} alt={motoboySelecionado.nome} className="h-20 w-20 rounded-full" />
                  ) : (
                    <span>Sem foto disponível</span>
                  )}
                </div>
              ) : (
                <p>Nenhum motoboy selecionado.</p>
              )}
            </div>
</div>
            </div>
            
            <p className="text-sm text-muted-foreground font-medium">
              💰 Valor a negociar diretamente com o motorista
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Conclua a solicitação enviando a mensagem para o whatsapp
          </p>
        </div>
        
        <div className="space-y-2">
          <Button
            onClick={() => {
            onEnviarWhatsApp();
            enviarNotificacao();
            }}            className="w-full bg-success hover:bg-success/90"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Enviar pelo WhatsApp
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem('mototaxista'); // Limpa todos os dados do localStorage
              onVoltarInicio();     // Executa a função que você já tinha
            }}
            className="w-full"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};