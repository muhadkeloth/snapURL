import {  BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast'

const ProtectedRoute = ({children}:{children:ReactNode}) => {
  const accessToken = localStorage.getItem('accessToken');  
  return !accessToken ? <Navigate to='/login' replace /> : <>{children}</>
}

const AuthRoute = ({children}:{children:ReactNode}) => {
  const accessToken = localStorage.getItem('accessToken');
   return accessToken ? <Navigate to='/' replace /> : <>{children}</>
}

function App() {
  return (
<Router>
      <Toaster position="top-right" />
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/login" element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } />
          <Route path="/register" element={
             <AuthRoute>
             <Register />
           </AuthRoute>
          } />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Header />
                <Home />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
