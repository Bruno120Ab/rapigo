import { useRef, useState, useEffect } from "react";
import { Settings, User, Moon, Sun, Type, UserCheck, ShieldCheck, ShieldX } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { enviarUserParaGoogleForms } from "@/hooks/use-login";
import { HistoricoAvaliacao } from "./HistoricoAvaliacoes";
import HistoricoCorridas from "./HistoricoCorridas";

interface Configuracao {
  nomeClientePadrao: string;
  email: string;
  ehMotoboy: boolean;
  modoEscuro: boolean;
  tamanhoFonte: "pequeno" | "medio" | "grande";
  usuarioPadrao: boolean;
}

interface ConfiguracoesModalProps {
  Premium: boolean;
  isOpen: boolean;
  dateExpira: string;
  idUser:string;
  onClose: () => void;
}

const STORAGE_KEY = "configuracoes-usuario";

export const ConfiguracoesModal = ({ Premium, isOpen, dateExpira, idUser, onClose }: ConfiguracoesModalProps) => {
  const { toast } = useToast();
  const inputNomeRef = useRef<HTMLInputElement>(null);

  const [configLocal, setConfigLocal] = useState<Configuracao>({
    nomeClientePadrao: "",
    email: "",
    ehMotoboy: false,
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

    // Carrega estado inicial
    setConfigLocal({
      nomeClientePadrao: dados.nomeClientePadrao || "",
      email: dados.email || "",
      ehMotoboy: dados.ehMotoboy || false,
      modoEscuro: dados.modoEscuro || false,
      tamanhoFonte: dados.tamanhoFonte || "medio",
      usuarioPadrao: dados.usuarioPadrao || false,
    });

    if (dados.nomeClientePadrao && dados.email) {
      setHasConfigSaved(true);

      // Busca do servidor
      const proxyUrl =
        "https://script.google.com/macros/s/AKfycbwNFDyGr0UUAmP1-d_bGai0ZXCJtcai59MGAtrHowT83051OAgrvCeDNYU7H_I7eA/exec?type=users";

      fetch(`${proxyUrl}&id=${dados.userId}`)
        .then((response) => response.json())
        .then((data) => {
          
          if (data.found && data.data) {
            const novoEhMotoboy = data.data.Motoboy;

            // Atualiza estado
            setConfigLocal((prev) => ({
              ...prev,
              ehMotoboy: novoEhMotoboy,
            }));

            // Atualiza localStorage para persistência
            const dadosAtualizados = {
              ...dados,
              ehMotoboy: novoEhMotoboy,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosAtualizados));
          }
        })
        .catch((err) => {
          console.error("Erro ao buscar dados do usuário:", err);
        });
    } else {
      setHasConfigSaved(false);
    }
  } catch (e) {
    console.error("Erro ao ler config local:", e);
    setHasConfigSaved(false);
    setConfigLocal({
      nomeClientePadrao: "",
      email: "",
      ehMotoboy: false,
      modoEscuro: false,
      tamanhoFonte: "medio",
      usuarioPadrao: false,
    });
  }
}, [isOpen]);


  const getUserId = () => {
    const dadosStr = localStorage.getItem(STORAGE_KEY);
    if (dadosStr) {
      try {
        const dados = JSON.parse(dadosStr);
        if (dados.userId) {
          return dados.userId;
        }
      } catch {}
    }
    return `${Math.random().toString(36).slice(2)}`;
  };

  const handleSalvar = () => {
    if (hasConfigSaved) {
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

    if (!configLocal.email.trim() || !/\S+@\S+\.\S+/.test(configLocal.email)) {
      toast({
        title: "Email inválido",
        description: "Informe um email válido para continuar.",
        variant: "destructive",
      });
      return;
    }

    const userId = getUserId();

    const dadosParaSalvar = { userId, ...configLocal };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosParaSalvar));

    const dataCadastro = new Date().toISOString().slice(0, 10);

    enviarUserParaGoogleForms({
      ehMotoboy: configLocal.ehMotoboy ? "Sim" : "Não",
      email: configLocal.email,
      nomeClientePadrao: configLocal.nomeClientePadrao,
      userId,
      Premium: Premium ? "Sim" : "Não",
      DateExpir: dateExpira,
      DateCAd: dataCadastro,
    });

    setHasConfigSaved(true);

    toast({
      title: "Configurações salvas",
      variant: "default",
    });

    onClose();
  };

  // Limpa dados para poder cadastrar novo usuário
  const handleLimpar = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConfigLocal({
      nomeClientePadrao: "",
      email: "",
      ehMotoboy: false,
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
  };

  const data = new Date(dateExpira + "T00:00:00");
  const handleCancel = () => onClose();
  const nomeMotoboy = 't57c73ywswi';

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

          <div className="space-y-2">
            <Label htmlFor="email-cliente" className="flex items-center gap-2">
              Email
            </Label>
            <Input
              id="email-cliente"
              type="email"
              placeholder="Digite seu email"
              value={configLocal.email}
              onChange={(e) => setConfigLocal({ ...configLocal, email: e.target.value })}
              disabled={hasConfigSaved}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="eh-motoboy"
              checked={configLocal.ehMotoboy}
              onCheckedChange={(checked) => setConfigLocal({ ...configLocal, ehMotoboy: checked })}
              disabled={hasConfigSaved}
            />
            <Label htmlFor="eh-motoboy">Sou motoboy</Label>
          </div>
{/* 
          <div className="flex items-center justify-between">
            <Label htmlFor="modo-escuro" className="flex items-center gap-2">
              {configLocal.modoEscuro ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              Modo Escuro
            </Label>
            <Switch
              id="modo-escuro"
              checked={configLocal.modoEscuro}
              onCheckedChange={(checked) => setConfigLocal({ ...configLocal, modoEscuro: checked })}
              disabled={hasConfigSaved}
            />
          </div> */}

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
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pequeno">Pequeno</SelectItem>
                <SelectItem value="medio">Médio</SelectItem>
                <SelectItem value="grande">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="usuario-padrao" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Marcar como usuário padrão
            </Label>
            <Switch
              id="usuario-padrao"
              checked={configLocal.usuarioPadrao}
              onCheckedChange={(checked) => setConfigLocal({ ...configLocal, usuarioPadrao: checked })}
              disabled={hasConfigSaved}
            />
          </div>

          {configLocal.ehMotoboy && (
            <>
              {Premium ? (
                <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-green-500" />
                          Usuário Premium
                          <ShieldCheck className="h-4 w-4 text-green-500" />
                          Data de expiração 
                        </Label>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <ShieldX className="h-4 w-4 text-red-500 " />
                          Assine o Premium
                        </Label>
                      </div>
                    )}

              <div className="border rounded-md p-3 max-h-80 overflow-auto">
                <HistoricoCorridas isPremium={Premium} idMoto={idUser} />
              </div>
            </>
          )}

          {/* {Premium  && configLocal.ehMotoboy ? ( */}
           

          {/* <div className="border rounded-md p-3 max-h-80 overflow-auto">
            <HistoricoAvaliacao isPremium={Premium} idMoto={idUser} />
          </div> */}
        
        </div>

        <div className="flex gap-2 pt-4 px-4 pb-4 border-t bg-white sticky bottom-0">
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Cancelar
          </Button>

          {!hasConfigSaved && (
            <Button onClick={handleSalvar} className="flex-1">
              Salvar
            </Button>
          )}

          {hasConfigSaved && (
            <Button variant="destructive" onClick={handleLimpar} className="flex-1">
              Limpar usuário
            </Button>
          )}

          {!Premium && (
            <Button
              onClick={() => {
                // Botão para "Torne-se Membro"
              }}
              variant="outline"
              className="flex-1"
            >
              Torne-se Membro
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
