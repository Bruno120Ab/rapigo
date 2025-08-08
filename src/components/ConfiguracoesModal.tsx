import { useRef, useState } from "react";
import { Settings, User, Moon, Sun, Type, UserCheck, ShieldCheck, ShieldX } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConfiguracoes, Configuracao } from "@/hooks/useConfiguracoes";
import { useToast } from "@/hooks/use-toast";

interface ConfiguracoesModalProps {
  Premium: boolean;
  isOpen: boolean;
  dateExpira: string;
  onClose: () => void;
}

export const ConfiguracoesModal = ({Premium, isOpen, dateExpira, onClose }: ConfiguracoesModalProps) => {
  const { configuracao, salvarConfiguracao } = useConfiguracoes();
  const [configLocal, setConfigLocal] = useState<Configuracao>(configuracao);
  const { toast } = useToast();
  const inputNomeRef = useRef<HTMLInputElement>(null);

  const handleSalvar = () => {
    salvarConfiguracao(configLocal);
    onClose();
  };

  const enviarDadosPremiumWhatsApp = () => {
  let userId = null as string | null;
  let nomeCliente = configLocal.nomeClientePadrao?.trim() || null;

  // Se não tiver nome, alerta, foca no campo e não prossegue
  if (!nomeCliente) {
    toast({
      title: "Nome obrigatório",
      description: "Informe seu nome completo para continuar.",
      variant: "destructive",
    });
    inputNomeRef.current?.focus();
    return;
  }

  // 1. Tenta pegar os dados do localStorage
  const configString = localStorage.getItem('configuracoes-usuario');

  if (configString) {
    try {
      const config = JSON.parse(configString);
      userId = config.userId;
      // Garante que o nome informado nesta tela seja salvo
      config.nomeClientePadrao = nomeCliente;
      localStorage.setItem('configuracoes-usuario', JSON.stringify(config));
      salvarConfiguracao({ nomeClientePadrao: nomeCliente });
    } catch (error) {
      console.error("Erro ao ler configurações do usuário:", error);
    }
  } else {
    // Se não houver config ainda, cria uma mínima
    const novo = { userId: `user-${Math.random().toString(36).slice(2)}`, nomeClientePadrao: nomeCliente };
    localStorage.setItem('configuracoes-usuario', JSON.stringify(novo));
    userId = novo.userId;
    salvarConfiguracao({ nomeClientePadrao: nomeCliente });
  }

  // Se não encontrar o ID, usa um fallback
  const idParaEnvio = userId || 'ID_NÃO_ENCONTRADO';
  const nomeParaEnvio = nomeCliente;

  // 2. Monta a mensagem para o WhatsApp
  const numeroMeuWhatsapp = "5571999099688"; // <-- Mude para o seu número
  const mensagem = `
Olá! Gostaria de assinar o plano premium.
Segue minhas informações para liberação:

*Nome:* ${nomeParaEnvio}
*ID de Usuário:* ${idParaEnvio}

Anexei o comprovante de pagamento neste chat. Por favor, confirme o recebimento.
  `.trim();

  // 3. Monta a URL e abre o WhatsApp
  const url = `https://wa.me/${numeroMeuWhatsapp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
};


  const data = new Date(dateExpira + 'T00:00:00')


  const handleCancel = () => {
    setConfigLocal(configuracao); // Reseta para os valores salvos
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Nome do cliente padrão */}
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
              />
          </div>

          {/* Modo escuro */}
          <div className="flex items-center justify-between">
            <Label htmlFor="modo-escuro" className="flex items-center gap-2">
              {configLocal.modoEscuro ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              Modo Escuro
            </Label>
            <Switch
              id="modo-escuro"
              checked={configLocal.modoEscuro}
              onCheckedChange={(checked) => setConfigLocal({ ...configLocal, modoEscuro: checked })}
            />
          </div>

          {/* Tamanho da fonte */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Tamanho da Fonte
            </Label>
            <Select
              value={configLocal.tamanhoFonte}
              onValueChange={(value: 'pequeno' | 'medio' | 'grande') => 
                setConfigLocal({ ...configLocal, tamanhoFonte: value })
              }
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

          {/* Usuário padrão */}
          <div className="flex items-center justify-between">
            <Label htmlFor="usuario-padrao" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Marcar como usuário padrão
            </Label>
            <Switch
              id="usuario-padrao"
              checked={configLocal.usuarioPadrao}
              onCheckedChange={(checked) => setConfigLocal({ ...configLocal, usuarioPadrao: checked })}
            />
          </div>
          {Premium ? 
          (
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Usuario Premium
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Data de expiração  - { data.toLocaleDateString('pt-BR') }
              </Label>
            </div>
          ) :
          (
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <ShieldX className="h-4 w-4 text-red-500 " />
                Assine o Premium
              </Label>
            </div>
          )}
        
          
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSalvar} className="flex-1">
            Salvar
          </Button>
            {!Premium && (
            <Button 
              onClick={enviarDadosPremiumWhatsApp} variant="outline"          
            >
              Torne-se Membro
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
