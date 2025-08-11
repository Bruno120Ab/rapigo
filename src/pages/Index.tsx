// import { useEffect, useState } from "react";
// import { Bike, Car, Settings, User, Users } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { MototaxistaCard } from "@/components/MototaxistaCard";
// import { SolicitarForm } from "@/components/SolicitarForm";
// import { ConfirmacaoSolicitacao } from "@/components/ConfirmacaoSolicitacao";
// import { ConfirmarRepetirViagem } from "@/components/ConfirmarRepetirViagem";
// import { FavoritosSection } from "@/components/FavoritosSection";
// import { HistoricoSection } from "@/components/HistoricoSection";
// import { DetalhesMotoboyModal } from "@/components/DetalhesMotoboyModal";
// import { ConfiguracoesModal } from "@/components/ConfiguracoesModal";
// import { useMototaxistas } from "@/hooks/useMototaxistas";
// import { useConfiguracoes } from "@/hooks/useConfiguracoes";
// import { useSolicitacoes } from "@/hooks/useSolicitacoes";
// import { useFavoritos } from "@/hooks/useFavoritos";
// import { useHistorico } from "@/hooks/useHistorico";
// import { useEnderecosPadrao } from "@/hooks/useEnderecosPadrao";
// import { useAvaliacoes } from "@/hooks/useAvaliacoes";
// import { Mototaxista, Solicitacao } from "@/types/mototaxi";
// import { useToast } from "@/hooks/use-toast";
// import { AddToHomeScreenCarousel } from "@/components/AddToWarn";
// import usePWAInstall from "@/hooks/usePWAInstall";
// import InstallPWAButton from "@/components/InstallPWAButton";
// import { BannerSection } from "@/components/Banners";
// import EnviarEmail from "@/components/EnviarEmail";
// // import { PoliticaSeguranca } from "@/components/PoliticaSeguranca";

// type TelaTipo = 'inicial' | 'solicitar' | 'confirmacao' | 'gerenciar' | 'selecionar-mototaxista';

// const Index = () => {
//     // Novos estados para o controle premium
//     const [userId, setUserId] = useState(null);
//     const [isPremium, setIsPremium] = useState(false);
//     const [ dateExpiration, setDateExpiration ] = useState();
//     const [premiumLoading, setPremiumLoading] = useState(true);

//     // useEffect 1: Geração e recuperação do ID do usuário, agora dentro de 'configuracoes-usuario'
//     useEffect(() => {
//         let storedConfig;
//         const configString = localStorage.getItem('configuracoes-usuario');

//         try {
//             storedConfig = configString ? JSON.parse(configString) : {};
//         } catch (error) {
//             console.error('Erro ao ler configurações do usuário no localStorage:', error);
//             storedConfig = {};
//         }

//         let storedId = storedConfig.userId;
//         if (!storedId) {
//             const newId = `user-${Math.random().toString(36).substring(2, 15)}`;
//             storedConfig.userId = newId;
//             localStorage.setItem('configuracoes-usuario', JSON.stringify(storedConfig));
//             storedId = newId;
//         }
        
//         setUserId(storedId);
//     }, []);

//     // useEffect 2: Verificação do status premium usando o proxy
//     useEffect(() => {
//         if (userId) {
//             const proxyUrl = 'https://script.google.com/macros/s/AKfycbwLwHbG41s1g6u35tlHOzaEmuGwD0nuJskkV_ypJDdrwy1CXd_f9YHlw63EbmUwKj7e/exec';
            
//             fetch(`${proxyUrl}?id=${userId}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     setIsPremium(data.is_premium);
//                     setDateExpiration(data.expiration_date)
//                     setPremiumLoading(false);
//                     console.log(data)
//                 })
//                 .catch(error => {
//                     console.error('Erro ao verificar status premium:', error);
//                     setIsPremium(false);
//                     setPremiumLoading(false);
//                 });
//         } else {
//             // Se o userId ainda não foi gerado, consideramos em loading
//             setPremiumLoading(true);
//         }
//     }, [userId]);

