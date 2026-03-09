import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, MessageSquare, PlayCircle, Code, Briefcase } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Fallback/fake data for missing variables
    const currentSimulation = currentTask ? {
        title: currentTask.title,
        company: currentTask.company,
        role: currentTask.role,
        progress: 50 // Example progress
    } : { title: 'No Task', company: '', role: '', progress: 0 };
    const upcomingDeadlines = [];
    const activityFeed = [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('Not authenticated');

                // Fetch profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('name, coins')
                    .eq('id', user.id)
                    .single();
                if (profileError) throw profileError;
                setProfile(profileData);

                // Fetch submissions with task info (Supabase join)
                const { data: submissionsData, error: submissionsError } = await supabase
                    .from('submissions')
                    .select('*, tasks(*)')
                    .eq('user_id', user.id);
                if (submissionsError) throw submissionsError;
                setSubmissions(submissionsData || []);

                // Fetch a current task, e.g., first task
                const { data: taskData, error: taskError } = await supabase
                    .from('tasks')
                    .select('*')
                    .limit(1)
                    .single();
                if (taskError) throw taskError;
                setCurrentTask(taskData);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>;
    }

    const stats = {
        employabilityScore: 85, // Hardcoded for now
        completedTasks: submissions.filter(s => s.status === 'approved').length,
        feedbackReceived: submissions.filter(s => s.status === 'approved').length, // Assuming feedback per approved
        totalCoins: submissions.filter(s => s.status === 'approved').reduce((sum, s) => sum + (s.coins || 0), 0),
    };

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Welcome back, {profile?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Here's a summary of your workspace today.</p>
                </div>
                <Link to={`/tasks/${currentTask?.id}`}>
                    <Button className="shrink-0 gap-2">
                        <PlayCircle className="h-4 w-4" />
                        Resume Simulation
                    </Button>
                </Link>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { label: 'Employability Score', value: `${stats.employabilityScore}/100`, trend: '+2 points this week', color: 'text-experr-600' },
                    { label: 'Completed Tasks', value: stats.completedTasks, trend: 'Top 15% of cohort', color: 'text-green-600' },
                    { label: 'Feedback Received', value: stats.feedbackReceived, trend: '2 new since last login', color: 'text-purple-600' },
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <CardDescription>{stat.label}</CardDescription>
                            <CardTitle className="text-3xl">{stat.value}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className={`text-xs font-medium ${stat.color}`}>{stat.trend}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Active Simulation Progress */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Current Simulation</CardTitle>
                                    <CardDescription className="mt-1">{currentSimulation.title} · {currentSimulation.company}</CardDescription>
                                </div>
                                <Badge variant="primary">{currentSimulation.role}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-4 flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Phase 2: Implementation</span>
                                    <span className="text-gray-500 dark:text-gray-400">{currentSimulation.progress}% Completed</span>
                                </div>
                                <ProgressBar value={currentSimulation.progress} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today's Tasks */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle>Today's Tasks</CardTitle>
                                <CardDescription>Your assigned tickets for today</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm">View All</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-gray-100 dark:divide-dark-800 border border-gray-100 rounded-lg dark:border-dark-800">
                                {['Fix JWT Middleware Issue', 'Refactor Layout Component', 'Write Unit Tests for API'].map((task, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            {idx === 0 ? <AlertCircle className="h-5 w-5 text-amber-500" /> : <Code className="h-5 w-5 text-gray-400" />}
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{task}</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            Open <ArrowRight className="ml-1 h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column - Sidebar Widgets */}
                <div className="space-y-8">

                    {/* Upcoming Deadlines */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Deadlines</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingDeadlines.map((deadline) => (
                                    <div key={deadline.id} className="flex items-start gap-3">
                                        <div className="mt-0.5 rounded-full p-1 border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
                                            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{deadline.title}</p>
                                            <p className={`text-xs mt-0.5 font-medium ${deadline.status === 'urgent' ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {deadline.date}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Feed */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Feed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-5">
                                {activityFeed.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className="mt-0.5 rounded-full bg-gray-100 p-1.5 dark:bg-dark-800">
                                            {activity.type === 'completion' ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                                            ) : activity.type === 'feedback' ? (
                                                <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-500" />
                                            ) : (
                                                <Briefcase className="h-4 w-4 text-experr-600 dark:text-experr-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-900 dark:text-gray-100 leading-snug">{activity.message}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Submissions */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle>Recent Submissions</CardTitle>
                                <CardDescription>Your latest task submissions</CardDescription>
                            </div>
                            <Link to="/submissions">
                                <Button variant="ghost" size="sm">View All</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {submissions.filter(s => s.status === 'approved').slice(0, 3).map((submission) => (
                                    <div key={submission.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors rounded-lg border border-gray-100 dark:border-dark-800/50">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{submission.tasks?.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{submission.tasks?.company}</p>
                                        </div>
                                        {submission.status === 'approved' ? (
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-amber-500">💰 {submission.coins}</p>
                                                <Badge variant="success" className="text-xs">Approved</Badge>
                                            </div>
                                        ) : (
                                            <Badge variant="danger" className="text-xs">Rejected</Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}

