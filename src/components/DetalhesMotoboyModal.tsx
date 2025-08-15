// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { User, Car, Bike, Star, Shield, Phone, ShieldCheck } from "lucide-react";
// import { Mototaxista } from "@/types/mototaxi";
// import { useAvaCorridas,  } from "@/hooks/use-historicoCorrida";

// interface DetalhesMotoboyModalProps {
//   mototaxista: Mototaxista | null;
//   isOpen: boolean;
//   loading: boolean;
//   premium: boolean;
//   onClose: () => void;
//   idUser: string;
//   onSelecionar: (mototaxista: Mototaxista) => void;
//   metricas?: { mediaEstrelas: number; taxaAceite: number; totalViagens: number; viagensAvaliadas: number };
// }

// export const DetalhesMotoboyModal = ({ 
//   mototaxista, 
//   loading,
//   premium,
//   isOpen, 
//   onClose, 
//   onSelecionar,
//   idUser,
//   metricas 
// }: DetalhesMotoboyModalProps) => {
  
//   if (!mototaxista) return null;
//   const { resumo, loadingHistorico, error } = useAvaCorridas(mototaxista.id);

//   const handleSelecionar = () => {
//     onSelecionar(mototaxista);
//     onClose();
//   };

//   console.log(resumo)
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Detalhes do Motorista</DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-6">
//           {/* Avatar e info básica */}
//           <div className="flex items-center gap-4">
//             <Avatar className="h-16 w-16">
//               <AvatarImage src={mototaxista.foto} alt={mototaxista.nome} />
//               <AvatarFallback>
//                 <User className="h-8 w-8" />
//               </AvatarFallback>
//             </Avatar>
            
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-1">
//                 <h3 className="text-xl font-semibold">{mototaxista.nome}</h3>
//                 <Badge 
//                   variant={mototaxista.ativo ? "default" : "secondary"}
//                   className={mototaxista.ativo ? "bg-success text-success-foreground" : ""}
//                 >
//                   {metricas.mediaEstrelas > 4 ? "Bem avaliado" : "Pontual"}
//                 </Badge>
//               </div>
              
//               <div className="flex items-center gap-2 text-muted-foreground">
//                 <Phone className="h-4 w-4" />
//                 <span>{mototaxista.telefone}</span>
//               </div>
//             </div>
//           </div>

//           {/* Tipo de veículo */}
//           <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
//             {mototaxista.tipoVeiculo === 'carro' ? (
//               <>
//                 <Car className="h-6 w-6 text-primary" />
//                 <div>
//                   <p className="font-medium">MOdelo do carro: {mototaxista.detalhes}</p>
//                   <p className="text-sm text-muted-foreground">Mais conforto e proteção</p>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <img   className="w-16 h-16 rounded-md object-cover" src={mototaxista.detalhes_foto} alt="" />
//                 <div>
//                   <p className="font-medium">Modelo da moto: {mototaxista.detalhes}</p>
//                   <p className="text-sm text-muted-foreground">SOS mototaxi</p>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* <p className="font-medium mx-auto" >Historico de viagens com você :</p> */}

