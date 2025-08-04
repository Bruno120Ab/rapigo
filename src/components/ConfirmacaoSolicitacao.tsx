import { CheckCircle, MessageCircle, Home } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Solicitacao } from "@/types/mototaxi";

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
  const formatarHora = (data: Date) => {
    return data.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Enviar automaticamente para WhatsApp quando componente montar
  useEffect(() => {
    const timer = setTimeout(() => {
      onEnviarWhatsApp();
    }, 1500); // Espera 1.5 segundos para mostrar a confirmação

    return () => clearTimeout(timer);
  }, [onEnviarWhatsApp]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <CheckCircle className="h-16 w-16 text-success mx-auto" />
        </div>
        <CardTitle className="text-success">Solicitação Enviada!</CardTitle>
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
          <p className="text-sm text-success font-medium">
            ✅ Enviando automaticamente para o WhatsApp...
          </p>
        </div>
        
        <div className="space-y-2">
          <Button
            onClick={onEnviarWhatsApp}
            className="w-full bg-success hover:bg-success/90"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Enviar pelo WhatsApp
          </Button>
          
          <Button
            variant="outline"
            onClick={onVoltarInicio}
            className="w-full"
          >
            <Home className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};