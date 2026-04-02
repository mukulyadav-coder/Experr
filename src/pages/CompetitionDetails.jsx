import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Trophy,
  Clock,
  Users,
  CheckCircle,
  Code,
  Send,
  Star
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useCampus } from '../context/CampusContext';
import { competitions } from '../data/campusArenaData';

const CompetitionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCollege } = useCampus();
  const [competition, setCompetition] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const comp = competitions.find(c => c.id === id);
    if (comp && comp.college === selectedCollege?.id) {
      setCompetition(comp);
    } else {
      navigate('/campus-arena');
    }
  }, [id, selectedCollege, navigate]);

  const handleSubmit = () => {
    // Mock submission
    setHasSubmitted(true);
    setScore(Math.floor(Math.random() * 40) + 60); // Random score 60-100
    setFeedback('Great work! Your solution demonstrates good understanding of the concepts. Consider optimizing the time complexity for better performance.');
  };

  if (!competition) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Competition not found</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/campus-arena')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campus Arena
        </Button>
      </div>

      {/* Competition Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{competition.title}</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                {competition.description}
              </p>
              <div className="flex items-center space-x-4">
                <Badge variant={
                  competition.difficulty === 'Easy' ? 'success' :
                  competition.difficulty === 'Medium' ? 'warning' : 'danger'
                }>
                  {competition.difficulty}
                </Badge>
                <Badge variant={competition.status === 'active' ? 'primary' : 'outline'}>
                  {competition.status}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {competition.participants} participants
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  Due {new Date(competition.deadline).toLocaleDateString()}
                </div>
              </div>
            </div>
            <Trophy className="h-8 w-8 text-experr-600" />
          </div>
        </CardHeader>
      </Card>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Competition Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competition.tasks.map((task, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
              >
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-900 dark:text-white">{task}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submission Section */}
      {!hasSubmitted ? (
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Solution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Solution Code
                </label>
                <textarea
                  rows={10}
                  placeholder="Paste your solution code here..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 focus:ring-2 focus:ring-experr-500 focus:border-transparent font-mono text-sm"
                />
              </div>
              <Button
                onClick={handleSubmit}
                className="flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Solution
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Results Section */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                <CheckCircle className="h-6 w-6 mr-2" />
                Submission Successful!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-experr-600">
                  {score}/100
                </div>
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(score / 20)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  {feedback}
                </p>
                <div className="flex justify-center space-x-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/campus-arena')}
                  >
                    Back to Arena
                  </Button>
                  <Button>
                    View Leaderboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CompetitionDetails;