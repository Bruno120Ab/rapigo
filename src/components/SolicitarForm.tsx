// import { useEffect, useState } from "react";
// import { MapPin, Send, Navigation, Calendar, Clock } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Solicitacao, Mototaxista } from "@/types/mototaxi";
// import { EnderecoPadrao } from "@/hooks/useEnderecosPadrao";
// import { useConfiguracoes } from "@/hooks/useConfiguracoes";
// import { coordenadasParaEndereco, enderecoParaCoordenadas } from "@/utils/geocoding";
// import { MapComponent } from "./MapComponent";
// import { useToast } from "@/hooks/use-toast";

// interface SolicitarFormProps {
//   onSolicitar: (solicitacao: Omit<Solicitacao, 'id'>) => void;
//   onCancel: () => void;
//   mototaxistaSelecionado?: Mototaxista | null;
//   enderecosPadrao?: EnderecoPadrao[];
// }

// export const SolicitarForm = ({ 
//   onSolicitar, 
//   onCancel, 
//   mototaxistaSelecionado,
//   enderecosPadrao = []
// }: SolicitarFormProps) => {
//   const [nome, setNome] = useState("");
//   const [endereco, setEndereco] = useState("");
//   const [destino, setDestino] = useState("");
//   const [coordenadasOrigem, setCoordendasOrigem] = useState<{ lat: number; lng: number } | null>(null);
//   const [coordenadasDestino, setCoordendasDestino] = useState<{ lat: number; lng: number } | null>(null);
//   const [isAgendamento, setIsAgendamento] = useState(false);
//   const [dataAgendamento, setDataAgendamento] = useState("");
//   const [horaAgendamento, setHoraAgendamento] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { toast } = useToast();
//   const { configuracao } = useConfiguracoes();
//   const [serviceType, setServiceType] = useState<'corrida' | 'entrega' | 'coleta' | 'buscar_pessoa'>('corrida');

//   // Inicializar nome com configurações padrão
//   useEffect(() => {
//     if (configuracao.nomeClientePadrao && !nome) {
//       setNome(configuracao.nomeClientePadrao);
//     }
//   }, [configuracao.nomeClientePadrao]);

//   const obterLocalizacaoAtual = async () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
//           setCoordendasOrigem({ lat: latitude, lng: longitude });
          
//           // Converter coordenadas para endereço legível
//           const endereco = await coordenadasParaEndereco(latitude, longitude);
//           setEndereco(endereco);
          
//           toast({
//             title: "Localização obtida",
//             description: "Sua localização atual foi definida como origem",
//           });
//         },
//         (error) => {
//           console.error('Erro ao obter localização:', error);
//           toast({
//             title: "Erro de localização",
//             description: "Não foi possível obter sua localização atual",
//             variant: "destructive"
//           });
//         }
//       );
//     }
//   };
  

//   const handleSubmit = async () => {
//     if (!nome.trim() || !endereco.trim() ) return;
    
//     // Validar agendamento
//     if (isAgendamento && (!dataAgendamento || !horaAgendamento)) {
//       toast({
//         title: "Dados incompletos",
//         description: "Para agendamento, informe data e hora",
//         variant: "destructive"
//       });
//       return;
//     }
    
//     setLoading(true);

//     // Converter endereços para coordenadas se necessário
//     let coordsOrigem = coordenadasOrigem;
//     let coordsDestino = coordenadasDestino;
    
//     if (!coordsOrigem) {
//       coordsOrigem = await enderecoParaCoordenadas(endereco);
//     }
    
//     if (destino && !coordsDestino) {
//       coordsDestino = await enderecoParaCoordenadas(destino);
//     }

//     let dataHoraFinal = new Date();
//     let dataAgendamentoFinal: Date | undefined;
    
//     if (isAgendamento && dataAgendamento && horaAgendamento) {
//       dataAgendamentoFinal = new Date(`${dataAgendamento}T${horaAgendamento}`);
//       dataHoraFinal = dataAgendamentoFinal;
//     }

//     const solicitacao: Omit<Solicitacao, 'id'> = {
//       nome: nome.trim(),
//       endereco: endereco.trim(),
//       destino: destino.trim() || undefined,
//       coordenadasOrigem: coordsOrigem,
//       coordenadasDestino: coordsDestino,
//       dataHora: dataHoraFinal,
//       dataAgendamento: dataAgendamentoFinal,
//       isAgendamento,
//       idmotoBoy: mototaxistaSelecionado.id,
//       status: 'pendente',
//       motoBoy:  mototaxistaSelecionado?.nome.trim() ?? "Não informado",
//       serviceType
//     };
    
