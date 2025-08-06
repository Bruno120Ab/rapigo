import { useState } from "react";
import { Star, MessageSquare, Check, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Solicitacao } from "@/types/mototaxi";

interface AvaliacaoModalProps {
  viagem: Solicitacao | null;
  isOpen: boolean;
  onClose: () => void;
  onSalvarAvaliacao: (viagemId: string, avaliacao: { estrelas: number; aceita: boolean; feedback: string }) => void;
  avaliacaoExistente?: { estrelas: number; aceita: boolean; feedback: string } | null;
}

export const AvaliacaoModal = ({ 
  viagem, 
  isOpen, 
  onClose, 
  onSalvarAvaliacao,
  avaliacaoExistente 
}: AvaliacaoModalProps) => {
  const [estrelas, setEstrelas] = useState(avaliacaoExistente?.estrelas || 0);
  const [aceita, setAceita] = useState(avaliacaoExistente?.aceita || false);
  const [feedback, setFeedback] = useState(avaliacaoExistente?.feedback || "");

  if (!viagem) return null;

  const handleSalvar = () => {
    onSalvarAvaliacao(viagem.id, { estrelas, aceita, feedback });
    onClose();
  };

  const enviarFeedbackWhatsApp = () => {
    if (!viagem) return;

    // Pega o telefone do motoboy (assumindo que está no localStorage ou usar um telefone padrão)
    const dadosMototaxista = localStorage.getItem("mototaxista");
    let telefone = "71999099688"; // fallback

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
        console.error("Erro ao ler telefone do mototaxista", error);
      }
    }

    const estrelasTexto = "⭐".repeat(estrelas);
    const statusAceite = aceita ? "✅ Viagem aceita" : "❌ Viagem não aceita";
    
    let mensagem = `📝 *FEEDBACK DA VIAGEM*\n\n`;
    mensagem += `🚕 *Viagem:* ${viagem.endereco}`;
    if (viagem.destino) {
      mensagem += ` → ${viagem.destino}`;
    }
    mensagem += `\n⏰ *Data:* ${viagem.dataHora.toLocaleString('pt-BR')}\n`;
    mensagem += `⭐ *Avaliação:* ${estrelasTexto} (${estrelas}/5)\n`;
    mensagem += `📊 *Status:* ${statusAceite}\n`;
    if (feedback.trim()) {
      mensagem += `💬 *Comentário:* ${feedback}\n`;
    }
    mensagem += `\n*Obrigado pelo serviço! 🙏*`;

    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Avaliar Viagem
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações da viagem */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="font-medium">{viagem.endereco}</p>
            {viagem.destino && (
              <p className="text-sm text-muted-foreground">→ {viagem.destino}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {viagem.dataHora.toLocaleString('pt-BR')}
            </p>
          </div>

          {/* Avaliação por estrelas */}
          <div className="space-y-2">
            <Label>Avaliação</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setEstrelas(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= estrelas
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Switch para viagem aceita */}
          <div className="flex items-center justify-between">
            <Label htmlFor="aceita" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Viagem foi aceita?
            </Label>
            <Switch
              id="aceita"
              checked={aceita}
              onCheckedChange={setAceita}
            />
          </div>

          {/* Campo de feedback */}
          <div className="space-y-2">
            <Label htmlFor="feedback">Comentário (opcional)</Label>
            <Textarea
              id="feedback"
              placeholder="Conte como foi sua experiência..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />
          </div>

          {/* Botão WhatsApp */}
          <Button
            onClick={enviarFeedbackWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={estrelas === 0}
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar Feedback via WhatsApp
          </Button>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSalvar} disabled={estrelas === 0} className="flex-1">
            Salvar Avaliação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};