import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration.ts'

const root = createRoot(document.getElementById("root")!)
root.render(<App />)

// Registra o service worker para ativar o PWA
serviceWorkerRegistration.register()
