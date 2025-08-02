import { Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mototaxista } from "@/types/mototaxi";

interface MototaxistaCardProps {
  mototaxista: Mototaxista;
  onToggleStatus: (id: string) => void;
  showToggle?: boolean;
}

export const MototaxistaCard = ({ 
  mototaxista, 
  onToggleStatus, 
  showToggle = false 
}: MototaxistaCardProps) => {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={mototaxista.foto} alt={mototaxista.nome} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{mototaxista.nome}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{mototaxista.telefone}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant={mototaxista.ativo ? "default" : "secondary"}
              className={mototaxista.ativo ? "bg-success text-success-foreground" : ""}
            >
              {mototaxista.ativo ? "Ativo" : "Inativo"}
            </Badge>
            
            {showToggle && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleStatus(mototaxista.id)}
              >
                {mototaxista.ativo ? "Desativar" : "Ativar"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};