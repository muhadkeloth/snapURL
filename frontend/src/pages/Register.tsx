

import { Link2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { getOTP, register, validateOTP } from '../services/apiCall';
import { emailValidation, getErrorMessage, passwordValidation } from '../utils/functions';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error,setError] = useState<Record<string,string> | null>(null)
  const [isLoading, setIsLoading] = useState(false);
  const [verified, setVerified] = useState(false)
  const [isLoadingotp, setIsLoadingotp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0); 
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    setError(null)
    try {
      const trimedname = name.trim();
      if(trimedname.length < 4 ) {
        setError((prev) => ({ ...prev, nameError: "name required with min four character", }));
        return
      }
      const trimedemail = email.trim();
      if(trimedemail.length === 0 || !emailValidation(trimedemail)) {
        setError((prev) => ({ ...prev, emailError: "Email Address Required", }));
        return
      }
      setIsLoadingotp(true)
      const response = await getOTP(trimedemail);
      if(response){
        setOtpSent(true)
        setIsResendDisabled(true)
        setTimer(120);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(`Failed to send OTP: ${errorMessage} `);
    }finally{
      setIsLoadingotp(false)
    }

  }

  const handleValidatedOtp = async () => {
    try {
      const trimedemail = email.trim();
      if(trimedemail.length === 0 || !emailValidation(trimedemail)) {
        setError((prev) => ({ ...prev, emailError: "Entered Invalid Email Address", }));
        return
      }
      if(verificationCode.length !== 6) {
        setError((prev) => ({ ...prev, verification: "Entered Invalid otp", }));
        return
      }
      setIsLoadingotp(true)
      const response = await validateOTP({email:trimedemail,otp:verificationCode});

      if(response){
        toast.success('otp verified')
        setVerified(true)
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(`Failed to validate OTP: ${errorMessage} `);
    }finally{
      setIsLoadingotp(false)
    }

  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const trimedemail = email.trim();
      if(trimedemail.length === 0 || !emailValidation(trimedemail)) {
        setError((prev) => ({ ...prev, emailError: "Entered Invalid Email Address", }));
        return
      }
      const trimedname = name.trim();
      if(trimedname.length < 4 ) {
        setError((prev) => ({ ...prev, nameError: "name must four character", }));
        return
      }
      const passvalidate = passwordValidation(password)
      if(passvalidate) {
        setError((prev) => ({ ...prev, passwordError: passvalidate as string, }));
        return
      }
      setIsLoading(true)
      const response = await register({
        email:trimedemail,
        name:trimedname,
        password
      })
      if(response && response.data.accessToken){
        localStorage.setItem("accessToken", response.data.accessToken);
        navigate('/');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(`Failed to register new user: ${errorMessage} `);
    }finally{
      setIsLoading(false)
    }
  };


  useEffect(() => {
    if (timer > 0) {
        const timer = setInterval(() => { setTimer((prev) => prev - 1); }, 1000);
        return () => clearInterval(timer); 
      } else {
        setIsResendDisabled(false); 
      }
    }, [timer]);


  return (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-md">
    <div className="flex justify-center">
      <Link2 className="h-12 w-12 text-blue-600" />
    </div>
    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Create your account
    </h2>
  </div>

  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                 <span className="block text-red-600 font-light opacity-80 text-end pe-2">
              {error?.nameError}
            </span>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
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
              <div className="flex ">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
                 <span className="block text-red font-light opacity-80 text-end pe-2">
              {error?.passwordError}
            </span>
            </div>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="code"
                name="code"
                type="text"
                required
                maxLength={6}
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setVerificationCode(value)}
                } 
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  return otpSent ? handleValidatedOtp() : handleSendOtp();
                }}
                disabled={isLoadingotp || isLoading || verified }
                className="min-w-[120px] sm:min-w-[150px] px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {verified ? 'Verified' : (
                  otpSent ? (
                    isLoadingotp ? 'Validating...' : 'Validate OTP'                  
                  ) : (
                    isLoadingotp ? 'Sending...' : 'Send OTP'
                  )
                )}
              </button>
            </div>

            {!verified && otpSent && (
                    <div className="mt-1 text-sm text-gray-600">
                      {isResendDisabled ? (
                        `Resend OTP in ${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-blue-600 hover:text-blue-500"
                        >
                          Resend OTP
                        </button>
                      )}
                       </div>
                  )}
            {error?.verification && (
              <p className="mt-2 text-sm text-red-600">{error.verification}</p>
            )}
            </div>
  
          <div>
          <button
            type="submit"
            disabled={!verified}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading. . .' : 'Register'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
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

export default Register