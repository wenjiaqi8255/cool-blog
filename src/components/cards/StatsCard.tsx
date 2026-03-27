import { useEffect, useState } from 'react';
import { getWeeklyCommits } from '../../lib/github-api';

interface Props {
  repo: string;
  label?: string;
}

export default function StatsCard({ repo, label = 'Weekly Commits' }: Props) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    getWeeklyCommits(repo)
      .then((data) => {
        if (mounted) {
          setCount(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [repo]);

  return (
    <div className="stats-card">
      <div className="content">
        <p className="label">{label}</p>
        <p className="value">
          {loading ? (
            <span className="loading">...</span>
          ) : error ? (
            <span className="error">--</span>
          ) : (
            count
          )}
        </p>
        <p className="source">
          <span className="repo">{repo}</span>
        </p>
      </div>
    </div>
  );
}
