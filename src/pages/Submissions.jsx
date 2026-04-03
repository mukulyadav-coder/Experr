import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Search, CheckCircle2, AlertCircle, MessageSquare, RotateCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Submissions() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedSubmission, setExpandedSubmission] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserAndSubmissions = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('Not authenticated');
                setUser(user);

                const { data, error } = await supabase
                    .from('submissions')
                    .select(`
                        *,
                        tasks (
                            title,
                            company
                        )
                    `)
                    .eq('user_id', user.id);
                if (error) throw error;
                setSubmissions(data || []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserAndSubmissions();
    }, []);

    const statuses = ['all', 'approved', 'rejected', 'pending'];

    const filteredSubmissions = useMemo(() => {
        return submissions.filter(sub => {
            const matchesSearch = sub.tasks?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sub.tasks?.company?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [submissions, searchQuery, statusFilter]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircle2 className="h-6 w-6 text-green-500" />;
            case 'rejected':
                return <AlertCircle className="h-6 w-6 text-red-500" />;
            default:
                return <AlertCircle className="h-6 w-6 text-gray-400" />;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'approved':
                return 'Approved';
            case 'rejected':
                return 'Rejected';
            default:
                return 'Pending';
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'approved':
                return 'success';
            case 'rejected':
                return 'danger';
            default:
                return 'default';
        }
    };

    const stats = {
        total: submissions.length,
        approved: submissions.filter(s => s.status === 'approved').length,
        rejected: submissions.filter(s => s.status === 'rejected').length,
        totalCoins: submissions.filter(s => s.status === 'approved').reduce((sum, s) => sum + s.coins, 0),
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading submissions...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    My Submissions
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    {filteredSubmissions.length} {filteredSubmissions.length === 1 ? 'submission' : 'submissions'}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Submissions</CardDescription>
                        <CardTitle className="text-2xl">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Approved</CardDescription>
                        <CardTitle className="text-2xl text-green-500">{stats.approved}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Rejected</CardDescription>
                        <CardTitle className="text-2xl text-red-500">{stats.rejected}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Coins Earned</CardDescription>
                        <CardTitle className="text-2xl text-amber-500">💰 {stats.totalCoins}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by task or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-experr-500 text-gray-900 dark:text-gray-100"
                    />
                </div>

                <div className="flex gap-3 flex-wrap">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
                    {statuses.map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                statusFilter === status
                                    ? 'bg-experr-600 text-white'
                                    : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                            }`}
                        >
                            {status === 'all' ? 'All' : getStatusLabel(status)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Submissions List */}
            {filteredSubmissions.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-16">
                    <CardContent className="text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No submissions found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredSubmissions.map((submission) => (
                        <Card key={submission.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                            <CardContent className="p-0">
                                <div
                                    onClick={() => setExpandedSubmission(expandedSubmission === submission.id ? null : submission.id)}
                                    className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="mt-1">
                                                {getStatusIcon(submission.status)}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    {submission.tasks?.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 items-center mb-3">
                                                    <Badge variant="primary" className="text-xs">
                                                        {submission.tasks?.company}
                                                    </Badge>
                                                    <Badge variant={getStatusBadgeVariant(submission.status)} className="text-xs">
                                                        {getStatusLabel(submission.status)}
                                                    </Badge>
                                                </div>
                                                {submission.feedback && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                                        {submission.feedback}
                                                    </p>
                                                )}
                                                <div className="flex gap-1 text-xs text-gray-600 dark:text-gray-400 mt-2">
                                                    <span>Submitted: {submission.submittedDate}</span>
                                                    {submission.reviewedDate && (
                                                        <>
                                                            <span>•</span>
                                                            <span>Reviewed: {submission.reviewedDate}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            {submission.status === 'approved' && submission.coins > 0 && (
                                                <div>
                                                    <div className="text-2xl font-bold text-amber-500">💰 {submission.coins}</div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Earned</p>
                                                </div>
                                            )}
                                            {submission.status === 'rejected' && (
                                                <p className="text-xs text-red-400">Needs Resubmission</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedSubmission === submission.id && submission.reviewer && (
                                    <div className="border-t border-gray-200 dark:border-dark-700 px-6 py-6 bg-gray-50 dark:bg-dark-800/50">
                                        {/* Reviewer Info */}
                                        <div className="mb-6 flex items-center gap-3">
                                            <img
                                                src={submission.reviewerAvatar}
                                                alt={submission.reviewer}
                                                className="h-12 w-12 rounded-full"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{submission.reviewer}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Reviewed on {submission.reviewedDate}</p>
                                            </div>
                                        </div>

                                        {/* Status Message */}
                                        {submission.status === 'approved' && (
                                            <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
                                                <p className="text-green-200 font-medium">✓ Great work! Your submission was approved.</p>
                                                <p className="text-green-300 text-sm mt-1">You earned <span className="font-bold text-lg">💰 {submission.coins}</span> coins</p>
                                            </div>
                                        )}

                                        {submission.status === 'rejected' && (
                                            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
                                                <p className="text-red-200 font-medium">✗ Your submission needs improvements.</p>
                                                <p className="text-red-300 text-sm mt-1">Please review the feedback below and resubmit.</p>
                                            </div>
                                        )}

                                        {/* Quality Breakdown */}
                                        <div className="mb-6 space-y-3">
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Quality Breakdown</h4>
                                            <div className="space-y-2">
                                                <div>
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">Code Quality</span>
                                                        <span className="text-sm font-medium text-experr-600">{submission.codeQuality}%</span>
                                                    </div>
                                                    <ProgressBar value={submission.codeQuality} max={100} />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">Functionality</span>
                                                        <span className="text-sm font-medium text-experr-600">{submission.functionality}%</span>
                                                    </div>
                                                    <ProgressBar value={submission.functionality} max={100} />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">Documentation</span>
                                                        <span className="text-sm font-medium text-experr-600">{submission.documentation}%</span>
                                                    </div>
                                                    <ProgressBar value={submission.documentation} max={100} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Feedback */}
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                                                <MessageSquare className="h-4 w-4" />
                                                Reviewer Feedback
                                            </h4>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                {submission.feedback}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            {submission.status === 'rejected' && (
                                                <Link to={`/tasks/${submission.taskId}`} className="flex-1">
                                                    <Button size="sm" className="w-full gap-2">
                                                        <RotateCw className="h-4 w-4" />
                                                        Resubmit Solution
                                                    </Button>
                                                </Link>
                                            )}
                                            {submission.status === 'approved' && (
                                                <Button variant="secondary" size="sm" className="flex-1">
                                                    View Code
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Coin Rewards Info */}
            <Card className="bg-blue-900/20 border-blue-800 border-2">
                <CardHeader>
                    <CardTitle className="text-lg">💰 Coin Rewards System</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-black">
                    <p>✓ Approved submissions = Coins earned based on quality</p>
                    <p>✗ Rejected submissions = No coins, but can resubmit</p>
                    <p>🎯  High code quality = More coins rewarded</p>
                    <p>📈  Build your coin balance and unlock achievements!</p>
                </CardContent>
            </Card>
        </div>
    );
}
