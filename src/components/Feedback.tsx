// components/FeedbackModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { enviarFeedbackParaGoogleForms } from "@/hooks/use-feedback";

type FeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnviar = async () => {
    if (!mensagem.trim()) {
      toast({
        title: "Mensagem obrigatória",
        description: "Escreva seu feedback antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    await enviarFeedbackParaGoogleForms({ nome, feedback: mensagem });

    toast({
      title: "Obrigado pelo seu feedback!",
      description: "Sua mensagem foi registrada com sucesso.",
    });

    setNome("");
    setMensagem("");
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Feedback</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Seu nome (opcional)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Textarea
            placeholder="Escreva seu feedback aqui..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            rows={4}
          />
          <Button onClick={handleEnviar} disabled={loading} className="w-full">
            {loading ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
