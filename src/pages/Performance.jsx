import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Target, TrendingUp, AlertTriangle, MessageSquare } from 'lucide-react';

export default function Performance() {
    return (
        <div className="flex flex-col gap-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Performance Analytics</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Track your growth and identify areas for improvement.</p>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-experr-100 text-experr-600 dark:bg-experr-900/30 dark:text-experr-400">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Velocity</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">High</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <Target className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Task Accuracy</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">92%</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Code Reviews Passed</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">14/15</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Progression Matrix</CardTitle>
                            <CardDescription>Your overall score trajectory over the last 5 weeks.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80 w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={[
    { name: 'Week 1', score: 65 },
    { name: 'Week 2', score: 68 },
    { name: 'Week 3', score: 74 },
    { name: 'Week 4', score: 79 },
    { name: 'Week 5', score: 85 },
]}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dx={-10} domain={[0, 100]} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', borderRadius: '8px' }}
                                            itemStyle={{ color: '#bae6fd' }}
                                        />
                                        <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Feedback */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Detailed Feedback</CardTitle>
                            <CardDescription>Insights from your simulated code reviews</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { title: "Component Architecture", reviewer: "Senior Engineer Sim", date: "2 days ago", type: "positive", comment: "Great use of custom hooks to isolate business logic. The components are clean and well-structured." },
                                { title: "Authentication Flow", reviewer: "Security Sim", date: "1 week ago", type: "neutral", comment: "The JWT implementation works, but make sure to implement automated token refresh on the client-side to improve UX." },
                            ].map((fb, i) => (
                                <div key={i} className="border-b border-gray-100 dark:border-dark-800 pb-4 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{fb.title}</h4>
                                        <span className="text-xs text-gray-500">{fb.date}</span>
                                    </div>
                                    <Badge variant={fb.type === 'positive' ? 'success' : 'warning'} className="mb-2 text-[10px]">{fb.reviewer}</Badge>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{fb.comment}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Breakdown Sidebar */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-green-500" />
                                Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:bg-green-900/10">React Hooks (95%)</Badge>
                                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:bg-green-900/10">API Integration (88%)</Badge>
                                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:bg-green-900/10">UI/UX Layout (92%)</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                Improvement Areas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-900/50 dark:text-amber-400 dark:bg-amber-900/10">State Management (65%)</Badge>
                                <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-900/50 dark:text-amber-400 dark:bg-amber-900/10">Testing (55%)</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