//     // Seus estados e hooks existentes
//     const [telaAtual, setTelaAtual] = useState<TelaTipo>('inicial');
//     const [ultimaSolicitacao, setUltimaSolicitacao] = useState<Solicitacao | null>(null);
//     const [mototaxistaSelecionado, setMototaxistaSelecionado] = useState<Mototaxista | null>(null);
//     const [viagemParaRepetir, setViagemParaRepetir] = useState<Solicitacao | null>(null);
//     const [mostrarConfirmacaoRepeticao, setMostrarConfirmacaoRepeticao] = useState(false);
//     const [motoboyDetalhes, setMotoboyDetalhes] = useState<Mototaxista | null>(null);
//     const [mostrarDetalhesModal, setMostrarDetalhesModal] = useState(false);
//     const [mostrarConfiguracoesModal, setMostrarConfiguracoesModal] = useState(false);
//     const { mototaxistasAtivos, quantidadeAtivos, mototaxistas, toggleStatus } = useMototaxistas();
//     const { adicionarSolicitacao } = useSolicitacoes();
//     const { favoritos, adicionarFavorito, removerFavorito, isFavorito } = useFavoritos();
//     const { historico, adicionarViagem, adicionarAvaliacao, obterAvaliacao } = useHistorico();
//     const { enderecos } = useEnderecosPadrao();
//     const { toast } = useToast();
//     const { calcularMetricasMotorista, adicionarAvaliacao: adicionarAvaliacaoReativa } = useAvaliacoes();
//     const { configuracao } = useConfiguracoes();

//     const handleSolicitar = (dadosSolicitacao: Omit<Solicitacao, 'id'>) => {
//         const solicitacao = adicionarSolicitacao(dadosSolicitacao);
//         setUltimaSolicitacao(solicitacao);
//         adicionarViagem(solicitacao);
//         setTelaAtual('confirmacao');
        
//         toast({
//             title: "Solicitação Completa!",
//             description: "Agora envie seu pedido.",
//         });
//     };

//     const handleSelecionarMototaxista = (mototaxista: Mototaxista) => {
//         setMototaxistaSelecionado(mototaxista);
//         localStorage.setItem("mototaxista", JSON.stringify(mototaxista));
//         setTelaAtual('solicitar');
//     };

//     const handleSelecionarFavorito = (mototaxista: Mototaxista) => {
//         handleSelecionarMototaxista(mototaxista);
//     };

//     const handleMostrarDetalhes = (mototaxista: Mototaxista) => {
//         setMotoboyDetalhes(mototaxista);
//         setMostrarDetalhesModal(true);
//     };

//     const handleReutilizarViagem = (viagem: Solicitacao) => {
//         setViagemParaRepetir(viagem);
//         setMostrarConfirmacaoRepeticao(true);
//     };

//     const handleConfirmarRepeticaoViagem = (novaViagem: Solicitacao) => {
//         const solicitacao = adicionarSolicitacao(novaViagem);
//         setUltimaSolicitacao(solicitacao);
//         adicionarViagem(solicitacao);
//         setTelaAtual('confirmacao');
        
//         toast({
//             title: "Viagem repetida!",
//             description: "Agora envie seu pedido.",
//         });
//     };

//     const handleToggleFavorito = (mototaxista: Mototaxista) => {
//         if (isFavorito(mototaxista.id)) {
//             removerFavorito(mototaxista.id);
//             toast({
//                 title: "Removido dos favoritos",
//                 description: `${mototaxista.nome} foi removido dos seus favoritos.`,
//             });
//         } else {
//             const sucesso = adicionarFavorito(mototaxista);
//             if (sucesso) {
//                 toast({
//                     title: "Adicionado aos favoritos",
//                     description: `${mototaxista.nome} foi adicionado aos seus favoritos.`,
//                 });
//             } else {
//                 toast({
//                     title: "Limite atingido",
//                     description: "Você pode ter no máximo 3 motoboys favoritos.",
//                     variant: "destructive"
//                 });
//             }
//         }
//     };

//     const enviarWhatsApp = () => {
//     if (!ultimaSolicitacao) return;
  
//     const dadosMototaxista = localStorage.getItem("mototaxista");
//     let telefone = "71999099688";
  
//     if (dadosMototaxista) {
//       try {
//         const mototaxista = JSON.parse(dadosMototaxista);
//         if (mototaxista.telefone) {
//           telefone = mototaxista.telefone.replace(/\D/g, "");
//           if (!telefone.startsWith("55")) {
//             telefone = "55" + telefone;
//           }
//         }
//       } catch (error) {
//         console.error("Erro ao ler telefone do mototaxista no localStorage", error);
//       }
//     }
  
//     let mensagem = `🚕 *NOVA SOLICITAÇÃO DE MOTO-TÁXI*\n\n`;
//     mensagem += `👤 *Cliente:* ${ultimaSolicitacao.nome}\n`;
//     mensagem += `🧭 *Serviço:* ${ultimaSolicitacao.serviceType ?? 'corrida'}\n`;
//     mensagem += `📍 *Origem:* ${ultimaSolicitacao.endereco}\n`;
  
