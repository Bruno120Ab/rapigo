import { Phone, User, Heart, HeartOff, Car, Bike, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mototaxista } from "@/types/mototaxi";

interface MototaxistaCardProps {
  mototaxista: Mototaxista;
  onToggleStatus: (id: string) => void;
  showToggle?: boolean;
  onSelecionar?: (mototaxista: Mototaxista) => void;
  isFavorito?: boolean;
  onToggleFavorito?: (mototaxista: Mototaxista) => void;
  showFavoriteButton?: boolean;
  metricas?: { mediaEstrelas: number; taxaAceite: number; totalViagens: number; viagensAvaliadas: number };
}

export const MototaxistaCard = ({ 
  mototaxista, 
  onToggleStatus, 
  showToggle = false,
  onSelecionar,
  isFavorito = false,
  onToggleFavorito,
  showFavoriteButton = false,
  metricas
}: MototaxistaCardProps) => {
  const renderMetricas = () => {
    if (!metricas || metricas.totalViagens === 0) return null;
    
    return (
      <div className="flex items-center gap-3 mt-1">
        {metricas.mediaEstrelas > 0 && (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-muted-foreground">
              {metricas.mediaEstrelas.toFixed(1)} ({metricas.viagensAvaliadas})
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3 text-green-600" />
          <span className="text-sm text-muted-foreground">
            {Math.round(metricas.taxaAceite)}% aceite
          </span>
        </div>
      </div>
    );
  };

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
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{mototaxista.nome}</h3>
                {mototaxista.tipoVeiculo === 'carro' ? (
                  <Car className="h-4 w-4 text-primary" />
                ) : (
                  <Bike className="h-4 w-4 text-primary" />
                )}
              </div>
              
              {/* Métricas do motorista */}
              {renderMetricas()}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              {showFavoriteButton && onToggleFavorito && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorito(mototaxista)}
                >
                  {isFavorito ? (
                    <Heart className="h-4 w-4 fill-primary text-primary" />
                  ) : (
                    <HeartOff className="h-4 w-4" />
                  )}
                </Button>
              )}
              
              {mototaxista.ativo && onSelecionar ? (
                <Button
                  onClick={() => onSelecionar(mototaxista)}
                  size="sm"
                >
                  Detalhar
                </Button>
              ) : (
                <Badge 
                  variant={mototaxista.ativo ? "default" : "secondary"}
                  className={mototaxista.ativo ? "bg-success text-success-foreground" : ""}
                >
                  {mototaxista.ativo ? "Disponível" : "Inativo"}
                </Badge>
              )}
            </div>
            
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