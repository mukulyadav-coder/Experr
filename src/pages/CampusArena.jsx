import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Users,
  Award,
  Coins,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  TrendingUp
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import Leaderboard from '../components/ui/Leaderboard';
import CompetitionItem from '../components/ui/CompetitionItem';
import { useCampus } from '../context/CampusContext';
import {
  getCompetitionsByCollege,
  getLeaderboardByCollege,
  getCurrentUser
} from '../data/campusArenaData';

const CampusArena = () => {
  const navigate = useNavigate();
  const { selectedCollege, isVerified, hasCollege, isLoading } = useCampus();
  const [competitions, setCompetitions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isLoading) return; // Wait for context to load

    if (!hasCollege) {
      navigate('/campus-selection');
      return;
    }

    // Load college-specific data
    const collegeComps = getCompetitionsByCollege(selectedCollege.id);
    const collegeLeaderboard = getLeaderboardByCollege(selectedCollege.id)
      .slice(0, 10)
      .map((entry, index) => ({
        ...entry,
        name: `Participator ${index + 1}`,
        coins: 0,
      }));
    const user = getCurrentUser();

    setCompetitions(collegeComps);
    setLeaderboard(collegeLeaderboard); // Top 10
    setCurrentUser(user);
  }, [selectedCollege, hasCollege, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-experr-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Campus Arena...</p>
        </div>
      </div>
    );
  }

  if (!hasCollege) {
    return null; // Will redirect
  }

  const activeCompetitions = competitions.filter(comp => comp.status === 'active');
  const totalParticipants = 0;
  const userRank = 'N/A';
  const userCoins = 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to {selectedCollege.name} Arena
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Compete with your college peers and climb the leaderboard
        </p>
      </div>

      {/* Verification Banner */}
      {!isVerified && (
        <motion.div
          variants={itemVariants}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Verify your college to unlock full features
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Get verified to appear in the official leaderboard and earn special rewards
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => navigate('/dashboard')} // Could create a verification page
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Verify Now
            </Button>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Competitions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {competitions.length}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-experr-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Participants
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalParticipants}
                </p>
              </div>
              <Users className="h-8 w-8 text-accent-cyan" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Your College Rank
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  #{userRank || 'N/A'}
                </p>
              </div>
              <Award className="h-8 w-8 text-accent-lime" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Coins Earned
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userCoins}
                </p>
              </div>
              <Coins className="h-8 w-8 text-accent-orange" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Competition */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Current Competition
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeCompetitions.length > 0 ? (
                <div className="space-y-4">
                  {activeCompetitions.slice(0, 1).map((comp) => (
                    <div key={comp.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{comp.title}</h3>
                        <Badge variant={
                          comp.difficulty === 'Easy' ? 'success' :
                          comp.difficulty === 'Medium' ? 'warning' : 'danger'
                        }>
                          {comp.difficulty}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {comp.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          {comp.participants} participants
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          Due {new Date(comp.deadline).toLocaleDateString()}
                        </div>
                      </div>
                      <ProgressBar value={0.5} className="mt-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Progress: 0%</span>
                        <span>2 days left</span>
                      </div>
                    </div>
                  ))}
                  <Button
                    className="w-full mt-4"
                    onClick={() => navigate(`/competition/${activeCompetitions[0].id}`)}
                  >
                    Continue Competition
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active competitions at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* College Leaderboard */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                College Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Leaderboard
                entries={leaderboard}
                currentUserName={currentUser?.name}
                showVerification={true}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Competition List */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Available Competitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitions.map((comp) => (
                <CompetitionItem
                  key={comp.id}
                  competition={comp}
                  onClick={(id) => navigate(`/competition/${id}`)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CampusArena;
