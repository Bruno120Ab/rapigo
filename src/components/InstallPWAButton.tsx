import React from 'react'
import usePWAInstall from '@/hooks/usePWAInstall'

export default function InstallPWAButton() {
  const { isInstallable, promptInstall } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <button
      onClick={promptInstall}
      className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition"
    >
      Instalar App
    </button>
  );
}
