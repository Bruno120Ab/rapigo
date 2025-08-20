// import { useRef, useState, useEffect } from "react";
// import { Settings, User, Moon, Sun, Type, UserCheck, ShieldCheck, ShieldX } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { enviarUserParaGoogleForms } from "@/hooks/use-login";
// import { HistoricoAvaliacao } from "./HistoricoAvaliacoes";
// import HistoricoCorridas from "./HistoricoCorridas";
// import { nanoid } from "nanoid";

// interface Configuracao {
//   nomeClientePadrao: string;
//   email: string;
//   ehMotoboy: boolean;
//   ativo: boolean; // <- novo campo
//   modoEscuro: boolean;
//   tamanhoFonte: "pequeno" | "medio" | "grande";
//   usuarioPadrao: boolean;
// }

// interface ConfiguracoesModalProps {
//   Premium: boolean;
//   isOpen: boolean;
//   dateExpira: string;
//   idUser:string;
//   onClose: () => void;
// }

// const STORAGE_KEY = "configuracoes-usuario";

// export const ConfiguracoesModal = ({ Premium, isOpen, dateExpira, idUser, onClose }: ConfiguracoesModalProps) => {
//   const { toast } = useToast();
//   const inputNomeRef = useRef<HTMLInputElement>(null);

//   const [configLocal, setConfigLocal] = useState<Configuracao>({
//     nomeClientePadrao: "",
//     email: "",
//     ehMotoboy: false,
//     ativo: false, // <- novo
//     modoEscuro: false,
//     tamanhoFonte: "medio",
//     usuarioPadrao: false,
//   });

//   const [hasConfigSaved, setHasConfigSaved] = useState(false);
//   useEffect(() => {
//   if (!isOpen) return;

//   const dadosStr = localStorage.getItem(STORAGE_KEY);
//   if (!dadosStr) return;

//   try {
//     const dados = JSON.parse(dadosStr);

//     setConfigLocal((prev) => ({
//       ...prev,
//       ativo: dados.ativo || false,
//       ehMotoboy: dados.ehMotoboy || false,
//       nomeClientePadrao: dados.nomeClientePadrao || "",
//       email: dados.email || "",
//       tamanhoFonte: dados.tamanhoFonte || "medio",
//       usuarioPadrao: dados.usuarioPadrao || false,
//     }));
//   } catch (err) {
//     console.error("Erro ao ler config do localStorage", err);
//   }
// }, [isOpen]);

//   // Carregar dados do localStorage ao abrir modal
//   useEffect(() => {
//     if (!isOpen) return;

//     const dadosStr = localStorage.getItem(STORAGE_KEY);
//     if (!dadosStr) {
//       setHasConfigSaved(false);
//       return;
//     }

//     try {
//       const dados = JSON.parse(dadosStr);

//       // Carrega estado inicial
//       setConfigLocal({
//         nomeClientePadrao: dados.nomeClientePadrao || "",
//         email: dados.email || "",
//         ehMotoboy: dados.ehMotoboy || false,
//         ativo: dados.ativo || false, // <- novo
//         modoEscuro: dados.modoEscuro || false,
//         tamanhoFonte: dados.tamanhoFonte || "medio",
//         usuarioPadrao: dados.usuarioPadrao || false,
//       });

//       if (dados.nomeClientePadrao && dados.email) {
//         setHasConfigSaved(true);

//         // Busca do servidor
//         const proxyUrl =
//           "https://script.google.com/macros/s/AKfycbwNFDyGr0UUAmP1-d_bGai0ZXCJtcai59MGAtrHowT83051OAgrvCeDNYU7H_I7eA/exec?type=users";

//         fetch(`${proxyUrl}&id=${dados.userId}`)
//           .then((response) => response.json())
//           .then((data) => {
//             if (data.found && data.data) {
//               const novoEhMotoboy = data.data.Motoboy;

//               // Atualiza estado
//               setConfigLocal((prev) => ({
//                 ...prev,
//                 ehMotoboy: novoEhMotoboy,
//               }));

