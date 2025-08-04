import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleClick = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
      setShowButton(false);
    });
  };

  if (!showButton) return null;

  return (
    <Button onClick={handleClick} variant="outline" className="w-full">
      📱 Instalar App
    </Button>
  );
};
