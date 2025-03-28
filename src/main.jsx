import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import { CargaMasiva } from './pages/cargaMasiva.jsx'
// import { Cargos } from './components/Cargos.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CargaMasiva />
  </StrictMode>,
)