//               // Atualiza localStorage para persistência
//               const dadosAtualizados = {
//                 ...dados,
//                 ehMotoboy: novoEhMotoboy,
//               };
//               localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosAtualizados));
//             }
//           })
//           .catch((err) => {
//             console.error("Erro ao buscar dados do usuário:", err);
//           });
//       } else {
//         setHasConfigSaved(false);
//       }
//     } catch (e) {
//       console.error("Erro ao ler config local:", e);
//       setHasConfigSaved(false);
//       setConfigLocal({
//         nomeClientePadrao: "",
//         email: "",
//         ehMotoboy: false,
//         ativo: false, // <- novo
//         modoEscuro: false,
//         tamanhoFonte: "medio",
//         usuarioPadrao: false,
//       });
//     }
//   }, [isOpen]);

//   function generateUUID() {
//     return nanoid();
//   }

//   const getUserId = () => {
//     const dadosStr = localStorage.getItem(STORAGE_KEY);
//     if (dadosStr) {
//       try {
//         const dados = JSON.parse(dadosStr);
//         if (dados.userId) {
//           return dados.userId;
//         }
//       } catch {}
//     }
//     return generateUUID();
//   };

//   const handleSalvar = () => {
//     if (hasConfigSaved) {
//       toast({
//         title: "Configurações já salvas",
//         description: "Você já possui configurações salvas e não pode salvar novamente.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!configLocal.nomeClientePadrao.trim()) {
//       toast({
//         title: "Nome obrigatório",
//         description: "Informe seu nome completo para continuar.",
//         variant: "destructive",
//       });
//       inputNomeRef.current?.focus();
//       return;
//     }

//     const userId = getUserId();
//     const dadosParaSalvar = { userId, ...configLocal };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosParaSalvar));

//     const dataCadastro = new Date().toISOString().slice(0, 10);

//     enviarUserParaGoogleForms({
//       ehMotoboy: configLocal.ehMotoboy ? "True" : "False",
//       ativo: configLocal.ativo ? "True" : "False", // <- novo
//       email: configLocal.email,
//       nomeClientePadrao: configLocal.nomeClientePadrao,
//       userId,
//       Premium: "Sim",
//       DateExpir: dateExpira,
//       DateCAd: dataCadastro,
//     });

//     setHasConfigSaved(true);

//     toast({
//       title: "Configurações salvas",
//       variant: "default",
//     });
//     onClose()
//   };

//   const handleLimpar = () => {
//     onClose();
//     localStorage.removeItem(STORAGE_KEY);

//     setConfigLocal({
//       nomeClientePadrao: "",
//       email: "",
//       ehMotoboy: false,
//       ativo: false, // <- novo
//       modoEscuro: false,
//       tamanhoFonte: "medio",
//       usuarioPadrao: false,
//     });
//     setHasConfigSaved(false);

//     toast({
//       title: "Configurações removidas",
//       description: "Você pode cadastrar um novo usuário agora.",
//       variant: "default",
//     });
//   };

//   const handleCancel = () => onClose();

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Settings className="h-5 w-5" />
//             Perfil
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6 overflow-y-auto max-h-[calc(80vh-6rem)] px-4 py-2">
//           <div className="space-y-2">
//             <Label htmlFor="nome-cliente" className="flex items-center gap-2">
//               <User className="h-4 w-4" />
//               Nome do Cliente Padrão
//             </Label>
//             <Input
//               id="nome-cliente"
//               placeholder="Digite seu nome"
//               value={configLocal.nomeClientePadrao}
//               onChange={(e) => setConfigLocal({ ...configLocal, nomeClientePadrao: e.target.value })}
//               ref={inputNomeRef}
//               disabled={hasConfigSaved}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="email-cliente" className="flex items-center gap-2">
//               Numero
//             </Label>
//             <Input
//               id="email-cliente"
//               type="email"
//               placeholder="(77) 9 xxxxxxxx"
//               value={configLocal.email}
//               onChange={(e) => setConfigLocal({ ...configLocal, email: e.target.value })}
//               disabled={hasConfigSaved}
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <Switch
//               id="eh-motoboy"
//               checked={configLocal.ehMotoboy}
//               onCheckedChange={(checked) => setConfigLocal({ ...configLocal, ehMotoboy: checked })}
//               disabled={hasConfigSaved}
//             />
//             <Label htmlFor="eh-motoboy">Sou motoboy</Label>
//           </div>

