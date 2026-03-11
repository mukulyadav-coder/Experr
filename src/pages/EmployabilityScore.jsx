import React, { useState, useEffect } from 'react';
import { Share2, Lock, Award, ShieldCheck, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { supabase } from '../../lib/supabase';

export default function EmployabilityScore() {
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data } = await supabase.from('profiles').select('employability_score').eq('id', user.id).single();
                    setScore(data?.employability_score);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchScore();
    }, []);

    const displayScore = score ?? 'N/A';
    const progressValue = typeof score === 'number' ? score : 0;

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Employability Score</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Your verifiable transcript of engineering capabilities.</p>
                </div>
                <Button className="gap-2">
                    <Share2 className="h-4 w-4" /> Share Profile
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mt-4">
                {/* Main Score Card */}
                <Card className="lg:col-span-1 bg-white dark:bg-dark-900 border-experr-200 dark:border-experr-900/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Award className="h-48 w-48 text-experr-600" />
                    </div>
                    <CardContent className="flex flex-col items-center justify-center pt-12 pb-8 relative z-10 text-center">
                        <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-8 border-experr-100 dark:border-dark-800">
                            {/* Circular progress mock via SVG */}
                            <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                                <circle
                                    cx="50" cy="50" r="46"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-experr-500 stroke-current"
                                    strokeDasharray="289"
                                    strokeDashoffset={289 - (289 * progressValue) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="flex flex-col items-center">
                                <span className="text-5xl font-extrabold text-gray-900 dark:text-white">{displayScore}</span>
                                {typeof score === 'number' && (
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/ 100</span>
                                )}
                            </div>
                        </div>

                        <h3 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">Ready for Hire</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 px-4">
                            You rank in the top 15% of candidates for Junior Level Frontend roles.
                        </p>
                    </CardContent>
                </Card>

                {/* Detailed Breakdown */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Breakdown</CardTitle>
                            <CardDescription>How your score is calculated based on completed simulations.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { title: 'Code Quality & Patterns', score: 90 },
                                { title: 'Problem Solving Speed', score: 85 },
                                { title: 'System Architecture', score: 75 },
                                { title: 'Testing & Reliability', score: 70 },
                                { title: 'Communication (PR Reviews)', score: 95 },
                            ].map((skill, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{skill.title}</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{skill.score}</span>
                                    </div>
                                    <ProgressBar value={skill.score} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Verified Achievements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Verified Achievements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-dark-800 border border-gray-100 dark:border-dark-700">
                                    <div className="flex-shrink-0 mt-1">
                                        <ShieldCheck className="h-6 w-6 text-experr-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Security Champion</h4>
                                        <p className="text-xs text-gray-500 mt-1">Successfully identified and fixed 5 vulnerable dependencies in simulation tasks.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-dark-800 border border-gray-100 dark:border-dark-700">
                                    <div className="flex-shrink-0 mt-1">
                                        <Zap className="h-6 w-6 text-experr-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Optimization Expert</h4>
                                        <p className="text-xs text-gray-500 mt-1">Reduced payload size by 40% in the Dashboard Refactor simulation.</p>
                                    </div>
                                </div>

                                {/* Locked Achievement */}
                                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50/50 dark:bg-dark-800/50 border border-gray-100/50 dark:border-dark-700/50 opacity-70">
                                    <div className="flex-shrink-0 mt-1">
                                        <Lock className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400">Full-Stack Master</h4>
                                        <p className="text-xs text-gray-400 mt-1">Complete 3 advanced level Backend simulations to unlock.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
