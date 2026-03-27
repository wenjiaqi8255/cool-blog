interface CommitStats {
  count: number;
  fetchedAt: number;
}

const cache = new Map<string, CommitStats>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Fetch weekly commit count from GitHub API with caching.
 * Uses the stats/commit_activity endpoint for pre-aggregated weekly data.
 *
 * @param repo - Repository in format "owner/repo"
 * @returns Promise<number> - Last week's commit count
 */
export async function getWeeklyCommits(repo: string): Promise<number> {
  // Check cache first
  const cached = cache.get(repo);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.count;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/stats/commit_activity`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Cool-Blog-App'
        }
      }
    );

    if (!response.ok) {
      // Return cached value or 0 on error
      return cached?.count ?? 0;
    }

    const data = await response.json();

    // Get last week's commits (last entry in array)
    // The API returns an array of weekly commit data
    const lastWeekCommits = Array.isArray(data) && data.length > 0
      ? data[data.length - 1]?.total ?? 0
      : 0;

    // Update cache
    cache.set(repo, {
      count: lastWeekCommits,
      fetchedAt: Date.now()
    });

    return lastWeekCommits;
  } catch {
    return cached?.count ?? 0;
  }
}

/**
 * Clear the cache (useful for testing)
 */
export function clearCache(): void {
  cache.clear();
}