//           {/* Novo switch "Estou ativo" */}
//         <div className="flex items-center gap-2">
// <div className="flex items-center gap-2">
//   <Switch
//   id="ativo"
//   checked={configLocal.ativo}
//   onCheckedChange={async (checked) => {
//     // Atualiza estado local
//     setConfigLocal((prev) => ({ ...prev, ativo: checked }));

//     // Atualiza localStorage imediatamente
//     const dadosStr = localStorage.getItem(STORAGE_KEY);
//     if (dadosStr) {
//       try {
//         const dados = JSON.parse(dadosStr);
//         const atualizados = { ...dados, ativo: checked };
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados));
//       } catch (err) {
//         console.error("Erro ao atualizar localStorage:", err);
//       }
//     }

//     // Chama Apps Script
//     try {
//       const dados = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
//       if (!dados.userId) return;

//       const webAppUrl =
//         "https://script.google.com/macros/s/AKfycbxhQBrQwDbCPsT5DISk5Ez8L6ZeSk_Xd2gW9h7ZCq4x1g_fPQswGneB3jSor3Zpb7w/exec";

//       const params = new URLSearchParams({
//         type: "status",
//         userId: dados.userId,
//         ativo: checked ? "TRUE" : "FALSE",
//       });

//       const response = await fetch(`${webAppUrl}?${params.toString()}`);
//       const result = await response.json();
//       if (!result.success) console.error("Erro ao atualizar status na planilha", result.error);
//     } catch (err) {
//       console.error("Erro ao chamar Apps Script", err);
//     }
//   }}
// />

//   <Label htmlFor="ativo">Estou ativo (rodando)</Label>
// </div>
// </div>
//           <div className="space-y-2">
//             <Label className="flex items-center gap-2">
//               <Type className="h-4 w-4" />
//               Tamanho da Fonte
//             </Label>
//             <Select
//               value={configLocal.tamanhoFonte}
//               onValueChange={(value: "pequeno" | "medio" | "grande") =>
//                 setConfigLocal({ ...configLocal, tamanhoFonte: value })
//               }
//               disabled={hasConfigSaved}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="pequeno">Pequeno</SelectItem>
//                 <SelectItem value="medio">Médio</SelectItem>
//                 <SelectItem value="grande">Grande</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="flex items-center justify-between">
//             <Label htmlFor="usuario-padrao" className="flex items-center gap-2">
//               <UserCheck className="h-4 w-4" />
//               Marcar como usuário padrão
//             </Label>
//             <Switch
//               id="usuario-padrao"
//               checked={configLocal.usuarioPadrao}
//               onCheckedChange={(checked) => setConfigLocal({ ...configLocal, usuarioPadrao: checked })}
//               disabled={hasConfigSaved}
//             />
//           </div>

//           {configLocal.ehMotoboy && (
//             <div className="border rounded-md p-3 max-h-80 overflow-auto">
//               <HistoricoCorridas isPremium={Premium} idMoto={idUser} />
//             </div>
//           )}
//         </div>

//         <div className="flex gap-2 pt-4 px-4 pb-4 border-t bg-white sticky bottom-0">
//           <Button variant="outline" onClick={handleCancel} className="flex-1">
//             Cancelar
//           </Button>

//           {!hasConfigSaved && (
//             <Button onClick={handleSalvar} className="flex-1">
//               Salvar
//             </Button>
//           )}

//           {hasConfigSaved && (
//             <Button variant="destructive" onClick={handleLimpar} className="flex-1">
//               Limpar usuário
//             </Button>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };



