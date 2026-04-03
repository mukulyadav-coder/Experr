import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cards } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { supabase } from '../lib/supabase';
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsCard from '../components/profile/StatsCard';
import ActivityGraph from '../components/profile/ActivityGraph';
import SubmissionsTab from '../components/profile/SubmissionsTab';
import AchievementsTab from '../components/profile/AchievementsTab';
import ProjectsTab from '../components/profile/ProjectsTab';
import PerformanceTab from '../components/profile/PerformanceTab';
import EditProfileModal from '../components/profile/EditProfileModal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';

const calculateStreak = (submissionDates) => {
  const dateSet = new Set(submissionDates.map((d) => new Date(d).toISOString().split('T')[0]));
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i += 1) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const key = checkDate.toISOString().split('T')[0];
    if (dateSet.has(key)) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
};

const generateActivityData = (submissions) => {
  const map = {};
  submissions.forEach((sub) => {
    const day = new Date(sub.created_at).toISOString().split('T')[0];
    map[day] = (map[day] || 0) + 1;
  });

  const data = [];
  const today = new Date();
  for (let i = 364; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    data.push({ date: dateStr, count: map[dateStr] || 0 });
  }
  return data;
};

const derivePerformanceData = (submissions) => {
  const monthly = {};
  submissions.forEach((sub) => {
    const d = new Date(sub.created_at);
    const key = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    monthly[key] = monthly[key] || { submissions: 0, accepted: 0 };
    monthly[key].submissions += 1;
    if (sub.status === 'accepted') monthly[key].accepted += 1;
  });

  return Object.entries(monthly)
    .slice(-6)
    .map(([month, value]) => ({
      month,
      submissions: value.submissions,
      accepted: value.accepted,
      accuracy: value.submissions ? Math.round((value.accepted / value.submissions) * 100) : 0,
    }));
};

const getProfileCompletion = (user) => {
  if (!user) return 0;
  const fields = ['name', 'username', 'bio', 'avatar_url', 'github', 'linkedin'];
  const filled = fields.reduce((sum, key) => (user[key] ? sum + 1 : sum), 0);
  return Math.round((filled / fields.length) * 100);
};

export default function AdvancedProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ totalSubmissions: 0, acceptedSubmissions: 0, accuracy: 0, streak: 0 });
  const [ranking, setRanking] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [monthlyPerformance, setMonthlyPerformance] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        setError('Not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      const userId = authData.user.id;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, username, bio, avatar_url, coins, github, linkedin, updated_at')
        .eq('id', userId)
        .single();

      if (userError) throw userError;
      setUser(userData);

      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (submissionError) throw submissionError;
      const subs = submissionData || [];
      setSubmissions(subs);

      const total = subs.length;
      const accepted = subs.filter((s) => s.status === 'accepted').length;
      const accuracy = total > 0 ? Math.round((accepted / total) * 100) : 0;
      const streak = calculateStreak(subs.map((s) => s.created_at));

      setStats({ totalSubmissions: total, acceptedSubmissions: accepted, accuracy, streak });

      const { data: usersRankData, error: rankError } = await supabase
        .from('users')
        .select('id, coins')
        .order('coins', { ascending: false });

      if (rankError) throw rankError;

      const currentRank = usersRankData?.findIndex((u) => u.id === userId);
      setRanking(currentRank >= 0 ? currentRank + 1 : null);

      setActivityData(generateActivityData(subs));
      setProfileCompletion(getProfileCompletion(userData));
      setMonthlyPerformance(derivePerformanceData(subs));
    } catch (err) {
      setError(err.message || 'Failed to fetch profile data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleCopyLink = async () => {
    try {
      const profileUrl = `${window.location.origin}/profile/${user?.id}`;
      await navigator.clipboard.writeText(profileUrl);
      alert('Profile link copied!');
    } catch {
      alert('Could not copy profile link.');
    }
  };

  const handleSave = async (updates) => {
    if (!user) return;
    setSaveLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) throw updateError;
      await fetchUserData();
      setShowEditModal(false);
    } catch (err) {
      setError(err.message || 'Failed to save profile updates.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600 dark:text-gray-300">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-gray-600 dark:text-gray-300">User not found.</div>;
  }

  const achievements = [
    { id: 'a1', title: 'First Submission', description: 'Made the first submission', date: (new Date()).toLocaleDateString() },
    { id: 'a2', title: 'First Accepted', description: 'First accepted submission', date: (new Date()).toLocaleDateString() },
  ];

  const projects = [];

  return (
    <div className="bg-gray-50 dark:bg-dark-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeader
          user={user}
          stats={stats}
          rank={ranking}
          profileCompletion={profileCompletion}
          onEdit={() => setShowEditModal(true)}
          onCopyProfileLink={handleCopyLink}
          isLoading={loading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard label="Total Submissions" value={stats.totalSubmissions} />
          <StatsCard label="Accepted Submissions" value={stats.acceptedSubmissions} />
          <StatsCard label="Accuracy" value={stats.accuracy} suffix="%" />
          <StatsCard label="Streak" value={`${stats.streak} days`} />
        </div>

        <ActivityGraph data={activityData} />

        <Tabs value="submissions" onValueChange={() => {}} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 gap-0 bg-gray-100 dark:bg-dark-800 p-1 rounded-lg mb-6">
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
            <SubmissionsTab submissions={submissions} />
          </TabsContent>
          <TabsContent value="achievements">
            <AchievementsTab achievements={achievements} />
          </TabsContent>
          <TabsContent value="projects">
            <ProjectsTab projects={projects} />
          </TabsContent>
          <TabsContent value="performance">
            <PerformanceTab stats={stats} monthlyData={monthlyPerformance} />
          </TabsContent>
        </Tabs>

        <div className="mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">Recent Submissions</h3>
              <Button onClick={() => navigate('/submissions')} variant="secondary" size="sm">See all</Button>
            </div>
            <div className="space-y-2">
              {submissions.slice(-5).map((sub) => (
                <div key={sub.id} className="rounded-lg border border-gray-200 p-3 dark:border-dark-700">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 dark:text-white">{sub.title || sub.task_title || 'Untitled'}</p>
                    <Badge variant={sub.status === 'accepted' ? 'success' : sub.status === 'rejected' ? 'danger' : 'warning'}>{sub.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(sub.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
          onSave={handleSave}
          loading={saveLoading}
        />
      </div>
    </div>
  );
}