//     if (ultimaSolicitacao.destino) {
//       mensagem += `🎯 *Destino:* ${ultimaSolicitacao.destino}\n`;
//     }
  
//     if (ultimaSolicitacao.coordenadasOrigem) {
//       const { lat, lng } = ultimaSolicitacao.coordenadasOrigem;
//       mensagem += `📱 *Link Origem:* https://maps.google.com/?q=${lat},${lng}\n`;
//     }
  
//     if (ultimaSolicitacao.isAgendamento) {
//       mensagem += `*Tipo de viagem: Agendadada*`;
//     }
  
//     mensagem += `\n⏰ *Horário:* ${ultimaSolicitacao.dataHora.toLocaleString('pt-BR')}\n`;
//     mensagem += `\n*Favor confirmar se pode atender! 🙏*`;
  
//     const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
//     window.open(url, "_blank");
//   };
  
//     const renderTela = () => {
//         switch (telaAtual) {
//             case 'solicitar':
//                 return (
//                     <SolicitarForm
//                         onSolicitar={handleSolicitar}
//                         onCancel={() => setTelaAtual('inicial')}
//                         mototaxistaSelecionado={mototaxistaSelecionado}
//                         enderecosPadrao={enderecos}
//                     />
//                 );
//             case 'selecionar-mototaxista':
//                 return (
//                     <div className="space-y-4">
//                         <div className="flex items-center justify-between">
//                             <h2 className="text-2xl font-bold">Selecionar Mototaxista</h2>
//                             <Button 
//                                 variant="outline" 
//                                 onClick={() => setTelaAtual('inicial')}
//                             >
//                                 Voltar
//                             </Button>
//                         </div>
                        
//                         <div className="space-y-3">
//                             {mototaxistasAtivos.map((mototaxista) => {
//                                 const metricas = calcularMetricasMotorista(mototaxista.nome, historico);
//                                 return (
//                                     <MototaxistaCard
//                                         key={mototaxista.id}
//                                         mototaxista={mototaxista}
//                                         onToggleStatus={toggleStatus}
//                                         onSelecionar={handleMostrarDetalhes}
//                                         isFavorito={isFavorito(mototaxista.id)}
//                                         onToggleFavorito={handleToggleFavorito}
//                                         showFavoriteButton={true}
//                                         metricas={metricas}
//                                     />
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 );
//             case 'confirmacao':
//                 return ultimaSolicitacao ? (
//                     <ConfirmacaoSolicitacao
//                         solicitacao={ultimaSolicitacao}
//                         onVoltarInicio={() => setTelaAtual('inicial')}
//                         onEnviarWhatsApp={enviarWhatsApp}
//                     />
//                 ) : null;
//             case 'gerenciar':
//                 return (
//                     <div className="space-y-4">
//                         <div className="flex items-center justify-between">
//                             <h2 className="text-2xl font-bold">Gerenciar Mototaxistas</h2>
//                             <Button 
//                                 variant="outline" 
//                                 onClick={() => setTelaAtual('inicial')}
//                             >
//                                 Voltar
//                             </Button>
//                         </div>
                        
//                         <div className="space-y-3">
//                             {mototaxistas.map((mototaxista) => (
//                                 <MototaxistaCard
//                                     key={mototaxista.id}
//                                     mototaxista={mototaxista}
//                                     onToggleStatus={toggleStatus}
//                                     showToggle={true}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 );
//             default:
//                 return (
//                     <div className="space-y-6">
//                         {/* Header */}
//                         <div className="text-center space-y-2">
//                             <div className="flex items-center justify-between">
//                                 <div></div>
//                                 <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
//                                     <Bike className="h-8 w-8 text-primary" />
//                                     Moto-Táxi de Itambé
//                                 </h1>
//                                 <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     onClick={() => setMostrarConfiguracoesModal(true)}
//                                     className="text-muted-foreground hover:text-foreground"
//                                 >
//                                 <User className="h-15 w-15" />
//                                 </Button>
//                             </div>
//                             <p className="text-muted-foreground">
//                                 Seu táxi na palma da mão, Você no controle da corrida.             
//                             </p>
//                             <InstallPWAButton />
//                         </div>
//                          <FavoritosSection 
//                               favoritos={favoritos} 
//                               onSelecionarFavorito={handleSelecionarFavorito}
//                               onRemoverFavorito={removerFavorito}
//                         />
//                         <HistoricoSection 
//                             historico={historico}
//                             onReutilizarViagem={handleReutilizarViagem}
//                             onSalvarAvaliacao={adicionarAvaliacaoReativa}
//                             obterAvaliacao={obterAvaliacao}
//                         />

