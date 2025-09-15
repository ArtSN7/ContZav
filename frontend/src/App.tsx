import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AUTH_ROUTE } from './CONSTANTS'
import { AuthPage } from './components/auth/auth'

function App() {
  return (
    <Router>
      <Routes>
          <Route path={"/"} element={<AuthPage />} />,
          <Route path={AUTH_ROUTE} element={<AuthPage />} />
      </Routes>
    </Router>
  )
}

export default App