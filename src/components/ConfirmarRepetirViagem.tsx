import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Solicitacao } from "@/types/mototaxi";
import { MapPin, Clock, User, Bike } from "lucide-react";

interface ConfirmarRepetirViagemProps {
  viagem: Solicitacao | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (viagem: Solicitacao) => void;
}

export const ConfirmarRepetirViagem = ({ 
  viagem, 
  isOpen, 
  onClose, 
  onConfirmar 
}: ConfirmarRepetirViagemProps) => {
  const [loading, setLoading] = useState(false);

  if (!viagem) return null;

  const handleConfirmar = async () => {
    setLoading(true);
    
    // Criar nova solicitação baseada na viagem anterior
    const novaViagem: Solicitacao = {
      ...viagem,
      id: Date.now().toString(),
      dataHora: new Date(),
      status: 'pendente'
    };
    
    onConfirmar(novaViagem);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Repetir Viagem
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Deseja repetir esta viagem com os mesmos dados?
          </div>
          
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-2">
              <Bike className="h-4 w-4 mt-1 text-primary" />
              <div>
                <div className="font-medium">{viagem.motoBoy}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 mt-1 text-primary" />
              <div>
                <div className="font-medium">{viagem.nome}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 text-primary" />
              <div>
                <div className="text-sm font-medium">Origem:</div>
                <div className="text-sm text-muted-foreground">{viagem.endereco}</div>
              </div>
            </div>
            
            {viagem.destino && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Destino:</div>
                  <div className="text-sm text-muted-foreground">{viagem.destino}</div>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">
                   {viagem.isAgendamento ? (
                    'Viagem agendada :'
                    ) : (
                    'Viagem original :'
                    )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {viagem.dataHora.toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
         <>
          {viagem.isAgendamento ? (
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Agende uma nova Viagem
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmar}
                disabled={loading}
              >
                {loading ? "Confirmando..." : "Confirmar Viagem"}
              </Button>
            </>
          )}
        </>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};