import { Link2 } from 'lucide-react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { emailValidation, getErrorMessage } from '../utils/functions';
import { login } from '../services/apiCall';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isloading, setIsLoading] = useState(false);
  const [error,setError] = useState<Record<string,string> | null>(null)

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const trimedemail = email.trim();
    if(trimedemail.length === 0 || !emailValidation(trimedemail)) {
      setError((prev) => ({ ...prev, emailError: "Email Address Required", }));
      return
    }
    if(password.length === 0) {
      setError((prev) => ({ ...prev, passwordError: "Password is Required", }));
      return
    }

    try {
      setIsLoading(true);
      const response = await login({email:trimedemail, password});
      if(response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        window.location.href = '/';
      }else {
        toast.error(`Failed to login. try again `);
        }
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(`Failed to login: ${errorMessage} `);
    }finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex justify-center">
        <Link2 className="h-12 w-12 text-blue-600" />
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
    </div>

    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="block text-red-600 font-light opacity-80 text-end pe-2">
              {error?.emailError}
            </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="block text-red-600 font-light opacity-80 text-end pe-2">
              {error?.passwordError}
            </span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isloading ? 'Loading...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Register
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Login