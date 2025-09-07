const { Octokit } = require('@octokit/rest');
const NodeCache = require('node-cache');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

class GitHubService {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    
    // Cache for 10 minutes (600 seconds)
    this.cache = new NodeCache({ stdTTL: 600 });
    // Use a writable directory in serverless environments
    this.cacheDir = process.env.CACHE_DIR || path.join(os.tmpdir(), 'grdt-cache');

    // Ensure cache directory exists (best-effort on serverless)
    try {
      fs.ensureDirSync(this.cacheDir);
    } catch (err) {
      // Read-only filesystem fallback: disable disk cache
      this.cacheDir = null;
    }
  }

  async getUserData(username, type) {
    const cacheKey = `${username}-${type}`;
    
    // Try to get from memory cache first
    let cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Try to get from file cache
    try {
      const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
      if (await fs.pathExists(cacheFile)) {
        const fileStats = await fs.stat(cacheFile);
        const now = new Date();
        const fileAge = (now - fileStats.mtime) / 1000; // age in seconds
        
        if (fileAge < 600) { // 10 minutes
          cachedData = await fs.readJson(cacheFile);
          this.cache.set(cacheKey, cachedData);
          return cachedData;
        }
      }
    } catch (error) {
      console.warn(`Error reading cache file for ${cacheKey}:`, error.message);
    }

    // Fetch fresh data from GitHub API
    try {
      let data;
      
      switch (type) {
        case 'commit':
          data = await this.getLatestCommit(username);
          break;
        case 'stars':
          data = await this.getStarCount(username);
          break;
        case 'followers':
          data = await this.getFollowerCount(username);
          break;
        case 'forks':
          data = await this.getForkCount(username);
          break;
        case 'repos':
          data = await this.getRepoCount(username);
          break;
        default:
          throw new Error(`Unsupported data type: ${type}`);
      }

      // Cache the data
      this.cache.set(cacheKey, data);
      
      // Save to file cache
      if (this.cacheDir) {
        try {
          const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
          await fs.writeJson(cacheFile, data);
        } catch (error) {
          console.warn(`Error writing cache file for ${cacheKey}:`, error.message);
        }
      }

      return data;
    } catch (error) {
      console.error(`Error fetching GitHub data for ${username}:`, error.message);
      throw new Error(`Failed to fetch ${type} data for user ${username}`);
    }
  }

  async getLatestCommit(username) {
    // Get user's repositories
    const { data: repos } = await this.octokit.rest.repos.listForUser({
      username,
      sort: 'pushed',
      per_page: 10
    });

    if (repos.length === 0) {
      return { text: 'No repositories found', timestamp: new Date().toISOString() };
    }

    // Get latest commit from the most recently pushed repo
    const latestRepo = repos[0];
    
    try {
      const { data: commits } = await this.octokit.rest.repos.listCommits({
        owner: username,
        repo: latestRepo.name,
        per_page: 1
      });

      if (commits.length > 0) {
        const commit = commits[0];
        return {
          text: `Latest commit: ${commit.commit.message}`,
          repo: latestRepo.name,
          timestamp: commit.commit.author.date,
          sha: commit.sha.substring(0, 7)
        };
      }
    } catch (error) {
      console.warn(`Error fetching commits for ${latestRepo.name}:`, error.message);
    }

    return { text: 'No commits found', timestamp: new Date().toISOString() };
  }

  async getStarCount(username) {
    const { data: user } = await this.octokit.rest.users.getByUsername({
      username
    });

    // Get total stars across all repositories
    const { data: repos } = await this.octokit.rest.repos.listForUser({
      username,
      per_page: 100
    });

    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    return {
      text: `Total Stars: ${totalStars.toLocaleString()}`,
      count: totalStars,
      timestamp: new Date().toISOString()
    };
  }

  async getFollowerCount(username) {
    const { data: user } = await this.octokit.rest.users.getByUsername({
      username
    });

    return {
      text: `Followers: ${user.followers.toLocaleString()}`,
      count: user.followers,
      timestamp: new Date().toISOString()
    };
  }

  async getForkCount(username) {
    const { data: repos } = await this.octokit.rest.repos.listForUser({
      username,
      per_page: 100
    });

    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

    return {
      text: `Total Forks: ${totalForks.toLocaleString()}`,
      count: totalForks,
      timestamp: new Date().toISOString()
    };
  }

  async getRepoCount(username) {
    const { data: user } = await this.octokit.rest.users.getByUsername({
      username
    });

    return {
      text: `Public Repos: ${user.public_repos.toLocaleString()}`,
      count: user.public_repos,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new GitHubService();

