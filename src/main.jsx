import { StrictMode } from 'react'
import { ConfigProvider } from './context/configContext.jsx'
import { FirebaseProvider } from './context/firebaseContext.jsx'
import { createRoot } from 'react-dom/client'
import '@/style/index.css'
import App from './routes/App.jsx'
import { ConfigComponent } from './utils/Config.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigComponent>
      <FirebaseProvider>
        <ConfigProvider>
          <App />
        </ConfigProvider>
      </FirebaseProvider>
    </ConfigComponent>
  </StrictMode>,
)
