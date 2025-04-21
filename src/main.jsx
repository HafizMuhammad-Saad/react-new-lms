import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';


import { BrowserRouter, Routes, Route } from 'react-router'
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './routes/PrivateRoutes';
import Signup from './pages/Signup.jsx' 
import Dashboard from './pages/Dashboard.jsx'
import LoanRequests from './pages/LoanRequests.jsx'
import CreateLoan from './pages/CreateLoan.jsx'
import Profile from './pages/Profile.jsx';
import Layout from './components/Layout.jsx';
import LoanDetail from './pages/LoanDetail.jsx';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/signup' element={<Signup />} />
        <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/loanrequests' element={<LoanRequests />} />
          <Route path='/createloan' element={<CreateLoan />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/loanrequests/:id' element={<LoanDetail />} />
        </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
