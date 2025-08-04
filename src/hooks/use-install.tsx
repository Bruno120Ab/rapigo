import { useEffect, useState } from "react";

export function InstallPWA() {
  const [promptEvent, setPromptEvent] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      setPromptEvent(e);
      setIsVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onClick = () => {
    if (!promptEvent) return;
    // @ts-ignore
    promptEvent.prompt();
    // @ts-ignore
    promptEvent.userChoice.then(() => {
      setIsVisible(false);
      setPromptEvent(null);
    });
  };

  if (!isVisible) return null;

  return (
    <button onClick={onClick} style={{ padding: "10px 20px", fontSize: 16 }}>
      📲 Instalar App
    </button>
  );
}
