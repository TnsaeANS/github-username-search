import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";


type PageProps = {
  params: Promise<{ username: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};


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

export async function generateStaticParams() {
  return [] as { username: string }[];
}



export default async function UserProfile({ params }: PageProps) {
  const { username } = await params;
  try {
    const userResponse = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    const user: GithubUser = userResponse.data;

    // Fetch user repositories
    const reposResponse = await axios.get(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    const repos: GithubRepo[] = reposResponse.data;

    // Calculate account age
    const accountAge = Math.floor(
      (new Date().getTime() - new Date(user.created_at).getTime()) /
        (1000 * 60 * 60 * 24 * 365)
    );

    return (
      <div className="min-h-screen bg-black-400 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center text-fuchsia-300 hover:text-white mb-6 transition group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Search
          </Link>

          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/10 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <Image
                  src={user.avatar_url}
                  alt={user.login}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full border-4 border-fuchsia-400"
                  unoptimized
                  priority
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-fuchsia-300">
                  {user.name || user.login}
                </h1>
                <p className="mt-2 text-gray-300">
                  {user.bio || "No bio available"}
                </p>

                {/* User Stats Grid */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Username</p>
                    <p className="font-medium">{user.login}</p>
                  </div>
                  {user.location && (
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="font-medium">{user.location}</p>
                    </div>
                  )}
                  {user.company && (
                    <div>
                      <p className="text-sm text-gray-400">Company</p>
                      <p className="font-medium">{user.company}</p>
                    </div>
                  )}
                  {user.blog && (
                    <div>
                      <p className="text-sm text-gray-400">Website</p>
                      <a
                        href={
                          user.blog.startsWith("http")
                            ? user.blog
                            : `https://${user.blog}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-fuchsia-300 hover:underline"
                      >
                        {user.blog}
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-400">Member for</p>
                    <p className="font-medium">
                      {accountAge} year{accountAge !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
                  >
                    View on GitHub
                  </a>
                  {user.twitter_username && (
                    <a
                      href={`https://twitter.com/${user.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition"
                    >
                      <svg
                        className="h-5 w-5 text-blue-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
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
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-sm font-medium text-gray-400">
                Public Repositories
              </h3>
              <p className="mt-1 text-3xl font-bold text-fuchsia-300">
                {user.public_repos}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-sm font-medium text-gray-400">Followers</h3>
              <p className="mt-1 text-3xl font-bold text-fuchsia-300">
                {user.followers}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-sm font-medium text-gray-400">Following</h3>
              <p className="mt-1 text-3xl font-bold text-fuchsia-300">
                {user.following}
              </p>
            </div>
          </div>

          {/* Repositories Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-2xl font-bold text-fuchsia-300">
                Recent Repositories
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Showing {repos.length} most recently updated repositories
              </p>
            </div>
            <ul className="divide-y divide-white/10">
              {repos.map((repo) => (
                <li
                  key={repo.id}
                  className="px-6 py-4 hover:bg-white/10 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-bold text-fuchsia-300 hover:underline truncate"
                      >
                        {repo.name}
                      </a>
                      {repo.description && (
                        <p className="text-gray-300 mt-1">{repo.description}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-3 items-center">
                        {repo.language && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-fuchsia-400/10 text-fuchsia-300">
                            {repo.language}
                          </span>
                        )}
                        <span className="text-sm text-gray-400">
                          Updated{" "}
                          {new Date(repo.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="inline-flex items-center text-gray-300">
                        <svg
                          className="h-4 w-4 mr-1 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM10 15a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {repo.stargazers_count}
                      </span>
                      <span className="inline-flex items-center text-gray-300">
                        <svg
                          className="h-4 w-4 mr-1 text-blue-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
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
  } catch (_error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B0535] via-[#2D0A4A] to-[#120218]">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/10 text-center">
          <h2 className="text-2xl font-bold text-fuchsia-300 mb-4">
            User Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {`The GitHub user "${username}" does not exist or cannot be accessed.`}
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }
}
