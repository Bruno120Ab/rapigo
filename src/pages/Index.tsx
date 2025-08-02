import { useState } from "react";
import { Car, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MototaxistaCard } from "@/components/MototaxistaCard";
import { SolicitarForm } from "@/components/SolicitarForm";
import { ConfirmacaoSolicitacao } from "@/components/ConfirmacaoSolicitacao";
import { useMototaxistas } from "@/hooks/useMototaxistas";
import { useSolicitacoes } from "@/hooks/useSolicitacoes";
import { Solicitacao } from "@/types/mototaxi";
import { useToast } from "@/hooks/use-toast";

type TelaTipo = 'inicial' | 'solicitar' | 'confirmacao' | 'gerenciar';

const Index = () => {
  const [telaAtual, setTelaAtual] = useState<TelaTipo>('inicial');
  const [ultimaSolicitacao, setUltimaSolicitacao] = useState<Solicitacao | null>(null);
  
  const { mototaxistasAtivos, quantidadeAtivos, mototaxistas, toggleStatus } = useMototaxistas();
  const { adicionarSolicitacao } = useSolicitacoes();
  const { toast } = useToast();

  const handleSolicitar = (dadosSolicitacao: Omit<Solicitacao, 'id'>) => {
    const solicitacao = adicionarSolicitacao(dadosSolicitacao);
    setUltimaSolicitacao(solicitacao);
    setTelaAtual('confirmacao');
    
    toast({
      title: "Solicitação enviada!",
      description: "Aguarde o contato do mototaxista.",
    });
  };

  const enviarWhatsApp = () => {
    if (!ultimaSolicitacao) return;
    
    // Pega o primeiro mototaxista ativo para enviar a mensagem
    const mototaxista = mototaxistasAtivos[0];
    if (!mototaxista) {
      toast({
        title: "Nenhum mototaxista ativo",
        description: "Não há mototaxistas disponíveis no momento.",
        variant: "destructive"
      });
      return;
    }

    const telefone = mototaxista.telefone.replace(/\D/g, '');
    const mensagem = `Olá, preciso de um moto-táxi no endereço: ${ultimaSolicitacao.endereco}`;
    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank');
  };

  const renderTela = () => {
    switch (telaAtual) {
      case 'solicitar':
        return (
          <SolicitarForm
            onSolicitar={handleSolicitar}
            onCancel={() => setTelaAtual('inicial')}
          />
        );
      
      case 'confirmacao':
        return ultimaSolicitacao ? (
          <ConfirmacaoSolicitacao
            solicitacao={ultimaSolicitacao}
            onVoltarInicio={() => setTelaAtual('inicial')}
            onEnviarWhatsApp={enviarWhatsApp}
          />
        ) : null;
      
      case 'gerenciar':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gerenciar Mototaxistas</h2>
              <Button 
                variant="outline" 
                onClick={() => setTelaAtual('inicial')}
              >
                Voltar
              </Button>
            </div>
            
            <div className="space-y-3">
              {mototaxistas.map((mototaxista) => (
                <MototaxistaCard
                  key={mototaxista.id}
                  mototaxista={mototaxista}
                  onToggleStatus={toggleStatus}
                  showToggle={true}
                />
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                <Car className="h-8 w-8 text-primary" />
                Moto-Táxi Express
              </h1>
              <p className="text-muted-foreground">
                Transporte rápido e seguro para sua cidade
              </p>
            </div>

            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Mototaxistas Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {quantidadeAtivos}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {quantidadeAtivos === 1 ? 'Mototaxista ativo' : 'Mototaxistas ativos'}
                    </div>
                  </div>
                  <Badge 
                    variant={quantidadeAtivos > 0 ? "default" : "secondary"}
                    className={quantidadeAtivos > 0 ? "bg-success text-success-foreground" : ""}
                  >
                    {quantidadeAtivos > 0 ? 'Disponível' : 'Indisponível'}
                  </Badge>
                </div>

                {/* Lista de mototaxistas ativos */}
                <div className="space-y-2">
                  {mototaxistasAtivos.map((mototaxista) => (
                    <MototaxistaCard
                      key={mototaxista.id}
                      mototaxista={mototaxista}
                      onToggleStatus={toggleStatus}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Botões de ação */}
            <div className="space-y-3">
              <Button
                onClick={() => setTelaAtual('solicitar')}
                disabled={quantidadeAtivos === 0}
                className="w-full h-14 text-lg"
                size="lg"
              >
                <Car className="h-5 w-5 mr-2" />
                Solicitar Moto-Táxi
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setTelaAtual('gerenciar')}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar Mototaxistas
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {renderTela()}
      </div>
    </div>
  );
};

export default Index;