//     onSolicitar(solicitacao);
//     setLoading(false);
//   };
//   const [motoboy, setMotoboy] = useState<{ nome: string } | null>(null);

//   useEffect(() => {
//     const dados = localStorage.getItem("mototaxista");
//     if (dados) {
//       try {
//         const obj = JSON.parse(dados);
//         setMotoboy(obj);
//       } catch (e) {
//         console.error("Erro ao fazer parse do mototaxista:", e);
//       }
//     }
//   }, []);

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <MapPin className="h-5 w-5" />
//           Solicitar Moto-Táxi
//           {mototaxistaSelecionado && (
//             <span className="text-sm font-normal text-muted-foreground block">
//               Mototaxista: {mototaxistaSelecionado.nome}
//             </span>
//           )}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <Tabs defaultValue="endereco" className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="endereco">Endereços</TabsTrigger>
//             <TabsTrigger value="mapa">Mapa</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="endereco" className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="nome">Seu nome</Label>
//               <Input
//                 id="nome"
//                 type="text"
//                 placeholder="Digite seu nome completo..."
//                 value={nome}
//                 onChange={(e) => setNome(e.target.value)}
//                 className="w-full"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="endereco">Endereço de coleta</Label>
//               {enderecosPadrao.length > 0 && (
//                 <Select onValueChange={setEndereco}>
//                   <SelectTrigger className="mb-2">
//                     <SelectValue placeholder="Selecionar endereço salvo" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {enderecosPadrao.map((enderecoPadrao) => (
//                       <SelectItem key={enderecoPadrao.id} value={enderecoPadrao.endereco}>
//                         {enderecoPadrao.nome} - {enderecoPadrao.endereco}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}

//               {/* Tipo de serviço */}
//               <div className="space-y-2">
//                 <Label htmlFor="serviceType">Tipo de serviço</Label>
//                 <Select value={serviceType} onValueChange={(v) => setServiceType(v as any)}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Selecionar tipo" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="corrida">Corrida padrão</SelectItem>
//                     <SelectItem value="entrega">Entrega de objeto</SelectItem>
//                     <SelectItem value="coleta">Buscar objeto</SelectItem>
//                     <SelectItem value="buscar_pessoa">Buscar pessoa e trazer até mim</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex gap-2">
//                 <Input
//                   id="endereco"
//                   type="text"
//                   placeholder="Digite seu endereço de origem..."
//                   value={endereco}
//                   onChange={(e) => setEndereco(e.target.value)}
//                   className="flex-1"
//                 />
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={obterLocalizacaoAtual}
//                   disabled={loading}
//                 >
//                   <Navigation className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             {/* Seção de Agendamento */}
//             <div className="space-y-3 p-4 border rounded-lg">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4 text-primary" />
//                   <Label htmlFor="agendamento" className="text-sm font-medium">
//                     Agendar para depois
//                   </Label>
//                 </div>
//                 <Switch
//                   id="agendamento"
//                   checked={isAgendamento}
//                   onCheckedChange={setIsAgendamento}
//                 />
//               </div>
              
//               {isAgendamento && (
//                 <div className="grid grid-cols-2 gap-2">
//                   <div className="space-y-1">
//                     <Label htmlFor="data" className="text-xs">Data</Label>
//                     <Input
//                       id="data"
//                       type="date"
//                       value={dataAgendamento}
//                       onChange={(e) => setDataAgendamento(e.target.value)}
//                       min={new Date().toISOString().split('T')[0]}
//                       className="text-sm"
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <Label htmlFor="hora" className="text-xs">Hora</Label>
//                     <Input
//                       id="hora"
//                       type="time"
//                       value={horaAgendamento}
//                       onChange={(e) => setHoraAgendamento(e.target.value)}
//                       className="text-sm"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="destino">Destino (opcional)</Label>
//               {enderecosPadrao.length > 0 && (
//                 <Select onValueChange={setDestino}>
//                   <SelectTrigger className="mb-2">
//                     <SelectValue placeholder="Selecionar destino salvo" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {enderecosPadrao.map((enderecoPadrao) => (
//                       <SelectItem key={enderecoPadrao.id} value={enderecoPadrao.endereco}>
//                         {enderecoPadrao.nome} - {enderecoPadrao.endereco}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
//               <Input
//                 id="destino"
//                 type="text"
//                 placeholder="Para onde você quer ir..."
//                 value={destino}
//                 onChange={(e) => setDestino(e.target.value)}
//                 className="w-full"
//               />
//             </div>
//           </TabsContent>
          
