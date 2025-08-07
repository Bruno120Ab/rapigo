import { useEffect } from "react";

export const enviarNotificacao = async () => {
   useEffect(() => {
    // Pede permissão ao carregar a página (ou você pode fazer em outro lugar)
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Só agenda a notificação se permissão concedida
    if (Notification.permission === "granted") {
      const timeoutId = setTimeout(async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          registration.showNotification("👋 Bem-vindo!", {
            body: "Conheça nossos serviços e ofertas exclusivas!",
            icon: "/pwa-192x192.png",
            tag: "welcome",
            data: { url: "/download" }, // URL para abrir no clique
          });
        }
      }, 30000); // 30 segundos

      return () => clearTimeout(timeoutId);
    }
  }, []);

  return null;
}
