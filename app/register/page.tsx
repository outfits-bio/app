'use client';

import '../globals.css';
import { useState } from 'react';

const RegisterPage = () => {
  const [displayName, setDisplayName] = useState('Jeremy');
  const [username, setUsername] = useState('jecta');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <form className="bg-white rounded px-8 py-10 mb-4 max-w-sm w-full" onSubmit={handleSubmit}>
        <div className="flex items-center mb-6">
          <img src="https://outfits.bio/favicon.png" alt="Outfits Bio" className="w-8 h-8 mr-2" />
          <h2 className="text-2xl font-semibold text-black font-prompt">Register</h2>
        </div>

        <div className="mb-4">
          <label className="text-lg font-medium text-black font-prompt" htmlFor="displayName">
            Display Name:
          </label>
          <input
            className="w-full h-12 px-4 rounded-md border border-gray-300 mt-2 text-black font-medium font-prompt"
            id="displayName"
            type="text"
            placeholder="Jeremy"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-lg font-medium text-black font-prompt" htmlFor="username">
            Username:
          </label>
          <input
            className="w-full h-12 px-4 rounded-md border border-gray-300 mt-2 text-black font-medium font-prompt"
            id="username"
            type="text"
            placeholder="jecta"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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

        <div className="mb-4">
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

        <input
          className="w-full h-12 px-4 rounded-md border border-gray-300 mt-2 text-black font-medium font-prompt"
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          className="w-full h-12 bg-gray-700 hover:bg-gray-900 text-white font-semibold rounded-md mt-4"
          type="submit"
        >
          Sign Up
        </button>

        <p className="text-sm text-gray-600 mt-4">
          Already have an account? <a href="/login" className="text-blue-500">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
