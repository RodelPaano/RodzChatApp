import React from 'react'
import { login } from '../api/ApiRequest'
import { useState } from 'react'
import NavbarLandingPage from '../Components/NavbarLandingPageComponent'
// import { useNavigate } from 'react-router-dom'

function LoginPages() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email:', email)
    console.log('Password:', password)

    // Reset Form Fields
    setEmail('') 
    setPassword('')

    try {
      // Simulate API call for login
      const res = login(email, password);
      console.log('Login successful:', res);

      // localStorage.setItem('isLoggedIn', 'true'); // Set login status in localStorage

      alert('Login successful!');
      setEmail('');
      setPassword('');
      
      window.location.href = '/homepage'; // Redirect to homepage after successful login

    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials and try again.');
    }
  }


  return (
    // Section of the Login Page
    <div className='w-full h-screen flex  flex-col items-center justify-center  bg-gray-100'>

      {/* Navbar */}
      <NavbarLandingPage />

      {/* Login Form */}
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-4 text-center font-sans'>LogIn <span className="text-blue-600"> Page</span></h2>
        <form className='space-y-6' onSubmit={handleSubmit}>
          <div className='flex flex-col'>
            <label htmlFor='email' className='mb-1 text-gray-600'>Email</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              className='border border-gray-300 rounded-md p-2'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='password' className='mb-1 text-gray-600'>Password</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              className='border border-gray-300 rounded-md p-2'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type='submit' className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'>
            Log In
          </button>

          <p className='text-center text-gray-600'>
            Don't have an account?{' '}
            <a href='/register' className='text-blue-600 hover:underline'>
              Sign Up
            </a>
          </p>

          <h4 className="text-center text-gray-600">Or</h4><h4 className="text-center text-gray-600">Log In with <span className="text-blue-600">Google</span></h4>

          <button type='button' className='w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700'>Forgot Password</button>

        </form>
      </div>
    </div>
  )
}

export default LoginPages
