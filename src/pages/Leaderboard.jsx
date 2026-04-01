import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';


export default function Leaderboard() {
	const [users, setUsers] = useState([]);
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchLeaderboard();
	}, []);

	async function fetchLeaderboard() {
		setLoading(true);
		setError(null);
		try {
			// Get current user
			const { data: { user } } = await supabase.auth.getUser();
			setCurrentUser(user);

			// Fetch all users from profiles table (id, name, coins, avatar_url)
			const { data: profiles, error: profilesError } = await supabase
				.from('profiles')
				.select('id, name, coins, avatar_url')
				.order('coins', { ascending: false })
				.limit(50);
			if (profilesError) throw profilesError;

			// Fetch submissions count for each user
			const userIds = profiles.map(u => u.id);
			const { data: submissions, error: submissionsError } = await supabase
				.from('submissions')
				.select('user_id');
			if (submissionsError) throw submissionsError;

			// Count submissions per user
			const submissionCounts = {};
			submissions.forEach(sub => {
				submissionCounts[sub.user_id] = (submissionCounts[sub.user_id] || 0) + 1;
			});

			// Combine data
			const leaderboard = profiles.map((profile, idx) => ({
				...profile,
				submissions_count: submissionCounts[profile.id] || 0,
				rank: idx + 1,
			}));
			setUsers(leaderboard);
		} catch (err) {
			setError('Failed to load leaderboard');
		} finally {
			setLoading(false);
		}
	}


	function getRankCircle(rank) {
		let bg = '', text = '', border = '', shadow = '';
		if (rank === 1) {
			bg = 'bg-yellow-400'; text = 'text-white'; border = 'border-4 border-purple-400'; shadow = 'shadow-yellow-300/60';
		} else if (rank === 2) {
			bg = 'bg-gray-400'; text = 'text-white'; border = ''; shadow = 'shadow-gray-400/40';
		} else if (rank === 3) {
			bg = 'bg-orange-400'; text = 'text-white'; border = ''; shadow = 'shadow-orange-400/40';
		} else {
			bg = 'bg-gray-200'; text = 'text-gray-700'; border = ''; shadow = '';
		}
		return (
			<div className={`flex items-center justify-center h-12 w-12 rounded-full text-xl font-bold ${bg} ${text} ${border} shadow-lg ${shadow}`}>{rank}</div>
		);
	}


	function getRowHighlight(rank, userId) {
		if (rank === 1) return 'border-4 border-purple-400';
		if (currentUser && userId === currentUser.id) return 'ring-2 ring-green-400';
		return '';
	}

	if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
	if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

	return (
		<div className="w-full flex flex-col items-center py-8">
			<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Leaderboard</h1>
			<div className="w-full flex flex-col items-center gap-6">
				{users.map((user, idx) => (
					<div
						key={user.id}
						className={`flex items-center justify-between px-8 py-4 rounded-2xl shadow-xl bg-gradient-to-r from-blue-200/70 via-white/60 to-cyan-100/80 backdrop-blur-md border border-transparent hover:scale-[1.025] transition-transform duration-200 ${getRowHighlight(user.rank, user.id)} ${user.rank === 1 ? 'relative z-10' : ''}`}
						style={{ width: '80%', minWidth: 320, maxWidth: 900 }}
					>
						<div className="flex items-center gap-5">
							{getRankCircle(user.rank)}
							<img
								className="h-14 w-14 rounded-full border-2 border-white shadow-md object-cover bg-white"
								src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || user.id}`}
								alt={user.name}
							/>
							<div>
								<div className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
									{user.name}
									{currentUser && user.id === currentUser.id && (
										<span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">You</span>
									)}
								</div>
								<div className="text-gray-500 text-base font-semibold flex items-center gap-2">
									{user.submissions_count} Submissions
								</div>
							</div>
						</div>
						<div className="flex flex-col items-end">
							<span className="text-3xl font-extrabold text-purple-600 drop-shadow-sm">{user.coins}</span>
							<span className="text-gray-500 font-medium -mt-1">coins</span>
						</div>
					</div>
				))}
			</div>
			{users.length === 0 && <div className="text-center py-12 text-gray-500 dark:text-gray-400">No users found</div>}
		</div>
	);
}
