import { StrictMode } from 'react'
import { ConfigProvider } from './context/configContext.jsx'
import { FirebaseProvider } from './context/firebaseContext.jsx'
import { createRoot } from 'react-dom/client'
import '@/style/index.css'
import App from './routes/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FirebaseProvider>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </FirebaseProvider>
  </StrictMode>,
)
