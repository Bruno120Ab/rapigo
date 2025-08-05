import { History, MapPin, Calendar, Bike } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Solicitacao } from "@/types/mototaxi";

interface HistoricoSectionProps {
  historico: Solicitacao[];
  onReutilizarViagem: (solicitacao: Solicitacao) => void;
}

export const HistoricoSection = ({ historico, onReutilizarViagem }: HistoricoSectionProps) => {
  if (historico.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Últimas Viagens
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {historico.map((viagem) => (
            <Button
              key={viagem.id}
              variant="outline"
              className="w-full justify-start h-auto p-3"
              onClick={() => onReutilizarViagem(viagem)}
            >
              <div className="flex flex-col items-start gap-1 w-full">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{viagem.endereco}</span>
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
                {viagem.motoBoy&& (
                  <div className="flex items-center gap-2 ml-6">
                    <Bike className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{viagem.motoBoy}</span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground ml-6">
                  {viagem.isAgendamento ? 'Agendada para: ' : ''}
                  {viagem.dataHora.toLocaleDateString('pt-BR')} {viagem.dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};