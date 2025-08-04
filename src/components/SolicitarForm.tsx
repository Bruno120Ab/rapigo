import { useState } from "react";
import { MapPin, Send, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Solicitacao } from "@/types/mototaxi";
import { MapComponent } from "./MapComponent";
import { useToast } from "@/hooks/use-toast";

interface SolicitarFormProps {
  onSolicitar: (solicitacao: Omit<Solicitacao, 'id'>) => void;
  onCancel: () => void;
}

export const SolicitarForm = ({ onSolicitar, onCancel }: SolicitarFormProps) => {
  const [endereco, setEndereco] = useState("");
  const [destino, setDestino] = useState("");
  const [coordenadasOrigem, setCoordendasOrigem] = useState<{ lat: number; lng: number } | null>(null);
  const [coordenadasDestino, setCoordendasDestino] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const obterLocalizacaoAtual = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordendasOrigem({ lat: latitude, lng: longitude });
          
          // Reverse geocoding para obter endereço
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=YOUR_MAPBOX_TOKEN`
            );
            const data = await response.json();
            const address = data.features[0]?.place_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            setEndereco(address);
            
            toast({
              title: "Localização obtida",
              description: "Sua localização atual foi definida como origem",
            });
          } catch (error) {
            setEndereco(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          }
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          toast({
            title: "Erro de localização",
            description: "Não foi possível obter sua localização atual",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (!endereco.trim()) return;
    
    setLoading(true);
    
    const solicitacao: Omit<Solicitacao, 'id'> = {
      endereco: endereco.trim(),
      destino: destino.trim() || undefined,
      coordenadasOrigem,
      coordenadasDestino,
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
        <Tabs defaultValue="endereco" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="endereco">Endereços</TabsTrigger>
            <TabsTrigger value="mapa">Mapa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="endereco" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço de coleta</Label>
              <div className="flex gap-2">
                <Input
                  id="endereco"
                  type="text"
                  placeholder="Digite seu endereço de origem..."
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={obterLocalizacaoAtual}
                  disabled={loading}
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino">Destino (opcional)</Label>
              <Input
                id="destino"
                type="text"
                placeholder="Para onde você quer ir..."
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="w-full"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="mapa" className="space-y-4">
            <MapComponent
              onLocationSelect={(location) => {
                setCoordendasDestino({ lat: location.lat, lng: location.lng });
                setDestino(location.address);
                toast({
                  title: "Destino definido",
                  description: "Volte para a aba 'Endereços' para finalizar",
                });
              }}
            />
          </TabsContent>
        </Tabs>
        
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