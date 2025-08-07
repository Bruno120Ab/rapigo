export const enviarNotificacao = async () => {
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    alert('Permissão negada')
    return
  }

  setTimeout(async () => {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      registration.showNotification('❗ Motoboy aceitou a viagem ?!', {
        body: 'Clique aqui para ver os motoboys disponíveis.',
        icon: '/pwa-192x192.png',
        tag: 'motoboy-aceitou',
      })
    }
  }, 120000) // 2 minutos = 120000 ms
}
