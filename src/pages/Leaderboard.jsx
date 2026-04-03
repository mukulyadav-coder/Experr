import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const medalClass = (rank) => {
  if (rank === 1) return 'bg-yellow-100 text-yellow-800';
  if (rank === 2) return 'bg-slate-100 text-slate-800';
  if (rank === 3) return 'bg-amber-100 text-amber-800';
  return 'bg-white dark:bg-dark-800';
};

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          throw new Error(authError?.message || 'Unable to identify user.');
        }
        setCurrentUserId(authData.user.id);

        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, name, avatar_url, coins')
          .order('coins', { ascending: false })
          .limit(50);

        if (profileError) {
          throw profileError;
        }

        const { data: submissions, error: submissionError } = await supabase
          .from('submissions')
          .select('user_id');

        if (submissionError) {
          throw submissionError;
        }

        const submissionCount = submissions.reduce((acc, row) => {
          acc[row.user_id] = (acc[row.user_id] || 0) + 1;
          return acc;
        }, {});

        const merged = (profiles || []).map((profile) => ({
          ...profile,
          submissions_count: submissionCount[profile.id] || 0,
        }));

        merged.sort((a, b) => (b.coins || 0) - (a.coins || 0));

        setUsers(merged.slice(0, 50));
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
        setError(err.message || 'Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-experr-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-300">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-2xl w-full rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-700 dark:bg-red-900/30">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Top contributors by coins and submissions</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-dark-700 shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-white dark:bg-dark-900">
            <tr className="border-b border-gray-200 dark:border-dark-700">
              <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Rank</th>
              <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Profile</th>
              <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Name</th>
              <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Coins</th>
              <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Submissions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-950">
            {users.map((user, index) => {
              const rank = index + 1;
              const isCurrent = user.id === currentUserId;
              return (
                <tr
                  key={user.id}
                  className={`border-b border-gray-200 dark:border-dark-700 ${isCurrent ? 'bg-experr-50 dark:bg-experr-900/40' : 'hover:bg-gray-50 dark:hover:bg-dark-800'} ${medalClass(rank)}`}
                >
                  <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">{rank}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                        className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-dark-700"
                        onError={(e) => {
                          e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder';
                        }}
                      />
                      {rank <= 3 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: rank === 1 ? '#d4af37' : rank === 2 ? '#c0c0c0' : '#cd7f32' }}>
                          {rank === 1 ? 'Gold' : rank === 2 ? 'Silver' : 'Bronze'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{user.name}{isCurrent && ' (You)'}</td>
                  <td className="px-4 py-3 font-semibold text-experr-600 dark:text-experr-400">{user.coins ?? 0}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.submissions_count ?? 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">Top {users.length} users shown (max 50)</div>
    </div>
  );
};

export default Leaderboard;
