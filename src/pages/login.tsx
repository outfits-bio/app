'use client';

import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

const LoginPage = () => {
  const { push } = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    const data = await signIn('credentials', { redirect: false, email, password });

    if (data?.error) {
      alert(data.error);
    } else {
      push('/settings');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <form className="bg-white rounded px-8 py-10 mb-4 max-w-sm w-full" onSubmit={handleSubmit}>
        <div className="flex items-center mb-6">
          <img src="https://outfits.bio/favicon.png" alt="Outfits Bio" className="w-8 h-8 mr-2" />
          <h2 className="text-2xl font-semibold text-black font-prompt">Login</h2>
        </div>

        <div className="mb-4">
          <label className="text-lg font-medium text-black font-prompt" htmlFor="email">
            Email:
          </label>
          <input
            className="w-full h-12 px-4 rounded-md border border-gray-300 mt-2 text-black font-medium font-prompt"
            id="email"
            type="email"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="text-lg font-medium text-black font-prompt" htmlFor="password">
            Password:
          </label>
          <input
            className="w-full h-12 px-4 rounded-md border border-gray-300 mt-2 text-black font-medium font-prompt"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          className="w-full h-12 bg-gray-700 hover:bg-gray-900 text-white font-semibold rounded-md mt-4"
          type="submit"
        >
          Log In
        </button>

        <p className="text-sm text-gray-600 mt-4">
          Don't have an account? <a href="/register" className="text-blue-500">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;