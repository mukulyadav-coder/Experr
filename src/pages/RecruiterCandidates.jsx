import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Search, ChevronRight, TrendingUp, Target, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function RecruiterCandidates() {
    const [searchQuery, setSearchQuery] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                // Fetch profiles with their submission stats
                const { data: profilesData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*');

                if (profileError) throw profileError;

                // For each profile, get submission stats
                const candidatesWithStats = await Promise.all(
                    (profilesData || []).map(async (profile) => {
                        const { data: submissions } = await supabase
                            .from('submissions')
                            .select('id, status, code_quality, functionality, documentation')
                            .eq('user_id', profile.id);

                        const approvedSubs = submissions?.filter(s => s.status === 'approved') || [];
                        const avgQuality = approvedSubs.length > 0
                            ? Math.round((approvedSubs.reduce((sum, s) => sum + (s.code_quality || 0), 0) / approvedSubs.length))
                            : 0;

                        return {
                            id: profile.id,
                            name: profile.name,
                            avatar_url: profile.avatar_url,
                            employability_score: profile.employability_score || 0,
                            totalSubmissions: submissions?.length || 0,
                            approvedSubmissions: approvedSubs.length,
                            avgCodeQuality: avgQuality,
                        };
                    })
                );

                setCandidates(candidatesWithStats);
            } catch (err) {
                console.error('Error fetching candidates:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    const filteredCandidates = useMemo(() => {
        return candidates.filter(candidate => 
            candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [candidates, searchQuery]);

    const stats = {
        totalCandidates: candidates.length,
        topPerformer: candidates.length > 0 ? Math.max(...candidates.map(c => c.employability_score || 0)) : 0,
        avgScore: candidates.length > 0 ? Math.round(candidates.reduce((sum, c) => sum + (c.employability_score || 0), 0) / candidates.length) : 0,
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading candidates...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Candidate Pipeline
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Evaluate {filteredCandidates.length} {filteredCandidates.length === 1 ? 'candidate' : 'candidates'}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Candidates</CardDescription>
                        <CardTitle className="text-2xl">{stats.totalCandidates}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Average Employability</CardDescription>
                        <CardTitle className="text-2xl text-experr-600">{stats.avgScore}/100</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Top Performer Score</CardDescription>
                        <CardTitle className="text-2xl text-green-600">{stats.topPerformer}/100</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by candidate name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-experr-500 text-gray-900 dark:text-gray-100"
                />
            </div>

            {/* Candidates List */}
            {filteredCandidates.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-16">
                    <CardContent className="text-center">
                        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No candidates found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredCandidates.map((candidate) => (
                        <Link key={candidate.id} to={`/recruiter/candidate/${candidate.id}`}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        {/* Left side - Candidate Info */}
                                        <div className="flex items-center gap-4 flex-1">
                                            <img
                                                src={candidate.avatar_url}
                                                alt={candidate.name}
                                                className="h-16 w-16 rounded-full border-2 border-gray-200 dark:border-dark-700"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    {candidate.name}
                                                </h3>
                                                <div className="flex flex-wrap gap-3 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="primary" className="text-xs">
                                                            Score: {candidate.employability_score}/100
                                                        </Badge>
                                                    </div>
                                                    {candidate.approvedSubmissions >= 3 && (
                                                        <Badge variant="success" className="text-xs">
                                                            <Star className="h-3 w-3 mr-1" />
                                                            Top Performer
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                                                    <span>{candidate.totalSubmissions} submissions</span>
                                                    <span>{candidate.approvedSubmissions} approved</span>
                                                    <span className="text-experr-600">Avg Quality: {candidate.avgCodeQuality}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right side - Score and Action */}
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                        {candidate.employability_score}%
                                                    </span>
                                                </div>
                                                <ProgressBar value={candidate.employability_score} max={100} />
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
