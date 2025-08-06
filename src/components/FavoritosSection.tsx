import { Heart, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Mototaxista } from "@/types/mototaxi";

interface FavoritosSectionProps {
  favoritos: Mototaxista[];
  onSelecionarFavorito: (mototaxista: Mototaxista) => void;
  onRemoverFavorito: (id: string) => void;
}

export const FavoritosSection = ({ favoritos, onSelecionarFavorito, onRemoverFavorito }: FavoritosSectionProps) => {
  if (favoritos.length === 0) return null;
 

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Meus Favoritos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {favoritos.map((mototaxista) => (
            <div key={mototaxista.id} className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex-1 justify-start h-auto p-3"
                onClick={() => onSelecionarFavorito(mototaxista)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={mototaxista.foto} alt={mototaxista.nome} /> 
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{mototaxista.nome}</span>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoverFavorito(mototaxista.id)}
                className="h-10 w-10 p-0 text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