//                         {/* <div className="relative">
//                             {premiumLoading ? (
//                                 <div className="flex items-center justify-center p-8">
//                                     <p>Verificando status premium...</p>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className={`
//                                         transition-all duration-300
//                                         ${!isPremium ? 'blur-sm pointer-events-none' : ''}
//                                     `}>
//                                         <FavoritosSection 
//                                             favoritos={favoritos} 
//                                             onSelecionarFavorito={handleSelecionarFavorito}
//                                             onRemoverFavorito={removerFavorito}
//                                         />
//                                         <HistoricoSection 
//                                             historico={historico}
//                                             onReutilizarViagem={handleReutilizarViagem}
//                                             onSalvarAvaliacao={adicionarAvaliacaoReativa}
//                                             obterAvaliacao={obterAvaliacao}
//                                         />
//                                     </div>
                                    
//                                     {!isPremium && (
//                                         <div className="absolute inset-0 flex items-center justify-center z-10">
//                                             <div className="text-center">
//                                                 <Button size="lg" className="h-12 text-lg">
//                                                     Torne-se Membro
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </>
//                             )}
//                         </div>  */}

//                         <Card>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2">
//                                     <Users className="h-5 w-5" />
//                                     Mototaxistas Disponíveis 
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="space-y-2">
//                                     {mototaxistasAtivos.slice(0, 3).map((mototaxista) => {
//                                         const metricas = calcularMetricasMotorista(mototaxista.nome, historico);
//                                         return (
//                                             <MototaxistaCard
//                                                 key={mototaxista.id}
//                                                 mototaxista={mototaxista}
//                                                 onToggleStatus={toggleStatus}
//                                                 onSelecionar={handleMostrarDetalhes}
//                                                 isFavorito={isFavorito(mototaxista.id)}
//                                                 onToggleFavorito={handleToggleFavorito}
//                                                 showFavoriteButton={true}
//                                                 metricas={metricas}
//                                             />
//                                         );
//                                     })}
//                                     {quantidadeAtivos  > 2 && (
//                                         <Button
//                                             variant="outline"
//                                             className="w-full"
//                                             onClick={() => setTelaAtual('selecionar-mototaxista')}
//                                         >
//                                             Ver todos motoboys do app ({quantidadeAtivos} disponíveis)
//                                         </Button>
//                                     )}
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         <div className="space-y-3">
//                             <Button
//                                 onClick={() => setTelaAtual('selecionar-mototaxista')}
//                                 disabled={quantidadeAtivos === 0}
//                                 className="w-full h-14 text-lg"
//                                 size="lg"
//                             >
//                             <Car className="h-5 w-5 mr-2" />
//                                 Solicitar Moto-Táxi
//                             </Button>
//                         </div>
//                         <PoliticaSeguranca />
//                         <BannerSection/>
//                          <div className="flex flex-col items-center mr-top-10 justify-center space-y-3 mx-auto">
//                             {/* <img src="/caminho/para/logo.png" alt="Logo" className="w-10 h-10 object-contain" /> */}
//                             <h1 className="text-sm text-center">
//                             Desenvolvedor: Bruno Abreu                                 
//                             </h1>
//                             <h1 className="text-sm text-center">
//                             Contato: brunoabreudevs@gmail.com
//                             </h1>
//                             <EnviarEmail />
//                         </div>
//                     </div>
//                 );
//         }
//     };
    
//     // Retorno principal do componente Index
//     return (
//      <div className="min-h-screen bg-background p-4">
//       <div className="max-w-md mx-auto">
//         {renderTela()}
//       </div>
      
//       <ConfirmarRepetirViagem
//         viagem={viagemParaRepetir}
//         isOpen={mostrarConfirmacaoRepeticao}
//         onClose={() => {
//           setMostrarConfirmacaoRepeticao(false);
//           setViagemParaRepetir(null);
//         }}
//         onConfirmar={handleConfirmarRepeticaoViagem}
//       />
  
//       <DetalhesMotoboyModal
//         loading={premiumLoading}
//         premium={isPremium}
//         mototaxista={motoboyDetalhes}
//         isOpen={mostrarDetalhesModal}
//         onClose={() => {
//           setMostrarDetalhesModal(false);
//           setMotoboyDetalhes(null);
//         }}
//         onSelecionar={handleSelecionarMototaxista}
//         metricas={motoboyDetalhes ? calcularMetricasMotorista(motoboyDetalhes.nome, historico) : undefined}
//       />
  
