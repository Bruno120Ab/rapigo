import { Mail, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export default function EnviarEmail() {
 const destinatario = "brunoabreudevs@gmail.com";
  const assunto = encodeURIComponent("Contato via App");
  const corpo = encodeURIComponent("Olá, gostaria de falar com você sobre o app");

  const handleEmailClick = () => {
    window.location.href = `mailto:${destinatario}?subject=${assunto}&body=${corpo}`;
  };

  const handleFeedbackClick = () => {
    alert("Obrigado pelo seu feedback!");
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
      {/* Botão de contato */}
      <Button
        onClick={handleEmailClick}
        variant="outline"
        className="flex items-center gap-2 px-4 py-2 rounded-full border-gray-300 hover:bg-gray-100 transition-colors"
      >
        <Mail className="w-4 h-4 text-orange-500" />
        Enviar feeback
      </Button>

    
    </div>
  );
};        