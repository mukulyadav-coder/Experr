import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { AppLayout } from './components/layout/AppLayout';
import { MarketingLayout } from './components/layout/MarketingLayout';

// Pages placeholders (will replace with real imports)
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import TaskSimulation from './pages/TaskSimulation';
import Submissions from './pages/Submissions';
import Performance from './pages/Performance';
import Score from './pages/EmployabilityScore';
import CampusSelection from './pages/CampusSelection';
import CampusArena from './pages/CampusArena';
import CompetitionDetails from './pages/CompetitionDetails';
import RecruiterCandidates from './pages/RecruiterCandidates';
import CandidateProfile from './pages/CandidateProfile';
import MockInterviews from './pages/MockInterviews';
import Leaderboard from './pages/Leaderboard';
import ProfilePage from './pages/ProfilePage';
import Settings from './pages/Settings';

function App() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(!darkMode);

    return (
        <Router>
            <Routes>
                {/* Marketing Routes */}
                <Route element={<MarketingLayout toggleTheme={toggleTheme} isDark={darkMode} />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/auth" element={<Auth />} />
                </Route>

                {/* App Routes */}
                <Route element={<AppLayout toggleTheme={toggleTheme} isDark={darkMode} />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/campus-selection" element={<CampusSelection />} />
                    <Route path="/campus-arena" element={<CampusArena />} />
                    <Route path="/competition/:id" element={<CompetitionDetails />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/tasks/:id" element={<TaskSimulation />} />
                    <Route path="/submissions" element={<Submissions />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/performance" element={<Performance />} />
                    <Route path="/score" element={<Score />} />
                    <Route path="/mock-interviews" element={<MockInterviews />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<Settings />} />
                    
                    {/* Recruiter Portal Routes */}
                    <Route path="/recruiter/candidates" element={<RecruiterCandidates />} />
                    <Route path="/recruiter/candidate/:candidateId" element={<CandidateProfile />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
