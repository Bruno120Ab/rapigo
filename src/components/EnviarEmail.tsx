import { Button } from "./ui/button";

export default function EnviarEmail() {
  const destinatario = "seuemail@exemplo.com";
  const assunto = encodeURIComponent("Contato via App");
  const corpo = encodeURIComponent("Olá, gostaria de falar com você...");

  const handleClick = () => {
    window.location.href = `mailto:${destinatario}?subject=${assunto}&body=${corpo}`;
  };

  return (
    <Button onClick={handleClick}  variant="outline">
      Entrar em contato
    </Button>
  );
}  
                