import { useState } from "react";
import { History, MapPin, Calendar, Bike, ChevronDown, ChevronUp, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Solicitacao } from "@/types/mototaxi";
import { AvaliacaoModal } from "@/components/AvaliacaoModal";

interface HistoricoSectionProps {
  historico: Solicitacao[];
  onReutilizarViagem: (solicitacao: Solicitacao) => void;
  onSalvarAvaliacao: (viagemId: string, avaliacao: { estrelas: number; aceita: boolean; feedback: string }) => void;
  obterAvaliacao: (viagemId: string) => { estrelas: number; aceita: boolean; feedback: string } | null;
}

export const HistoricoSection = ({ 
  historico, 
  onReutilizarViagem, 
  onSalvarAvaliacao, 
  obterAvaliacao 
}: HistoricoSectionProps) => {
  const [expandido, setExpandido] = useState(false);
  const [viagemSelecionada, setViagemSelecionada] = useState<Solicitacao | null>(null);
  const [modalAvaliacaoAberto, setModalAvaliacaoAberto] = useState(false);

  if (historico.length === 0) return null;

  const viagensExibidas = expandido ? historico : historico.slice(0, 5);

  const handleAbrirDetalhes = (viagem: Solicitacao, event: React.MouseEvent) => {
    event.stopPropagation();
    setViagemSelecionada(viagem);
    setModalAvaliacaoAberto(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Últimas Viagens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {viagensExibidas.map((viagem) => {
              const avaliacao = obterAvaliacao(viagem.id);
              return (
                <div key={viagem.id} className="relative">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-3"
                    onClick={() => onReutilizarViagem(viagem)}
                  >
                    <div className="flex flex-col items-start gap-1 w-full">
                      <div className="flex items-center gap-2 w-full">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm flex-1">{viagem.endereco}</span>
                        {avaliacao && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{avaliacao.estrelas}</span>
                          </div>
                        )}
                        {viagem.isAgendamento && (
                          <Calendar className="h-3 w-3 text-orange-500" />
                        )}
                      </div>
                      {viagem.destino && (
                        <div className="flex items-center gap-2 ml-6">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{viagem.destino}</span>
                        </div>
                      )}
                      {viagem.motoBoy && (
                        <div className="flex items-center gap-2 ml-6">
                          <Bike className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{viagem.motoBoy}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between w-full ml-6">
                        <span className="text-xs text-muted-foreground">
                          {viagem.isAgendamento ? 'Agendada para: ' : ''}
                          {viagem.dataHora.toLocaleDateString('pt-BR')} {viagem.dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={(e) => handleAbrirDetalhes(viagem, e)}
                        >
                          Avaliar
                        </Button>
                      </div>
                    </div>
                  </Button>
                </div>
              );
            })}
            
            {historico.length > 5 && (
              <Button
                variant="ghost"
                onClick={() => setExpandido(!expandido)}
                className="w-full"
              >
                {expandido ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Mostrar menos
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Expandir ({historico.length - 5} mais)
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AvaliacaoModal
        viagem={viagemSelecionada}
        isOpen={modalAvaliacaoAberto}
        onClose={() => {
          setModalAvaliacaoAberto(false);
          setViagemSelecionada(null);
        }}
        onSalvarAvaliacao={onSalvarAvaliacao}
        avaliacaoExistente={viagemSelecionada ? obterAvaliacao(viagemSelecionada.id) : null}
      />
    </>
  );
};