//          {/* <div className="grid grid-cols-2 gap-1">
//               <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
//                 <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
//                 <div>
//                   <p className="font-medium">
//                     {metricas.mediaEstrelas > 0 ? metricas.mediaEstrelas.toFixed(1) : "N/A"}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Avaliação ({metricas.viagensAvaliadas} avaliações)
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
//                 <Shield className="h-5 w-5 text-green-600" />
//                 <div>
//                   <p className="font-medium">{Math.round(metricas.taxaAceite)}%</p>
//                   <p className="text-xs text-muted-foreground">
//                     Taxa de aceite ({metricas.totalViagens} viagens)
//                   </p>
//                 </div>
//               </div>
//             </div>
//          */}

      
//           <span className="flex items-center mr-0">
//             <ShieldCheck className="h-4 w-4 text-green-500" />
//             <h3 className="font-medium ml-1" > Quer mais confiança ?</h3> 
//           </span>
//             <h5 className="text-sm text-muted-foreground">Veja o desempenho do motoboy com base nas avaliações feitas por outros usuários.</h5>
//           {loadingHistorico ? (
//   <div className="flex items-center justify-center p-8">
//     <p>Carregando avaliações dos usuarios do app..</p>
//   </div>
// ) : error ? (
//   <div className="flex items-center justify-center p-8 text-red-600">
//     <p>Erro ao carregar dados: {error.message}</p>
//   </div>
// ) : (
//   <>
//     <div
//       className={`
//         transition-all duration-300
//         ${!premium ? "blur-sm pointer-events-none" : ""}
//       `}
//     >
//       {resumo && (
//         <div className="grid grid-cols-2 gap-4">
//           <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
//             <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
//             <div>
//               <p className="font-medium">
//                 {resumo.avaliacaoMedia}
//               </p>
//               <p className="text-xs text-muted-foreground">
//                 Avaliação
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
//             <Shield className="h-5 w-5 text-green-600" />
//             <div>
//              <p className="font-medium">
//                 {resumo.corridas.length}
//               </p>
//               <p className="text-xs text-muted-foreground">
//                 Corridas & Viagens
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   </>
// )}
//     {resumo && resumo.corridas && resumo.corridas.length === 0 ? (
//   <p className="text-center text-gray-500 italic">Nenhuma corrida registrada</p>
// ) : (
//   resumo && resumo.corridas && (
//     <ul className="space-y-4 h-44 overflow-y-auto pr-2">
//       {resumo.corridas.map(({ dataHora, comentario, idMotoboy, nomeMotoboy, avaliacao, tipo }, index) => {
//         return (
//           <li
//             key={`${idMotoboy}-${dataHora}-${index}`}
//             className="cursor-pointer p-4 rounded-lg shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow"
//           >
//             <div className="flex justify-between items-center mb-1">
//               <h4 className="font-semibold text-lg text-gray-900">{nomeMotoboy}</h4>
//               <span className="text-sm text-gray-500">{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span>
//             </div>

//             <p className="text-gray-700 mb-2">{comentario || <i>Sem comentário</i>}</p>

//             <div className="flex items-center justify-between text-sm text-gray-500">
//               <span>{dataHora}</span>

//               <div className="flex items-center gap-1">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`h-4 w-4 ${
//                       i < avaliacao ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
//                     }`}
//                   />
//                 ))}
//                 <span className="ml-1 font-medium text-gray-700">{avaliacao.toFixed(1)}</span>
//               </div>
//             </div>
//           </li>
//         );
//       })}
//     </ul>
//   )
// )}
//           {/* Botão de seleção */}
//           {mototaxista.ativo && (
//             <Button onClick={handleSelecionar} className="w-full">
//               Selecionar este motorista
//             </Button>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };



import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Car, Bike, Star, Shield, Phone, ShieldCheck, Clock, Info } from "lucide-react";
import { Mototaxista } from "@/types/mototaxi";
import { useAvaCorridas } from "@/hooks/use-historicoCorrida";
 import _ from "lodash";

interface DetalhesMotoboyModalProps {
  mototaxista: Mototaxista | null;
  isOpen: boolean;
  loading: boolean;
  premium: boolean;
  onClose: () => void;
  idUser: string;
  onSelecionar: (mototaxista: Mototaxista) => void;
  metricas?: { mediaEstrelas: number; taxaAceite: number; totalViagens: number; viagensAvaliadas: number };
}

