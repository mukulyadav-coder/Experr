import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Trophy, User, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colleges, getCurrentUser } from '../data/campusArenaData';
import { useCampus } from '../context/CampusContext';

const CampusSelection = () => {
  const navigate = useNavigate();
  const { selectCollege, currentUser, isLoading } = useCampus();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    if (isLoading) return;

    // Auto-fill student name from current user
    if (currentUser) {
      setStudentName(currentUser.name);
    } else {
      const user = getCurrentUser();
      setStudentName(user.name);
    }
  }, [currentUser, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-experr-50 to-accent-cyan/20 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-experr-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCollegeId) {
      selectCollege(selectedCollegeId);
      navigate('/campus-arena');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-experr-50 to-accent-cyan/20 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-experr-100 dark:bg-experr-900/20 rounded-full w-fit">
            <Trophy className="h-8 w-8 text-experr-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Enter Your Campus Arena</CardTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join college competitions and compete with peers
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* College Search */}
            <div>
              <label className="block text-sm font-medium mb-2">
                College / University
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 focus:ring-2 focus:ring-experr-500 focus:border-transparent"
                />
              </div>

              {/* College Options */}
              <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                {filteredColleges.map((college) => (
                  <button
                    key={college.id}
                    type="button"
                    onClick={() => setSelectedCollegeId(college.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedCollegeId === college.id
                        ? 'border-experr-500 bg-experr-50 dark:bg-experr-900/20'
                        : 'border-gray-200 dark:border-dark-600 hover:border-experr-300 dark:hover:border-experr-700'
                    }`}
                  >
                    <div className="font-medium">{college.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{college.location}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Student Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 focus:ring-2 focus:ring-experr-500 focus:border-transparent"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <CreditCard className="inline h-4 w-4 mr-1" />
                Student ID <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 focus:ring-2 focus:ring-experr-500 focus:border-transparent"
                placeholder="e.g., 2021CS001"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={!selectedCollegeId}
            >
              Enter Campus Arena
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampusSelection;