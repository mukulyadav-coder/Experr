import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const fallbackAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=profile-fallback';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');

      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
          throw new Error(authError?.message || 'Not authenticated');
        }

        setUser(authUser);

        // Use maybeSingle to avoid select errors when no row is present
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name, email, coins, employability_score, avatar_url')
          .eq('id', authUser.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile row:', profileError);
          throw new Error('Unable to fetch profile information');
        }

        let finalProfile = profileData;

        if (!finalProfile) {
          // create fallback row if profile doesn't exist
          const defaultProfile = {
            id: authUser.id,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            email: authUser.email,
            coins: 0,
            employability_score: 0,
            avatar_url: authUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.email}`,
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([defaultProfile])
            .maybeSingle();
          if (createError) {
            console.error('Error creating fallback profile:', createError);
            throw new Error('Unable to create profile record.');
          }

          finalProfile = createdProfile;
        }

        setProfile({
          name: finalProfile.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          username: finalProfile.username || authUser.user_metadata?.username || '',
          bio: finalProfile.bio || 'No bio set yet.',
          avatar_url: finalProfile.avatar_url || authUser.user_metadata?.avatar_url || fallbackAvatar,
          coins: finalProfile.coins ?? 0,
          employability_score: finalProfile.employability_score ?? 0,
          email: finalProfile.email || authUser.email,
          role: 'Student',
        });
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err.message || 'Could not load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-experr-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-700 dark:bg-red-950/30">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-lg rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-dark-700 dark:bg-dark-900">
          <p className="text-gray-700 dark:text-gray-300">No profile data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your public profile information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Edit Profile</Button>
          <Button size="sm" onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-700 dark:bg-dark-900">
          <div className="flex flex-col items-center text-center gap-3">
            <img
              src={profile.avatar_url || fallbackAvatar}
              alt={profile.name || 'Avatar'}
              className="h-24 w-24 rounded-full border-2 border-experr-500 object-cover"
              onError={(e) => { e.currentTarget.src = fallbackAvatar; }}
            />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{profile.name}</h2>
            {profile.username && <p className="text-sm text-gray-500 dark:text-gray-400">@{profile.username}</p>}
            <p className="text-sm text-gray-600 dark:text-gray-300">{profile.role}</p>
            <div className="flex gap-2">
              <Badge variant="primary">Coins: {profile.coins}</Badge>
              <Badge variant="success">Score: {profile.employability_score ?? 0}</Badge>
              <Badge variant="outline">Rank: #{profile.rank || 'N/A'}</Badge>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-700 dark:bg-dark-900">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account details</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Updated: {new Date().toLocaleDateString()}</span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-dark-700 dark:bg-dark-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-800 dark:text-gray-100">{user.email}</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-dark-700 dark:bg-dark-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Username</p>
              <p className="font-medium text-gray-800 dark:text-gray-100">{profile.username || 'Not set'}</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-dark-700 dark:bg-dark-800 md:col-span-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Bio</p>
              <p className="font-medium text-gray-800 dark:text-gray-100">{profile.bio || 'No bio provided yet.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