export const DetalhesMotoboyModal = ({
  mototaxista,
  loading,
  premium,
  isOpen,
  onClose,
  onSelecionar,
  idUser,
  metricas
}: DetalhesMotoboyModalProps) => {

  if (!mototaxista) return null;
  const { resumo, loadingHistorico, error } = useAvaCorridas(mototaxista.id);
  const handleSelecionar = () => {
    onSelecionar(mototaxista);
    onClose();
  };

const corridas = resumo?.corridas || [];

// Horário com mais corridas
const horarioMaisCorridas = (() => {
  if (!corridas.length) return null;
  const frequenciaHoras: Record<string, number> = {};
  corridas.forEach(c => {
    if (!c.tempoCorrida) return;
    const hora = c.tempoCorrida.split(" ")[1]?.split(":")[0]; // "16" ou "19"
    if (!hora) return;
    frequenciaHoras[hora] = (frequenciaHoras[hora] || 0) + 1;
  });
  const sorted = Object.entries(frequenciaHoras).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || null;
})();

// Tipo mais frequente
const tipoMaisFrequente = (() => {
  if (!corridas.length) return null;
  const frequenciaTipos: Record<string, number> = {};
  corridas.forEach(c => {
    if (!c.tipo) return;
    frequenciaTipos[c.tipo] = (frequenciaTipos[c.tipo] || 0) + 1;
  });
  const sorted = Object.entries(frequenciaTipos).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || null;
})();

  // Texto resumido para veículo
  const infoVeiculo = resumo?.corridas?.length
    ? `Trabalha mais com ${tipoMaisFrequente || "corridas"} e horário de pico às ${horarioMaisCorridas}h`
    : "Sem histórico de corridas";

 const configString = localStorage.getItem('configuracoes-usuario');
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Motorista</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avatar e info básica */}
          <div className="flex items-center gap-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src={mototaxista.foto} alt={mototaxista.nome} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                <h3 className="text-xl font-semibold">{mototaxista.nome}</h3>
                <Badge
                  variant={mototaxista.ativo ? "default" : "secondary"}
                  className={mototaxista.ativo ? "bg-success text-success-foreground" : ""}
                >
                  {/* {metricas?.mediaEstrelas && metricas.mediaEstrelas > 4 ? "Bem avaliado" : "Pontual"} */}
                  {mototaxista.Grupo}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{mototaxista.telefone}</span>
              </div>
            </div>
          </div>

          {/* Tipo de veículo */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            {mototaxista.tipoVeiculo === 'carro' ? (
              <>
                <Car className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">Modelo do carro: {mototaxista.detalhes}</p>
                  <p className="text-sm text-muted-foreground">{infoVeiculo}</p>
                </div>
              </>
            ) : (
              <>
                <img className="w-16 h-16 rounded-md object-cover" src={mototaxista.detalhes_foto} alt="" />
                <div>
                  <p className="font-medium">Modelo da moto: {mototaxista.detalhes}</p>
                  <p className="text-sm text-muted-foreground">{infoVeiculo}</p>
                </div>
              </>
            )}
          </div>
          
         
        <p className="mt-1 flex items-center text-sm text-gray-500 italic">
          <Info className="w-4 h-4 mr-1 text-gray-400" />
          { configString ? "Baseado no feedback de usuários" : "Informe seu nome e numero para desbloquear as informações dos usuários."}
       
        </p>

          {/* Métricas */}
          {loadingHistorico ? (
            <div className="flex items-center justify-center p-8">
              <p>Carregando avaliações dos usuários do app...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8 text-red-600">
              <p>Erro ao carregar dados: {error.message}</p>
            </div>
          ) : (
            <div
              className={`transition-all duration-300 ${!premium ? "blur-sm pointer-events-none" : ""}`}
            >
              {resumo && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Avaliação */}
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <div>
                      <p className="font-medium">{resumo.avaliacaoMedia.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">Avaliação</p>
                    </div>
                  </div>

                  {/* Total de corridas */}
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">{resumo.corridas.length}</p>
                      <p className="text-xs text-muted-foreground">Corridas & Viagens</p>
                    </div>
                  </div>

                  

                  {/* Horário mais ativo */}
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{horarioMaisCorridas ? `${horarioMaisCorridas}h` : "N/A"}</p>
                      <p className="text-xs text-muted-foreground">Horário de pico</p>
                    </div>
                  </div>

                  {/* Tipo mais frequente */}
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Car className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">{tipoMaisFrequente || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">Tipo mais frequente</p>
                    </div>
                  </div>
                </div>
              )}
           

          {/* Histórico de corridas detalhado */}
          {resumo && resumo.corridas && resumo.corridas.length === 0 ? (
            <p className="text-center text-gray-500 italic">Nenhuma corrida registrada</p>
          ) : (
            resumo?.corridas && (
              <ul className="space-y-4 h-44 overflow-y-auto pr-2">
                {resumo.corridas.map(({ dataHora, comentario, idMotoboy, nomeMotoboy, avaliacao, tipo }, index) => (
                  <li
                    key={`${idMotoboy}-${dataHora}-${index}`}
                    className="cursor-pointer p-4 rounded-lg shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-lg text-gray-900">{nomeMotoboy}</h4>
                      <span className="text-sm text-gray-500">{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span>
                    </div>

                    <p className="text-gray-700 mb-2">{comentario || <i>Sem comentário</i>}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{dataHora}</span>

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < avaliacao ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="ml-1 font-medium text-gray-700">{avaliacao.toFixed(1)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
          </div>
        )}
          {/* Botão de seleção */}
          {mototaxista.ativo && (
            <Button onClick={handleSelecionar} className="w-full">
              Selecionar este motorista
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
