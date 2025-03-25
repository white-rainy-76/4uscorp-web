import React from 'react'

export default function page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex justify-center mb-4">
          {/* Логотип */}
          <img src="/logo.png" alt="Logo" className="h-12 w-12" />
        </div>
        <h2 className="text-center text-2xl font-semibold mb-6">Welcome!</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Email or phone"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-sm text-indigo-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition">
            Log in
          </button>
        </form>
        <div className="flex items-center my-4">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-gray-500">Or</span>
          <hr className="w-full border-gray-300" />
        </div>
        <div className="flex space-x-2 mb-4">
          <button className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 rounded-md shadow-sm hover:bg-gray-100 transition">
            Google
          </button>
          <button className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 rounded-md shadow-sm hover:bg-gray-100 transition">
            Facebook
          </button>
          <button className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 rounded-md shadow-sm hover:bg-gray-100 transition">
            Apple
          </button>
        </div>
        <p className="text-center text-sm text-gray-500">
          Don`t have an account yet?
        </p>
        <button className="w-full mt-2 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
          Create Account
        </button>
      </div>
    </div>
  )
}
