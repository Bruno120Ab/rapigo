import { useState } from "react";
import { Settings, User, Moon, Sun, Type, UserCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConfiguracoes, Configuracao } from "@/hooks/useConfiguracoes";

interface ConfiguracoesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfiguracoesModal = ({ isOpen, onClose }: ConfiguracoesModalProps) => {
  const { configuracao, salvarConfiguracao } = useConfiguracoes();
  const [configLocal, setConfigLocal] = useState<Configuracao>(configuracao);

  const handleSalvar = () => {
    salvarConfiguracao(configLocal);
    onClose();
  };

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
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSalvar} className="flex-1">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};