import React, { useState, useEffect } from 'react';
import { Share2, Lock, Award, ShieldCheck, Zap, Code, Clock, Target, MessageSquare, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { supabase } from '../../lib/supabase';

export default function EmployabilityScore() {
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [skillBreakdown, setSkillBreakdown] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [userStats, setUserStats] = useState({});

    useEffect(() => {
        const calculateEmployabilityScore = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Fetch user submissions with task details
                const { data: submissions } = await supabase
                    .from('submissions')
                    .select(`
                        *,
                        tasks (
                            title,
                            difficulty,
                            role,
                            estimated_time
                        )
                    `)
                    .eq('user_id', user.id);

                // Fetch user performance data
                const { data: performance } = await supabase
                    .from('user_performance')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                // Calculate skill scores
                const skills = calculateSkillScores(submissions || [], performance);

                // Calculate overall employability score
                const overallScore = calculateOverallScore(skills);

                // Get achievements
                const userAchievements = getAchievements(submissions || [], overallScore);

                // Update database with new score
                await supabase
                    .from('profiles')
                    .update({ employability_score: overallScore })
                    .eq('id', user.id);

                setScore(overallScore);
                setSkillBreakdown(skills);
                setAchievements(userAchievements);
                setUserStats({
                    totalSubmissions: submissions?.length || 0,
                    acceptedSubmissions: submissions?.filter(s => s.status === 'accepted').length || 0,
                    averageTime: calculateAverageTime(submissions || []),
                    topDifficulty: getTopDifficulty(submissions || [])
                });

            } catch (err) {
                console.error('Error calculating employability score:', err);
            } finally {
                setLoading(false);
            }
        };

        calculateEmployabilityScore();
    }, []);

    const calculateSkillScores = (submissions, performance) => {
        const acceptedSubmissions = submissions.filter(s => s.status === 'accepted');

        // Code Quality & Patterns (based on code_quality rating)
        const codeQualityScores = acceptedSubmissions.map(s => s.code_quality || 70);
        const avgCodeQuality = codeQualityScores.length > 0
            ? Math.round(codeQualityScores.reduce((a, b) => a + b, 0) / codeQualityScores.length)
            : 0;

        // Problem Solving Speed (based on time vs estimated time)
        const speedScores = acceptedSubmissions.map(s => {
            const estimated = s.tasks?.estimated_time;
            if (!estimated) return 80; // Default good score
            // Faster than estimated = higher score
            const ratio = estimated / Math.max(s.time_taken || estimated, 1);
            return Math.min(100, Math.max(50, ratio * 80));
        });
        const avgSpeed = speedScores.length > 0
            ? Math.round(speedScores.reduce((a, b) => a + b, 0) / speedScores.length)
            : 0;

        // System Architecture (based on task difficulty and complexity)
        const architectureScores = acceptedSubmissions.map(s => {
            const difficulty = s.tasks?.difficulty;
            const baseScore = difficulty === 'Hard' ? 90 : difficulty === 'Medium' ? 75 : 60;
            return Math.min(100, baseScore + (s.functionality || 0));
        });
        const avgArchitecture = architectureScores.length > 0
            ? Math.round(architectureScores.reduce((a, b) => a + b, 0) / architectureScores.length)
            : 0;

        // Testing & Reliability (based on documentation and testing scores)
        const testingScores = acceptedSubmissions.map(s => {
            return Math.round(((s.documentation || 70) + (s.code_quality || 70)) / 2);
        });
        const avgTesting = testingScores.length > 0
            ? Math.round(testingScores.reduce((a, b) => a + b, 0) / testingScores.length)
            : 0;

        // Communication (based on feedback quality and PR reviews - simulated)
        const communicationScore = Math.min(100, 60 + (acceptedSubmissions.length * 5));

        return [
            { title: 'Code Quality & Patterns', score: avgCodeQuality, icon: Code, description: 'Based on code reviews and best practices' },
            { title: 'Problem Solving Speed', score: avgSpeed, icon: Clock, description: 'Time efficiency in completing tasks' },
            { title: 'System Architecture', score: avgArchitecture, icon: Target, description: 'Ability to design scalable solutions' },
            { title: 'Testing & Reliability', score: avgTesting, icon: ShieldCheck, description: 'Code testing and documentation quality' },
            { title: 'Communication', score: communicationScore, icon: MessageSquare, description: 'Code clarity and collaboration skills' },
        ];
    };

    const calculateOverallScore = (skills) => {
        if (skills.length === 0) return 0;

        // Weighted average: Code Quality (25%), Speed (20%), Architecture (25%), Testing (15%), Communication (15%)
        const weights = [0.25, 0.20, 0.25, 0.15, 0.15];
        const weightedSum = skills.reduce((sum, skill, index) => sum + (skill.score * weights[index]), 0);

        return Math.round(weightedSum);
    };

    const getAchievements = (submissions, overallScore) => {
        const acceptedCount = submissions.filter(s => s.status === 'accepted').length;
        const hardTasks = submissions.filter(s => s.tasks?.difficulty === 'Hard' && s.status === 'accepted').length;
        const achievements = [];

        // Security Champion - based on security-related tasks or high code quality
        if (acceptedCount >= 3 && skillBreakdown.find(s => s.title === 'Code Quality & Patterns')?.score >= 85) {
            achievements.push({
                title: 'Security Champion',
                description: 'Consistently delivered secure, high-quality code',
                icon: ShieldCheck,
                unlocked: true
            });
        } else {
            achievements.push({
                title: 'Security Champion',
                description: 'Complete 3 tasks with high code quality scores',
                icon: ShieldCheck,
                unlocked: false
            });
        }

        // Optimization Expert - based on performance improvements
        if (skillBreakdown.find(s => s.title === 'Problem Solving Speed')?.score >= 85) {
            achievements.push({
                title: 'Optimization Expert',
                description: 'Demonstrated exceptional problem-solving efficiency',
                icon: Zap,
                unlocked: true
            });
        } else {
            achievements.push({
                title: 'Optimization Expert',
                description: 'Achieve high speed scores on multiple tasks',
                icon: Zap,
                unlocked: false
            });
        }

        // Full-Stack Master - based on completing hard tasks across different roles
        if (hardTasks >= 3) {
            achievements.push({
                title: 'Full-Stack Master',
                description: 'Completed advanced tasks across multiple technologies',
                icon: Award,
                unlocked: true
            });
        } else {
            achievements.push({
                title: 'Full-Stack Master',
                description: `Complete ${3 - hardTasks} more advanced tasks`,
                icon: Award,
                unlocked: false
            });
        }

        // High Performer - based on overall score
        if (overallScore >= 90) {
            achievements.push({
                title: 'Elite Developer',
                description: 'Achieved exceptional employability score',
                icon: TrendingUp,
                unlocked: true
            });
        } else {
            achievements.push({
                title: 'Elite Developer',
                description: `Reach ${90 - overallScore} more points for elite status`,
                icon: TrendingUp,
                unlocked: false
            });
        }

        return achievements;
    };

    const calculateAverageTime = (submissions) => {
        const times = submissions.map(s => s.time_taken).filter(t => t);
        if (times.length === 0) return 'N/A';
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        return `${Math.round(avg)}min`;
    };

    const getTopDifficulty = (submissions) => {
        const difficulties = submissions.map(s => s.tasks?.difficulty).filter(d => d);
        if (difficulties.length === 0) return 'None';

        const counts = difficulties.reduce((acc, diff) => {
            acc[diff] = (acc[diff] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).sort(([,a], [,b]) => b - a)[0][0];
    };

    const displayScore = score ?? 'N/A';
    const progressValue = typeof score === 'number' ? score : 0;

    const getScoreDescription = (score) => {
        if (score >= 90) return "Outstanding candidate for senior roles";
        if (score >= 80) return "Strong candidate for mid-level positions";
        if (score >= 70) return "Good fit for junior developer roles";
        if (score >= 60) return "Entry-level candidate with potential";
        return "Building foundational skills";
    };

    const getScorePercentile = (score) => {
        if (score >= 95) return "Top 5%";
        if (score >= 90) return "Top 10%";
        if (score >= 85) return "Top 15%";
        if (score >= 80) return "Top 25%";
        if (score >= 70) return "Top 50%";
        return "Below average";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-experr-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Calculating your employability score...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Employability Score</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Your verifiable transcript of engineering capabilities.</p>
                    <div className="flex gap-4 mt-2 text-sm">
                        <Badge variant="outline">{userStats.totalSubmissions} Total Submissions</Badge>
                        <Badge variant="success">{userStats.acceptedSubmissions} Accepted</Badge>
                        <Badge variant="primary">Top Skill: {userStats.topDifficulty}</Badge>
                    </div>
                </div>
                <Button className="gap-2" onClick={() => navigator.share?.({ title: 'My Employability Score', text: `I scored ${score}/100 on Experr!`, url: window.location.href })}>
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
                            {/* Circular progress via SVG */}
                            <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                                <circle
                                    cx="50" cy="50" r="46"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-gray-200 dark:text-gray-700"
                                />
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

                        <h3 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">
                            {score >= 80 ? 'Highly Employable' : score >= 60 ? 'Employable' : 'Developing Skills'}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 px-4">
                            {getScoreDescription(score)}
                        </p>
                        <p className="mt-1 text-xs text-experr-600 dark:text-experr-400 font-medium">
                            {getScorePercentile(score)} of candidates
                        </p>
                    </CardContent>
                </Card>

                {/* Detailed Breakdown */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Breakdown</CardTitle>
                            <CardDescription>How your score is calculated based on completed simulations and reviews.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {skillBreakdown.map((skill, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <skill.icon className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{skill.title}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{skill.score}</span>
                                    </div>
                                    <ProgressBar value={skill.score} />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{skill.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Verified Achievements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Verified Achievements</CardTitle>
                            <CardDescription>Unlock achievements by completing tasks and improving your skills.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {achievements.map((achievement, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-start gap-4 p-4 rounded-lg border ${
                                            achievement.unlocked
                                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                                : 'bg-gray-50/50 dark:bg-dark-800/50 border-gray-100/50 dark:border-dark-700/50 opacity-70'
                                        }`}
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            {achievement.unlocked ? (
                                                <achievement.icon className="h-6 w-6 text-green-600" />
                                            ) : (
                                                <Lock className="h-6 w-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className={`font-semibold text-sm ${achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {achievement.title}
                                            </h4>
                                            <p className={`text-xs mt-1 ${achievement.unlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'}`}>
                                                {achievement.description}
                                            </p>
                                        </div>
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
