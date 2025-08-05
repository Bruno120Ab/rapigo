import { useEffect, useState } from "react";
import { MapPin, Send, Navigation, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Solicitacao, Mototaxista } from "@/types/mototaxi";
import { EnderecoPadrao } from "@/hooks/useEnderecosPadrao";
import { coordenadasParaEndereco, enderecoParaCoordenadas } from "@/utils/geocoding";
import { MapComponent } from "./MapComponent";
import { useToast } from "@/hooks/use-toast";

interface SolicitarFormProps {
  onSolicitar: (solicitacao: Omit<Solicitacao, 'id'>) => void;
  onCancel: () => void;
  mototaxistaSelecionado?: Mototaxista | null;
  enderecosPadrao?: EnderecoPadrao[];
}

export const SolicitarForm = ({ 
  onSolicitar, 
  onCancel, 
  mototaxistaSelecionado,
  enderecosPadrao = []
}: SolicitarFormProps) => {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [destino, setDestino] = useState("");
  const [coordenadasOrigem, setCoordendasOrigem] = useState<{ lat: number; lng: number } | null>(null);
  const [coordenadasDestino, setCoordendasDestino] = useState<{ lat: number; lng: number } | null>(null);
  const [isAgendamento, setIsAgendamento] = useState(false);
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [horaAgendamento, setHoraAgendamento] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const obterLocalizacaoAtual = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordendasOrigem({ lat: latitude, lng: longitude });
          
          // Converter coordenadas para endereço legível
          const endereco = await coordenadasParaEndereco(latitude, longitude);
          setEndereco(endereco);
          
          toast({
            title: "Localização obtida",
            description: "Sua localização atual foi definida como origem",
          });
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
    if (!nome.trim() || !endereco.trim() ) return;
    
    // Validar agendamento
    if (isAgendamento && (!dataAgendamento || !horaAgendamento)) {
      toast({
        title: "Dados incompletos",
        description: "Para agendamento, informe data e hora",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);

    // Converter endereços para coordenadas se necessário
    let coordsOrigem = coordenadasOrigem;
    let coordsDestino = coordenadasDestino;
    
    if (!coordsOrigem) {
      coordsOrigem = await enderecoParaCoordenadas(endereco);
    }
    
    if (destino && !coordsDestino) {
      coordsDestino = await enderecoParaCoordenadas(destino);
    }

    let dataHoraFinal = new Date();
    let dataAgendamentoFinal: Date | undefined;
    
    if (isAgendamento && dataAgendamento && horaAgendamento) {
      dataAgendamentoFinal = new Date(`${dataAgendamento}T${horaAgendamento}`);
      dataHoraFinal = dataAgendamentoFinal;
    }

    const solicitacao: Omit<Solicitacao, 'id'> = {
      nome: nome.trim(),
      endereco: endereco.trim(),
      destino: destino.trim() || undefined,
      coordenadasOrigem: coordsOrigem,
      coordenadasDestino: coordsDestino,
      dataHora: dataHoraFinal,
      dataAgendamento: dataAgendamentoFinal,
      isAgendamento,
      status: 'pendente',
      motoBoy:  mototaxistaSelecionado?.nome.trim() ?? "Não informado"
    };
    
    onSolicitar(solicitacao);
    setLoading(false);
  };
  const [motoboy, setMotoboy] = useState<{ nome: string } | null>(null);

  useEffect(() => {
    const dados = localStorage.getItem("mototaxista");
    if (dados) {
      try {
        const obj = JSON.parse(dados);
        setMotoboy(obj);
      } catch (e) {
        console.error("Erro ao fazer parse do mototaxista:", e);
      }
    }
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Solicitar Moto-Táxi
          {mototaxistaSelecionado && (
            <span className="text-sm font-normal text-muted-foreground block">
              Mototaxista: {mototaxistaSelecionado.nome}
            </span>
          )}
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
              <Label htmlFor="nome">Seu nome</Label>
              <Input
                id="nome"
                type="text"
                placeholder="Digite seu nome completo..."
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço de coleta</Label>
              {enderecosPadrao.length > 0 && (
                <Select onValueChange={setEndereco}>
                  <SelectTrigger className="mb-2">
                    <SelectValue placeholder="Selecionar endereço salvo" />
                  </SelectTrigger>
                  <SelectContent>
                    {enderecosPadrao.map((enderecoPadrao) => (
                      <SelectItem key={enderecoPadrao.id} value={enderecoPadrao.endereco}>
                        {enderecoPadrao.nome} - {enderecoPadrao.endereco}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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

            {/* Seção de Agendamento */}
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <Label htmlFor="agendamento" className="text-sm font-medium">
                    Agendar para depois
                  </Label>
                </div>
                <Switch
                  id="agendamento"
                  checked={isAgendamento}
                  onCheckedChange={setIsAgendamento}
                />
              </div>
              
              {isAgendamento && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="data" className="text-xs">Data</Label>
                    <Input
                      id="data"
                      type="date"
                      value={dataAgendamento}
                      onChange={(e) => setDataAgendamento(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="hora" className="text-xs">Hora</Label>
                    <Input
                      id="hora"
                      type="time"
                      value={horaAgendamento}
                      onChange={(e) => setHoraAgendamento(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino">Destino (opcional)</Label>
              {enderecosPadrao.length > 0 && (
                <Select onValueChange={setDestino}>
                  <SelectTrigger className="mb-2">
                    <SelectValue placeholder="Selecionar destino salvo" />
                  </SelectTrigger>
                  <SelectContent>
                    {enderecosPadrao.map((enderecoPadrao) => (
                      <SelectItem key={enderecoPadrao.id} value={enderecoPadrao.endereco}>
                        {enderecoPadrao.nome} - {enderecoPadrao.endereco}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
            disabled={!nome.trim() || !endereco.trim() || loading || (isAgendamento && (!dataAgendamento || !horaAgendamento))}
            className="flex-1"
          >
            <Send className="h-4 w-4 mr-2" />
            {loading ? "Enviando..." : isAgendamento ? "Agendar Corrida" : "Confirmar Solicitação"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};