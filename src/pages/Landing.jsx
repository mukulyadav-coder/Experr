import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Briefcase, Database, LayoutTemplate, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function Landing() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-32">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-experr-100/50 via-white to-white dark:from-experr-900/20 dark:via-dark-950 dark:to-dark-950 -z-10" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                    <Badge variant="primary" className="mb-8 px-4 py-1 text-sm">
                        Platform Beta is Live ✨
                    </Badge>
                    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl lg:max-w-4xl">
                        Experience Your Future Job <span className="text-transparent bg-clip-text bg-gradient-to-r from-experr-600 to-experr-400">Before You Get Hired.</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
                        Simulate real workplace environments, tackle professional coding scenarios, and build a pre-verified transcript of your actual capabilities.
                    </p>
                    <div className="mt-10 flex gap-4">
                        <Button size="lg" className="h-14 px-8 text-lg font-semibold group rounded-full" onClick={() => window.location.href = '/auth'}>
                            Start Simulation
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <Button variant="secondary" size="lg" className="h-14 px-8 text-lg font-semibold rounded-full" onClick={() => window.location.href = '#roles'}>
                            Explore Roles
                        </Button>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-dark-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">How It Works</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">A structured path from student to professional engineer.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '1', title: 'Pick a Role', desc: 'Choose between Frontend, Backend, or Full-Stack simulation tracks based on real industry needs.' },
                            { step: '2', title: 'Solve Real Tasks', desc: 'Tackle tickets exactly like you would on Jira or GitHub, using authentic project repositories.' },
                            { step: '3', title: 'Get Scored', desc: 'Receive your Employability Score and feedback that proves your readiness to top tech recruiters.' }
                        ].map((item, i) => (
                            <div key={i} className="relative flex flex-col items-center text-center p-8 bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-sm">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-experr-100 text-experr-700 dark:bg-experr-900/30 dark:text-experr-300 text-2xl font-bold mb-6">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Role Tracks Section */}
            <section id="roles" className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Available Role Tracks</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Simulations tailored by level and specialization.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="hover:border-experr-300 dark:hover:border-experr-700 transition-colors group cursor-pointer">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                                    <LayoutTemplate className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Frontend Engineer</CardTitle>
                                <CardDescription>React, State Management, UI/UX, Performance optimization, Accessibility.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline">React</Badge>
                                    <Badge variant="outline">Tailwind</Badge>
                                    <Badge variant="outline">Redux</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-experr-300 dark:hover:border-experr-700 transition-colors group cursor-pointer">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                                    <Database className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Backend Engineer</CardTitle>
                                <CardDescription>APIs, Database Desig, Caching, Authentication, Scalability patterns.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline">Node.js</Badge>
                                    <Badge variant="outline">PostgreSQL</Badge>
                                    <Badge variant="outline">Redis</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-experr-300 dark:hover:border-experr-700 transition-colors group cursor-pointer">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                                    <Code className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Full-Stack Engineer</CardTitle>
                                <CardDescription>End-to-end feature delivery, System Architecture, Deployment pipelines.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline">Next.js</Badge>
                                    <Badge variant="outline">Prisma</Badge>
                                    <Badge variant="outline">AWS</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50 dark:bg-dark-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Platform Features</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Shield, title: 'Pre-Verified Skills', desc: 'Proof of work over theoretical knowledge.' },
                            { icon: Zap, title: 'Instant Feedback', desc: 'Code reviews simulated instantly on push.' },
                            { icon: Briefcase, title: 'Industry Scenarios', desc: 'Not algorithms, but real app features.' },
                            { icon: CheckCircle2, title: 'Employability Score', desc: 'A standardized metric for recruiters.' }
                        ].map((feature, idx) => (
                            <div key={idx} className="flex flex-col items-start border-l-2 border-experr-200 dark:border-experr-800 pl-6">
                                <div className="p-2 mb-4 rounded-md bg-white border border-gray-100 shadow-sm dark:bg-dark-800 dark:border-dark-700">
                                    <feature.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h4>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-experr-600 dark:bg-experr-900 -z-10" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-black sm:text-5xl mb-6">
                        Ready to prove what you can build?
                    </h2>
                    <p className="text-xl text-black mb-10 max-w-2xl mx-auto">
                        Join thousands of students who are skipping the whiteboard interviews by demonstrating real engineering competence.
                    </p>
                    <Button size="lg" className="h-14 px-10 text-lg font-bold bg-white text-experr-700 hover:bg-gray-50 rounded-full shadow-xl" onClick={() => window.location.href = '/auth'}>
                        Start Your First Simulation
                    </Button>
                </div>
            </section>
        </div>
    );
}
