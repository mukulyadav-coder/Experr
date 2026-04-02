import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Code, CheckCircle2, AlertCircle, MessageSquare, Zap, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { supabase } from '../../lib/supabase';

export default function CandidateProfile() {
    const { candidateId } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [expandedSubmission, setExpandedSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCandidateData = async () => {
            try {
                // Fetch candidate profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', candidateId)
                    .single();

                if (profileError) throw profileError;
                setCandidate(profileData);

                // Fetch all submissions with task info
                const { data: submissionsData, error: submissionsError } = await supabase
                    .from('submissions')
                    .select(`
                        *,
                        tasks (
                            id,
                            title,
                            company,
                            role
                        )
                    `)
                    .eq('user_id', candidateId)
                    .order('submitted_at', { ascending: false });

                if (submissionsError) throw submissionsError;
                setSubmissions(submissionsData || []);
            } catch (err) {
                console.error('Error fetching candidate data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidateData();
    }, [candidateId]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircle2 className="h-6 w-6 text-green-500" />;
            case 'rejected':
                return <AlertCircle className="h-6 w-6 text-red-500" />;
            default:
                return <Activity className="h-6 w-6 text-amber-500" />;
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'approved':
                return 'success';
            case 'rejected':
                return 'danger';
            default:
                return 'warning';
        }
    };

    const stats = {
        totalSubmissions: submissions.length,
        approved: submissions.filter(s => s.status === 'approved').length,
        rejected: submissions.filter(s => s.status === 'rejected').length,
        pending: submissions.filter(s => s.status === 'pending').length,
        avgQuality: submissions.length > 0
            ? Math.round(submissions.reduce((sum, s) => sum + (s.code_quality || 0), 0) / submissions.length)
            : 0,
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading candidate profile...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>;
    }

    if (!candidate) {
        return <div className="flex justify-center items-center h-64 text-red-500">Candidate not found</div>;
    }

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Link to="/recruiter/candidates">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-4">
                            <img
                                src={candidate.avatar_url}
                                alt={candidate.name}
                                className="h-20 w-20 rounded-full border-2 border-gray-200 dark:border-dark-700"
                            />
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {candidate.name}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">
                                    Employability Score: <span className="font-bold text-experr-600">{candidate.employability_score}/100</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Submissions</CardDescription>
                        <CardTitle className="text-2xl">{stats.totalSubmissions}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Approved</CardDescription>
                        <CardTitle className="text-2xl text-green-600">{stats.approved}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Rejected</CardDescription>
                        <CardTitle className="text-2xl text-red-600">{stats.rejected}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Avg Code Quality</CardDescription>
                        <CardTitle className="text-2xl text-experr-600">{stats.avgQuality}%</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Code Evaluations */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                    Code Evaluations ({submissions.length})
                </h2>

                {submissions.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-16">
                        <CardContent className="text-center">
                            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No submissions yet</h3>
                            <p className="text-gray-500 dark:text-gray-400">This candidate hasn't submitted any code</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {submissions.map((submission) => (
                            <Card key={submission.id} className="overflow-hidden">
                                <CardContent className="p-0">
                                    {/* Summary Row */}
                                    <div
                                        onClick={() => setExpandedSubmission(expandedSubmission === submission.id ? null : submission.id)}
                                        className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-4">
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
                                                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                                        </Badge>
                                                        {submission.code_quality && (
                                                            <Badge variant="outline" className="text-xs">
                                                                Quality: {submission.code_quality}%
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-experr-600">
                                                    {submission.code_quality || '-'}%
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Quality Score</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedSubmission === submission.id && (
                                        <div className="border-t border-gray-200 dark:border-dark-700 px-6 py-6 bg-gray-50 dark:bg-dark-800/50 space-y-6">
                                            {/* Code Submitted */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Code className="h-5 w-5 text-experr-600" />
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">Code Submitted</h4>
                                                </div>
                                                <div className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto">
                                                    <pre className="text-gray-100 text-sm font-mono">
                                                        <code>{submission.solution_code || 'No code provided'}</code>
                                                    </pre>
                                                </div>
                                            </div>

                                            {/* Test Results */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">Test Cases</h4>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <Card className="bg-white dark:bg-dark-700/50">
                                                        <CardContent className="pt-6">
                                                            <div className="text-center">
                                                                <div className="text-3xl font-bold text-green-600 mb-2">
                                                                    {submission.tests_passed || 0}/{submission.total_tests || 0}
                                                                </div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">Tests Passed</p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                    <Card className="bg-white dark:bg-dark-700/50">
                                                        <CardContent className="pt-6">
                                                            <div className="text-center">
                                                                <div className="text-3xl font-bold text-experr-600 mb-2">
                                                                    {submission.accuracy_percentage || 0}%
                                                                </div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </div>

                                            {/* Test Results Breakdown */}
                                            {(submission.tests_passed || submission.total_tests) && (
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Results Breakdown</h4>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <div className="flex justify-between mb-1">
                                                                <span className="text-sm text-gray-700 dark:text-gray-300">Test Coverage</span>
                                                                <span className="text-sm font-medium text-experr-600">
                                                                    {submission.tests_passed}/{submission.total_tests}
                                                                </span>
                                                            </div>
                                                            <ProgressBar value={submission.tests_passed || 0} max={submission.total_tests || 1} />
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between mb-1">
                                                                <span className="text-sm text-gray-700 dark:text-gray-300">Execution Status</span>
                                                                <Badge variant={submission.execution_status === 'success' ? 'success' : 'danger'} className="text-xs">
                                                                    {submission.execution_status || 'pending'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* AI Feedback */}
                                            <div className="bg-white dark:bg-dark-700/50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Zap className="h-5 w-5 text-amber-500" />
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">AI Feedback</h4>
                                                </div>
                                                <div className="space-y-4">
                                                    {/* Code Quality */}
                                                    <div>
                                                        <div className="flex justify-between mb-2">
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Code Quality</span>
                                                            <span className="text-sm font-bold text-experr-600">{submission.code_quality || 0}%</span>
                                                        </div>
                                                        <ProgressBar value={submission.code_quality || 0} max={100} />
                                                        {submission.quality_feedback && (
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                                                {submission.quality_feedback}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Functionality */}
                                                    <div>
                                                        <div className="flex justify-between mb-2">
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Functionality</span>
                                                            <span className="text-sm font-bold text-green-600">{submission.functionality || 0}%</span>
                                                        </div>
                                                        <ProgressBar value={submission.functionality || 0} max={100} />
                                                        {submission.functionality_feedback && (
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                                                {submission.functionality_feedback}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Optimization */}
                                                    <div>
                                                        <div className="flex justify-between mb-2">
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Optimization</span>
                                                            <span className="text-sm font-bold text-blue-600">{submission.optimization_score || 0}%</span>
                                                        </div>
                                                        <ProgressBar value={submission.optimization_score || 0} max={100} />
                                                        {submission.optimization_feedback && (
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                                                {submission.optimization_feedback}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Logic */}
                                                    <div>
                                                        <div className="flex justify-between mb-2">
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Logic</span>
                                                            <span className="text-sm font-bold text-purple-600">{submission.logic_score || 0}%</span>
                                                        </div>
                                                        <ProgressBar value={submission.logic_score || 0} max={100} />
                                                        {submission.logic_feedback && (
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                                                {submission.logic_feedback}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Feedback Notes */}
                                            {submission.feedback && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <MessageSquare className="h-5 w-5 text-blue-600" />
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">Reviewer Feedback</h4>
                                                    </div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-dark-700/50 rounded-lg p-4 border-l-4 border-blue-500">
                                                        {submission.feedback}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
