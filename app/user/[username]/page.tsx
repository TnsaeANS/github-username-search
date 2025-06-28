import axios from 'axios';
import Link from 'next/link';

type GithubUser = {
  login: string;
  name?: string;
  avatar_url: string;
  bio?: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  created_at: string;
  location?: string;
  company?: string;
  blog?: string;
  twitter_username?: string;
};

type GithubRepo = {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
  language: string | null;
};

export default async function UserProfile({
  params,
}: {
  params: { username: string };
}) {
  try {
    // Fetch user data
    const userResponse = await axios.get(`https://api.github.com/users/${params.username}`);
    const user: GithubUser = userResponse.data;

    // Fetch user repositories (sorted by most recently updated)
    const reposResponse = await axios.get(
      `https://api.github.com/users/${params.username}/repos?sort=updated&per_page=10`
    );
    const repos: GithubRepo[] = reposResponse.data;

    // Calculate account age
    const accountAge = Math.floor(
      (new Date().getTime() - new Date(user.created_at).getTime()) / 
      (1000 * 60 * 60 * 24 * 365)
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back button */}
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Search
          </Link>

          {/* User Profile Header */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="md:flex">
              <div className="md:flex-shrink-0 p-6">
                <img 
                  src={user.avatar_url} 
                  alt={user.login} 
                  className="h-48 w-48 rounded-full border-4 border-blue-100 object-cover"
                />
              </div>
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">
                  GitHub Profile
                </div>
                <h1 className="block mt-1 text-2xl font-bold text-gray-900">
                  {user.name || user.login}
                </h1>
                <p className="mt-2 text-gray-600">{user.bio || 'No bio available'}</p>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">{user.login}</p>
                  </div>
                  {user.location && (
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{user.location}</p>
                    </div>
                  )}
                  {user.company && (
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{user.company}</p>
                    </div>
                  )}
                  {user.blog && (
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a 
                        href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-500 hover:underline"
                      >
                        {user.blog}
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Member for</p>
                    <p className="font-medium">{accountAge} year{accountAge !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="mt-6 flex space-x-6">
                  <a 
                    href={user.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View on GitHub
                  </a>
                  {user.twitter_username && (
                    <a 
                      href={`https://twitter.com/${user.twitter_username}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="h-5 w-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow px-6 py-4 border-l-4 border-blue-500">
              <h3 className="text-sm font-medium text-gray-500">Public Repositories</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{user.public_repos}</p>
            </div>
            <div className="bg-white rounded-lg shadow px-6 py-4 border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-500">Followers</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{user.followers}</p>
            </div>
            <div className="bg-white rounded-lg shadow px-6 py-4 border-l-4 border-purple-500">
              <h3 className="text-sm font-medium text-gray-500">Following</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{user.following}</p>
            </div>
          </div>

          {/* Repositories Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Recent Repositories</h2>
              <p className="text-sm text-gray-500 mt-1">Showing {repos.length} most recently updated repositories</p>
            </div>
            <ul className="divide-y divide-gray-200">
              {repos.map((repo) => (
                <li key={repo.id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <a 
                        href={repo.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-lg font-medium text-blue-600 hover:underline truncate"
                      >
                        {repo.name}
                      </a>
                      {repo.description && (
                        <p className="text-sm text-gray-500 mt-1">{repo.description}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-3">
                        {repo.language && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {repo.language}
                          </span>
                        )}
                        <span className="inline-flex items-center text-sm text-gray-500">
                          Updated {new Date(repo.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-4">
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        {repo.stargazers_count}
                      </span>
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.5 3A2.5 2.5 0 003 5.5v9A2.5 2.5 0 005.5 17h4.086a1.5 1.5 0 001.06-.44l3.915-3.914A1.5 1.5 0 0015 11.586V5.5A2.5 2.5 0 0012.5 3h-7zM5 5.5a.5.5 0 01.5-.5h7a.5.5 0 01.5.5v6a.5.5 0 01-.146.354l-3.915 3.915a.5.5 0 01-.353.146H5.5a.5.5 0 01-.5-.5v-9z" clipRule="evenodd" />
                        </svg>
                        {repo.forks_count}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h2>
          <p className="text-gray-600 mb-6">The GitHub user "{params.username}" doesn't exist or can't be accessed.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }
}