import { useRef, useState, useEffect } from "react";
import { Settings, User, Type, UserCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { enviarUserParaGoogleForms } from "@/hooks/use-login";
import HistoricoCorridas from "./HistoricoCorridas";
import { nanoid } from "nanoid";

interface Configuracao {
  nomeClientePadrao: string;
  email: string;
  ehMotoboy: boolean;
  ativo: boolean;
  modoEscuro: boolean;
  tamanhoFonte: "pequeno" | "medio" | "grande";
  usuarioPadrao: boolean;
}

interface ConfiguracoesModalProps {
  onUpdatePremium?: (premium: boolean) => void; 
  Premium: boolean;
  isOpen: boolean;
  dateExpira: string;
  idUser: string;
  onClose: () => void;
}

const STORAGE_KEY = "configuracoes-usuario";

export const ConfiguracoesModal = ({ onUpdatePremium, Premium, isOpen, dateExpira, idUser, onClose }: ConfiguracoesModalProps) => {
  const { toast } = useToast();
  const inputNomeRef = useRef<HTMLInputElement>(null);

  const [configLocal, setConfigLocal] = useState<Configuracao>({
    nomeClientePadrao: "",
    email: "",
    ehMotoboy: false,
    ativo: false,
    modoEscuro: false,
    tamanhoFonte: "medio",
    usuarioPadrao: false,
  });

  const [hasConfigSaved, setHasConfigSaved] = useState(false);

  // Carregar dados do localStorage ao abrir modal
  useEffect(() => {
    if (!isOpen) return;

    const dadosStr = localStorage.getItem(STORAGE_KEY);
    if (!dadosStr) {
      setHasConfigSaved(false);
      return;
    }

    try {
      const dados = JSON.parse(dadosStr);

      setConfigLocal({
        nomeClientePadrao: dados.nomeClientePadrao || "",
        email: dados.email || "",
        ehMotoboy: dados.ehMotoboy || false,
        ativo: dados.ativo || false,
        modoEscuro: dados.modoEscuro || false,
        tamanhoFonte: dados.tamanhoFonte || "medio",
        usuarioPadrao: dados.usuarioPadrao || false,
      });

      setHasConfigSaved(Boolean(dados.nomeClientePadrao && dados.email));
    } catch (e) {
      console.error("Erro ao ler config local:", e);
      setHasConfigSaved(false);
    }
  }, [isOpen]);

  const generateUUID = () => nanoid();

  const getUserId = () => {
    const dadosStr = localStorage.getItem(STORAGE_KEY);
    if (dadosStr) {
      try {
        const dados = JSON.parse(dadosStr);
        if (dados.userId) return dados.userId;
      } catch {}
    }
    return generateUUID();
  };

  const handleSalvar = () => {
    if (hasConfigSaved) {
      onUpdatePremium?.(true);

      toast({
        title: "Configurações já salvas",
        description: "Você já possui configurações salvas e não pode salvar novamente.",
        variant: "destructive",
      });
      return;
    }

    if (!configLocal.nomeClientePadrao.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Informe seu nome completo para continuar.",
        variant: "destructive",
      });
      inputNomeRef.current?.focus();
      return;
    }

    const userId = getUserId();
    const dadosParaSalvar = { userId, ...configLocal };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosParaSalvar));

    const dataCadastro = new Date().toISOString().slice(0, 10);

    enviarUserParaGoogleForms({
      ehMotoboy: configLocal.ehMotoboy ? "True" : "False",
      ativo: configLocal.ativo ? "True" : "False",
      email: configLocal.email,
      nomeClientePadrao: configLocal.nomeClientePadrao,
      userId,
      Premium: "Sim",
      DateExpir: dateExpira,
      DateCAd: dataCadastro,
    });

    setHasConfigSaved(true);

    toast({ title: "Configurações salvas", variant: "default" });
    onClose();
  };

  const handleLimpar = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('historico-viagens')
    localStorage.removeItem('motoboys-favoritos')

    setConfigLocal({
      nomeClientePadrao: "",
      email: "",
      ehMotoboy: false,
      ativo: false,
      modoEscuro: false,
      tamanhoFonte: "medio",
      usuarioPadrao: false,
    });
    setHasConfigSaved(false);
    toast({
      title: "Configurações removidas",
      description: "Você pode cadastrar um novo usuário agora.",
      variant: "default",
    });
    onClose();
    window.location.reload(); 
  };

  const handleToggleAtivo = async (checked: boolean) => {
    setConfigLocal((prev) => ({ ...prev, ativo: checked }));

    const dadosStr = localStorage.getItem(STORAGE_KEY);
    if (!dadosStr) return;

    try {
      const dados = JSON.parse(dadosStr);
      const atualizados = { ...dados, ativo: checked };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados));

      if (!dados.userId) return;

      const webAppUrl =
        "https://script.google.com/macros/s/AKfycbzwlvM2YYqbgbq3XeoW1giwPl36fMf8b-0TOnj4hIDDf_LSpEJRQQjXPAMVI6ZJb6gO/exec";

      const params = new URLSearchParams({
        type: "status",
        userId: dados.userId,
        ativo: checked ? "TRUE" : "FALSE",
      });

      const response = await fetch(`${webAppUrl}?${params.toString()}`);
      const result = await response.json();
      if (!result.success) console.error("Erro ao atualizar status na planilha", result.error);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Perfil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(80vh-6rem)] px-4 py-2">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome-cliente" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nome do Cliente Padrão
            </Label>
            <Input
              id="nome-cliente"
              placeholder="Digite seu nome"
              value={configLocal.nomeClientePadrao}
              onChange={(e) => setConfigLocal({ ...configLocal, nomeClientePadrao: e.target.value })}
              ref={inputNomeRef}
              disabled={hasConfigSaved}
            />
          </div>

          {/* Email / Número */}
          <div className="space-y-2">
            <Label htmlFor="email-cliente" className="flex items-center gap-2">Número</Label>
            <Input
              id="email-cliente"
              type="email"
              placeholder="(77) 9 xxxxxxxx"
              value={configLocal.email}
              onChange={(e) => setConfigLocal({ ...configLocal, email: e.target.value })}
              disabled={hasConfigSaved}
            />
          </div>

          {/* Sou motoboy */}
          <div className="flex items-center gap-2">
            <Switch
              id="eh-motoboy"
              checked={configLocal.ehMotoboy}
              onCheckedChange={(checked) => 
              setConfigLocal({ ...configLocal, ehMotoboy: checked })}
              disabled={hasConfigSaved}
            />
            <Label htmlFor="eh-motoboy">Sou motoboy</Label>
          </div>

          {/* Estou ativo */}
          
       {configLocal.ehMotoboy && (
        <div className="flex items-center gap-2">
          <Switch
            id="ativo"
            checked={configLocal.ativo}
            onCheckedChange={handleToggleAtivo}
          />
          <Label htmlFor="ativo">Estou ativo ? (Em serviço)</Label>
        </div>
      )}

          {/* Tamanho da fonte */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Tamanho da Fonte
            </Label>
            <Select
              value={configLocal.tamanhoFonte}
              onValueChange={(value: "pequeno" | "medio" | "grande") =>
                setConfigLocal({ ...configLocal, tamanhoFonte: value })
              }
              disabled={hasConfigSaved}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pequeno">Pequeno</SelectItem>
                <SelectItem value="medio">Médio</SelectItem>
                <SelectItem value="grande">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Usuário padrão */}
          <div className="flex items-center justify-between">
            <Label htmlFor="usuario-padrao" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" /> Marcar como usuário padrão
            </Label>
            <Switch
              id="usuario-padrao"
              checked={configLocal.usuarioPadrao}
              onCheckedChange={(checked) => setConfigLocal({ ...configLocal, usuarioPadrao: checked })}
              disabled={hasConfigSaved}
            />
          </div>

          {/* Histórico de corridas */}
          {configLocal.ehMotoboy && (
            <div className="border rounded-md p-3 max-h-80 overflow-auto">
              <HistoricoCorridas isPremium={Premium} idMoto={idUser} />
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-2 pt-4 px-4 pb-4 border-t bg-white sticky bottom-0">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          {!hasConfigSaved && <Button onClick={handleSalvar} className="flex-1">Salvar</Button>}
          {hasConfigSaved && <Button variant="destructive" onClick={handleLimpar} className="flex-1">Limpar usuário</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
