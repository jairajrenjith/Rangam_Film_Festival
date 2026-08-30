import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CursorFX from './components/CursorFX/CursorFX'

export default function App() {
  return (
    <BrowserRouter>
      <CursorFX />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}