//       <ConfiguracoesModal
//         Premium={isPremium}
//         dateExpira={dateExpiration}
//         isOpen={mostrarConfiguracoesModal}
//         onClose={() => setMostrarConfiguracoesModal(false)}
//       />
//     </div>
//     );
// };

// export default Index;




import { useEffect, useState } from "react";
import { Bike, Car, Settings, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MototaxistaCard } from "@/components/MototaxistaCard";
import { SolicitarForm } from "@/components/SolicitarForm";
import { ConfirmacaoSolicitacao } from "@/components/ConfirmacaoSolicitacao";
import { ConfirmarRepetirViagem } from "@/components/ConfirmarRepetirViagem";
import { FavoritosSection } from "@/components/FavoritosSection";
import { HistoricoSection } from "@/components/HistoricoSection";
import { DetalhesMotoboyModal } from "@/components/DetalhesMotoboyModal";
import { ConfiguracoesModal } from "@/components/ConfiguracoesModal";
import { useMototaxistas } from "@/hooks/useMototaxistas";
import { useConfiguracoes } from "@/hooks/useConfiguracoes";
import { useSolicitacoes } from "@/hooks/useSolicitacoes";
import { useFavoritos } from "@/hooks/useFavoritos";
import { useHistorico } from "@/hooks/useHistorico";
import { useEnderecosPadrao } from "@/hooks/useEnderecosPadrao";
import { useAvaliacoes } from "@/hooks/useAvaliacoes";
import { Mototaxista, Solicitacao } from "@/types/mototaxi";
import { useToast } from "@/hooks/use-toast";
import { AddToHomeScreenCarousel } from "@/components/AddToWarn";
import usePWAInstall from "@/hooks/usePWAInstall";
import InstallPWAButton from "@/components/InstallPWAButton";
import { BannerSection } from "@/components/Banners";
import EnviarEmail from "@/components/EnviarEmail";
import { PoliticaSeguranca } from "@/components/PoliticaSeguranca";

type TelaTipo = 'inicial' | 'solicitar' | 'confirmacao' | 'gerenciar' | 'selecionar-mototaxista';

