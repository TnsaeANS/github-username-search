'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<null | {
    login: string;
    name?: string;
    avatar_url: string;
    bio?: string;
  }>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim()) return setError('Please enter a username');

    try {
      const { data } = await axios.get(`https://api.github.com/users/${username}`);
      setUser(data);
      setError('');
    } catch {
      setUser(null);
      setError('User not found');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-6 py-10 font-sans">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-8 text-center">💙 GitHub User Finder</h1>

      <form 
        onSubmit={handleSearch}
        className="w-full max-w-md flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="flex-1 px-4 py-2 border border-blue-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition font-medium shadow"
        >
          Search
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {user && (
        <div className="mt-8 w-full max-w-md bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center gap-5">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-20 h-20 rounded-full border-4 border-blue-200"
            />
            <div>
              <h2 className="text-xl font-semibold text-blue-700">{user.name || user.login}</h2>
              <p className="text-gray-600">{user.bio || 'No bio available'}</p>
              <a
                href={`https://github.com/${user.login}`}
                target="_blank"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                View Profile →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
