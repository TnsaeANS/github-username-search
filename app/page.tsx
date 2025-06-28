'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

type GithubUser = {
  login: string;
  name?: string;
  avatar_url: string;
  bio?: string;
  public_repos: number;
};

export default function Home() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<GithubUser | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username.trim()) return setError("Please enter a username");
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.github.com/users/${username}`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
      setUser(data);
      setError("");
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError("GitHub API returned 403. Please try again later.");
      } else {
        setError("User not found");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 font-sans text-white">
      <div className="w-full max-w-xl mx-auto space-y-12">
        <h1 className="text-center text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-gray-400 to-white tracking-tight select-none break-words">
          GitHub User Finder
        </h1>

        <form onSubmit={handleSearch} className="relative shadow-xl">
          <input
            autoFocus
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Search a GitHub Username"
            required
            className="w-full py-4 pl-6 pr-16 text-white rounded-full bg-white/10 backdrop-blur-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 grid place-items-center shadow-lg hover:scale-105 transition-transform disabled:opacity-60"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M22 12a10 10 0 01-10 10" />
              </svg>
            ) : (
              <MagnifyingGlassIcon className="h-6 w-6 text-white" />
            )}
          </button>
        </form>

        {error && <p className="text-center text-red-400 font-medium">{error}</p>}

        {user && (
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/10 flex gap-6 animate-fade-in">
            <img src={user.avatar_url} alt={user.login} className="w-24 h-24 rounded-full border-4 border-fuchsia-400" />
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-fuchsia-300">{user.name || user.login}</h2>
              <p className="text-gray-300 max-w-prose">{user.bio || "No bio available"}</p>
              <p className="text-gray-400 text-sm">{user.public_repos} public repositories</p>
              <Link 
                href={`/user/${user.login}`} 
                className="inline-flex items-center text-fuchsia-300 hover:text-white transition-colors"
                onClick={() => setNavigating(true)}
              >
                {navigating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M22 12a10 10 0 01-10 10" />
                    </svg>
                    Loading Profile...
                  </>
                ) : (
                  <>
                    View Full Profile
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}