//           <TabsContent value="mapa" className="space-y-4">
//             <MapComponent
//               onLocationSelect={(location) => {
//                 setCoordendasDestino({ lat: location.lat, lng: location.lng });
//                 setDestino(location.address);
//                 toast({
//                   title: "Destino definido",
//                   description: "Volte para a aba 'Endereços' para finalizar",
//                 });
//               }}
//             />
//           </TabsContent>
//         </Tabs>
        
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             onClick={onCancel}
//             className="flex-1"
//             disabled={loading}
//           >
//             Cancelar
//           </Button>
//           <Button
//             onClick={handleSubmit}
//             disabled={!nome.trim() || !endereco.trim() || loading || (isAgendamento && (!dataAgendamento || !horaAgendamento))}
//             className="flex-1 gap-0"
//           >
//             <Send className="h-1 w-1 mr-1" />
//             {loading ? "Enviando..." : isAgendamento ? "Agendar Corrida" : "Revisar Solicitação"}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };


import { useEffect, useState } from "react";
import { MapPin, Send, Navigation, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Solicitacao, Mototaxista } from "@/types/mototaxi";
import { EnderecoPadrao } from "@/hooks/useEnderecosPadrao";
import { useConfiguracoes } from "@/hooks/useConfiguracoes";
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
  const [sugestaoEndereco, setSugestaoEndereco] = useState<string | null>(null);
  const { toast } = useToast();
  const { configuracao } = useConfiguracoes();
  const [serviceType, setServiceType] = useState<'corrida' | 'entrega' | 'coleta' | 'buscar_pessoa'>('corrida');

  useEffect(() => {
    if (configuracao.nomeClientePadrao && !nome) {
      setNome(configuracao.nomeClientePadrao);
    }
  }, [configuracao.nomeClientePadrao]);

  const obterLocalizacaoAtual = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordendasOrigem({ lat: latitude, lng: longitude });
          const enderecoAtual = await coordenadasParaEndereco(latitude, longitude);
          setEndereco(enderecoAtual);
          setSugestaoEndereco(enderecoAtual);
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
    if (!nome.trim() || !endereco.trim()) return;

    if (isAgendamento && (!dataAgendamento || !horaAgendamento)) {
      toast({
        title: "Dados incompletos",
        description: "Para agendamento, informe data e hora",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    let coordsOrigem = coordenadasOrigem || await enderecoParaCoordenadas(endereco);
    let coordsDestino = coordenadasDestino || (destino ? await enderecoParaCoordenadas(destino) : null);

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
      idmotoBoy: mototaxistaSelecionado?.id || "",
      status: 'pendente',
      motoBoy: mototaxistaSelecionado?.nome.trim() ?? "Não informado",
      serviceType
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

            <div className="space-y-2 relative">
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

              {sugestaoEndereco && (
                <div
                  className="mt-1 p-2 border border-primary rounded-lg bg-white shadow-md cursor-pointer hover:bg-primary/10 transition absolute z-10 w-full"
                  onClick={() => {
                    setEndereco(sugestaoEndereco);
                    setSugestaoEndereco(null);
                  }}
                >
                  <Navigation className="inline h-4 w-4 text-primary mr-1" />
                  <span className="text-sm">{sugestaoEndereco}</span>
                </div>
              )}
            </div>

            {/* Tipo de serviço */}
            <div className="space-y-2">
              <Label htmlFor="serviceType">Tipo de serviço</Label>
              <Select value={serviceType} onValueChange={(v) => setServiceType(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrida">Corrida padrão</SelectItem>
                  <SelectItem value="entrega">Entrega de objeto</SelectItem>
                  <SelectItem value="coleta">Buscar objeto</SelectItem>
                  <SelectItem value="buscar_pessoa">Buscar pessoa e trazer até mim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Agendamento */}
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

            {/* Destino */}
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
            className="flex-1 gap-0"
          >
            <Send className="h-1 w-1 mr-1" />
            {loading ? "Enviando..." : isAgendamento ? "Agendar Corrida" : "Revisar Solicitação"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