const Index = () => {
    const [userId, setUserId] = useState(null);
    const [isPremium, setIsPremium] = useState(false);
    const [ dateExpiration, setDateExpiration ] = useState();
    const [premiumLoading, setPremiumLoading] = useState(true);

    // useEffect 1: Geração e recuperação do ID do usuário, agora dentro de 'configuracoes-usuario'
    useEffect(() => {
        let storedConfig;
        const configString = localStorage.getItem('configuracoes-usuario');

        try {
            storedConfig = configString ? JSON.parse(configString) : {};
        } catch (error) {
            console.error('Erro ao ler configurações do usuário no localStorage:', error);
            storedConfig = {};
        }

        let storedId = storedConfig.userId;
        // console.log()
        // if (!storedId) {
        //     const newId = `user-${Math.random().toString(36).substring(2, 15)}`;
        //     storedConfig.userId = newId;
        //     localStorage.setItem('configuracoes-usuario', JSON.stringify(storedConfig));
        //     storedId = newId;
        // }
        
         setUserId(storedId);
    }, []);

    // useEffect 2: Verificação do status premium usando o proxy
    useEffect(() => {
        if (userId) {
            const proxyUrl = 'https://script.google.com/macros/s/AKfycbzlQiSCBtvQFfvPU5_aXchhTvSGPONo7Q_ZAmdT8FXEkg-bl0FTjzKtDyWtTv3oKxM1/exec';
            
            fetch(`${proxyUrl}?id=${userId}`)
  .then(response => response.json())
  .then(data => {
    console.log('Dados da planilha:', data);

    if (data.found && data.data) {
      // extrair premium e data expiração do objeto data.data
      const isPremium = data.data.Premium === 'Sim';
      // Pode precisar tratar se data.data["Data Expiração"] é 'undefined', 'null' ou string vazia:
      let expiration_date = data.data["Data Expiração"];
      if (
        !expiration_date ||
        expiration_date === 'undefined' ||
        expiration_date === 'null' ||
        expiration_date.trim() === ''
      ) {
        expiration_date = null;
      }
      setIsPremium(isPremium);
      setDateExpiration(expiration_date);
    } else {
      setIsPremium(false);
      setDateExpiration(null);
    }

    setPremiumLoading(false);
  })
  .catch(error => {
    console.error('Erro ao verificar status premium:', error);
    setIsPremium(false);
    setDateExpiration(null);
    setPremiumLoading(false);
  });

        } else {
            // Se o userId ainda não foi gerado, consideramos em loading
            setPremiumLoading(true);
        }
    }, [userId]);

    // Seus estados e hooks existentes
    const [telaAtual, setTelaAtual] = useState<TelaTipo>('inicial');
    const [ultimaSolicitacao, setUltimaSolicitacao] = useState<Solicitacao | null>(null);
    const [mototaxistaSelecionado, setMototaxistaSelecionado] = useState<Mototaxista | null>(null);
    const [viagemParaRepetir, setViagemParaRepetir] = useState<Solicitacao | null>(null);
    const [mostrarConfirmacaoRepeticao, setMostrarConfirmacaoRepeticao] = useState(false);
    const [motoboyDetalhes, setMotoboyDetalhes] = useState<Mototaxista | null>(null);
    const [mostrarDetalhesModal, setMostrarDetalhesModal] = useState(false);
    const [mostrarConfiguracoesModal, setMostrarConfiguracoesModal] = useState(false);
    const { mototaxistasAtivos, quantidadeAtivos, mototaxistas, toggleStatus } = useMototaxistas();
    const { adicionarSolicitacao } = useSolicitacoes();
    const { favoritos, adicionarFavorito, removerFavorito, isFavorito } = useFavoritos();
    const { historico, adicionarViagem, adicionarAvaliacao, obterAvaliacao } = useHistorico();
    const { enderecos } = useEnderecosPadrao();
    const { toast } = useToast();
    const { calcularMetricasMotorista, adicionarAvaliacao: adicionarAvaliacaoReativa } = useAvaliacoes();
    const { configuracao } = useConfiguracoes();

    const handleSolicitar = (dadosSolicitacao: Omit<Solicitacao, 'id'>) => {
        const solicitacao = adicionarSolicitacao(dadosSolicitacao);
        setUltimaSolicitacao(solicitacao);
        adicionarViagem(solicitacao);
        setTelaAtual('confirmacao');
        
        toast({
            title: "Solicitação Completa!",
            description: "Agora envie seu pedido.",
        });
    };

    const handleSelecionarMototaxista = (mototaxista: Mototaxista) => {
        setMototaxistaSelecionado(mototaxista);
        localStorage.setItem("mototaxista", JSON.stringify(mototaxista));
        setTelaAtual('solicitar');
    };

    const handleSelecionarFavorito = (mototaxista: Mototaxista) => {
        handleSelecionarMototaxista(mototaxista);
    };

    const handleMostrarDetalhes = (mototaxista: Mototaxista) => {
        setMotoboyDetalhes(mototaxista);
        setMostrarDetalhesModal(true);
    };

    const handleReutilizarViagem = (viagem: Solicitacao) => {
        setViagemParaRepetir(viagem);
        setMostrarConfirmacaoRepeticao(true);
    };

    const handleConfirmarRepeticaoViagem = (novaViagem: Solicitacao) => {
        const solicitacao = adicionarSolicitacao(novaViagem);
        setUltimaSolicitacao(solicitacao);
        adicionarViagem(solicitacao);
        setTelaAtual('confirmacao');
        
        toast({
            title: "Viagem repetida!",
            description: "Agora envie seu pedido.",
        });
    };

    const handleToggleFavorito = (mototaxista: Mototaxista) => {
        if (isFavorito(mototaxista.id)) {
            removerFavorito(mototaxista.id);
            toast({
                title: "Removido dos favoritos",
                description: `${mototaxista.nome} foi removido dos seus favoritos.`,
            });
        } else {
            const sucesso = adicionarFavorito(mototaxista);
            if (sucesso) {
                toast({
                    title: "Adicionado aos favoritos",
                    description: `${mototaxista.nome} foi adicionado aos seus favoritos.`,
                });
            } else {
                toast({
                    title: "Limite atingido",
                    description: "Você pode ter no máximo 3 motoboys favoritos.",
                    variant: "destructive"
                });
            }
        }
    };

    const enviarWhatsApp = () => {
    if (!ultimaSolicitacao) return;
  
    const dadosMototaxista = localStorage.getItem("mototaxista");
    let telefone = "71999099688";
  
    if (dadosMototaxista) {
      try {
        const mototaxista = JSON.parse(dadosMototaxista);
        if (mototaxista.telefone) {
          telefone = mototaxista.telefone.replace(/\D/g, "");
          if (!telefone.startsWith("55")) {
            telefone = "55" + telefone;
          }
        }
      } catch (error) {
        console.error("Erro ao ler telefone do mototaxista no localStorage", error);
      }
    }
  
    let mensagem = `🚕 *NOVA SOLICITAÇÃO DE MOTO-TÁXI*\n\n`;
    mensagem += `👤 *Cliente:* ${ultimaSolicitacao.nome}\n`;
    mensagem += `🧭 *Serviço:* ${ultimaSolicitacao.serviceType ?? 'corrida'}\n`;
    mensagem += `📍 *Origem:* ${ultimaSolicitacao.endereco}\n`;
  
    if (ultimaSolicitacao.destino) {
      mensagem += `🎯 *Destino:* ${ultimaSolicitacao.destino}\n`;
    }
  
    if (ultimaSolicitacao.coordenadasOrigem) {
      const { lat, lng } = ultimaSolicitacao.coordenadasOrigem;
      mensagem += `📱 *Link Origem:* https://maps.google.com/?q=${lat},${lng}\n`;
    }
  
    if (ultimaSolicitacao.isAgendamento) {
      mensagem += `*Tipo de viagem: Agendadada*`;
    }
  
    mensagem += `\n⏰ *Horário:* ${ultimaSolicitacao.dataHora.toLocaleString('pt-BR')}\n`;
    mensagem += `\n*Favor confirmar se pode atender! 🙏*`;
  
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };
    // Estados e hooks mantidos, removi só para foco no JSX

    // ... seu código de estados e hooks omitido para foco no JSX

    // Exemplo: handleSolicitar, handleSelecionarMototaxista, etc.

    // Função renderTela estilizada
    const renderTela = () => {
        switch (telaAtual) {
            case 'solicitar':
                return (
                    <div className="bg-white rounded-xl shadow-md p-6 max-w-lg mx-auto">
                        <SolicitarForm
                            onSolicitar={handleSolicitar}
                            onCancel={() => setTelaAtual('inicial')}
                            mototaxistaSelecionado={mototaxistaSelecionado}
                            enderecosPadrao={enderecos}
                        />
                    </div>
                );
            case 'selecionar-mototaxista':
                return (
                    <div className="max-w-lg mx-auto p-4 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-3xl font-extrabold text-gray-900">Selecionar Mototaxista</h2>
                            <Button 
                                variant="outline" 
                                onClick={() => setTelaAtual('inicial')}
                                className="rounded-lg border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition"
                            >
                                Voltar
                            </Button>
                        </div>
                        
                        <div className="space-y-4">
                            {mototaxistasAtivos.map((mototaxista) => {
                                const metricas = calcularMetricasMotorista(mototaxista.nome, historico);
                                return (
                                    <MototaxistaCard
                                        key={mototaxista.id}
                                        mototaxista={mototaxista}
                                        onToggleStatus={toggleStatus}
                                        onSelecionar={handleMostrarDetalhes}
                                        isFavorito={isFavorito(mototaxista.id)}
                                        onToggleFavorito={handleToggleFavorito}
                                        showFavoriteButton={true}
                                        metricas={metricas}
                                        // className="hover:shadow-lg transition-shadow rounded-lg"
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            case 'confirmacao':
                return ultimaSolicitacao ? (
                    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
                        <ConfirmacaoSolicitacao
                            solicitacao={ultimaSolicitacao}
                            onVoltarInicio={() => setTelaAtual('inicial')}
                            onEnviarWhatsApp={enviarWhatsApp}
                        />
                    </div>
                ) : null;
            case 'gerenciar':
                return (
                    <div className="max-w-lg mx-auto p-4 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-3xl font-extrabold text-gray-900">Gerenciar Mototaxistas</h2>
                            <Button 
                                variant="outline" 
                                onClick={() => setTelaAtual('inicial')}
                                className="rounded-lg border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition"
                            >
                                Voltar
                            </Button>
                        </div>
                        
                        <div className="space-y-4">
                            {mototaxistas.map((mototaxista) => (
                                <MototaxistaCard
                                    key={mototaxista.id}
                                    mototaxista={mototaxista}
                                    onToggleStatus={toggleStatus}
                                    showToggle={true}
                                    // className="hover:shadow-lg transition-shadow rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="space-y-8">
                        {/* Header */}
                        <header className="text-center space-y-3 max-w-md mx-auto">
                            <div className="flex items-center justify-between px-2">
                                <div></div>
                                <h1 className="text-4xl font-extrabold flex items-center justify-center gap-3 text-gray-900">
                                    <Bike className="h-10 w-10 text-primary" />
                                    RapMoto
                                </h1>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setMostrarConfiguracoesModal(true)}
                                    className="text-gray-500 hover:text-gray-900 transition"
                                    aria-label="Configurações"
                                >
                                    <User className="h-6 w-6" />
                                </Button>
                            </div>
                            <p className="text-gray-600 text-lg font-medium">
                                Seu táxi na palma da mão, você no controle da corrida.
                            </p>
                            <InstallPWAButton />
                        </header>

                        <FavoritosSection 
                            favoritos={favoritos} 
                            onSelecionarFavorito={handleSelecionarFavorito}
                            onRemoverFavorito={removerFavorito}
                        />
                        <HistoricoSection 
                            historico={historico}
                            onReutilizarViagem={handleReutilizarViagem}
                            onSalvarAvaliacao={adicionarAvaliacaoReativa}
                            obterAvaliacao={obterAvaliacao}
                        />

                        <Card className="max-w-lg mx-auto rounded-xl shadow-lg border border-gray-200">
                            <CardHeader className="bg-gray-50 rounded-t-xl p-4">
                                <CardTitle className="flex items-center gap-2 text-gray-900 font-extrabold text-xl">
                                    <Users className="h-6 w-6" />
                                    Mototaxistas Disponíveis 
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-4">
                                    {mototaxistasAtivos.slice(0, 3).map((mototaxista) => {
                                        const metricas = calcularMetricasMotorista(mototaxista.nome, historico);
                                        return (
                                            <MototaxistaCard
                                                key={mototaxista.id}
                                                mototaxista={mototaxista}
                                                onToggleStatus={toggleStatus}
                                                onSelecionar={handleMostrarDetalhes}
                                                isFavorito={isFavorito(mototaxista.id)}
                                                onToggleFavorito={handleToggleFavorito}
                                                showFavoriteButton={true}
                                                metricas={metricas}
                                                // className="rounded-lg hover:shadow-md transition-shadow"
                                            />
                                        );
                                    })}
                                    {quantidadeAtivos > 2 && (
                                        <Button
                                            variant="outline"
                                            className="w-full mt-2 rounded-lg border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition"
                                            onClick={() => setTelaAtual('selecionar-mototaxista')}
                                        >
                                            Ver todos motoboys do app ({quantidadeAtivos} disponíveis)
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="max-w-lg mx-auto space-y-3 mt-6">
                            <Button
                                onClick={() => setTelaAtual('selecionar-mototaxista')}
                                disabled={quantidadeAtivos === 0}
                                className="w-full h-14 text-lg font-semibold rounded-lg bg-primary text-white hover:bg-primary-dark transition"
                                size="lg"
                            >
                                <Car className="h-5 w-5 mr-2 inline-block align-middle" />
                                Solicitar Moto-Táxi
                            </Button>
                        </div>

                        <div className="max-w-lg mx-auto">
                            <PoliticaSeguranca />
                        </div>

                        <BannerSection/>

                        <footer className="max-w-lg mx-auto flex flex-col items-center space-y-2 mt-10 mb-8 text-gray-500 text-sm">
                            {/* <img src="/caminho/para/logo.png" alt="Logo" className="w-10 h-10 object-contain" /> */}
                            <p>Desenvolvedor: Bruno Abreu</p>
                            <p>Contato: brunoabreudevs@gmail.com</p>
                            <EnviarEmail />
                        </footer>
                    </div>
                );
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 p-6 flex justify-center">
            <div className="w-full max-w-md">
                {renderTela()}
            </div>

            <ConfirmarRepetirViagem
                viagem={viagemParaRepetir}
                isOpen={mostrarConfirmacaoRepeticao}
                onClose={() => {
                    setMostrarConfirmacaoRepeticao(false);
                    setViagemParaRepetir(null);
                }}
                onConfirmar={handleConfirmarRepeticaoViagem}
            />

            <DetalhesMotoboyModal
                loading={premiumLoading}
                premium={isPremium}
                mototaxista={motoboyDetalhes}
                isOpen={mostrarDetalhesModal}
                onClose={() => {
                    setMostrarDetalhesModal(false);
                    setMotoboyDetalhes(null);
                }}
                onSelecionar={handleSelecionarMototaxista}
                metricas={motoboyDetalhes ? calcularMetricasMotorista(motoboyDetalhes.nome, historico) : undefined}
            />

            <ConfiguracoesModal
                Premium={isPremium}
                dateExpira={dateExpiration}
                isOpen={mostrarConfiguracoesModal}
                onClose={() => setMostrarConfiguracoesModal(false)}
            />
        </main>
    );
};

export default Index;
