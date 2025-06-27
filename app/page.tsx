'use client';

import { useState } from 'react';
import axios from 'axios';


export default function Home() {
  const [username, setUsername] = useState('');
  type GithubUser = {
    login: string;
    name?: string;
    avatar_url: string;
    bio?: string;
  };

  const [user, setUser] = useState<GithubUser | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    try {
      const res = await axios.get(`https://api.github.com/users/${username}`);
      setUser(res.data);
      setError('');
    } catch (err) {
      setUser(null);
      setError('User not found');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">GitHub User Finder</h1>
      
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username"
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {user && (
        <div className="max-w-md mx-auto bg-white p-4 rounded shadow">
          <div className="flex items-center gap-4">
            <img 
              src={user.avatar_url} 
              alt={user.login} 
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">{user.name || user.login}</h2>
              <p className="text-gray-600">{user.bio || 'No bio available'}</p>
              <a 
                href={`/user/${user.login}`} 
                className="text-blue-500 hover:underline"
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