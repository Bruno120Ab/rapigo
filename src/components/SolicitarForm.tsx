import { useState } from "react";
import { MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Solicitacao } from "@/types/mototaxi";

interface SolicitarFormProps {
  onSolicitar: (solicitacao: Omit<Solicitacao, 'id'>) => void;
  onCancel: () => void;
}

export const SolicitarForm = ({ onSolicitar, onCancel }: SolicitarFormProps) => {
  const [endereco, setEndereco] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!endereco.trim()) return;
    
    setLoading(true);
    
    const solicitacao: Omit<Solicitacao, 'id'> = {
      endereco: endereco.trim(),
      dataHora: new Date(),
      status: 'pendente'
    };
    
    onSolicitar(solicitacao);
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Solicitar Moto-Táxi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço de coleta</Label>
          <Input
            id="endereco"
            type="text"
            placeholder="Digite seu endereço completo..."
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!endereco.trim() || loading}
            className="flex-1"
          >
            <Send className="h-4 w-4 mr-2" />
            {loading ? "Enviando..." : "Confirmar Solicitação"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};