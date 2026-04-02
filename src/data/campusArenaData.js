export const colleges = [
  { id: 'hrit', name: 'HRIT University', location: 'Ghaziabad, UP' },
  { id: 'iitd', name: 'IIT Delhi', location: 'Delhi' },
  { id: 'iitk', name: 'IIT Kanpur', location: 'Kanpur, UP' },
  { id: 'bits', name: 'BITS Pilani', location: 'Pilani, Rajasthan' },
  { id: 'vit', name: 'VIT Vellore', location: 'Vellore, TN' },
  { id: 'nsit', name: 'NSIT Delhi', location: 'Delhi' },
  { id: 'dtu', name: 'DTU Delhi', location: 'Delhi' },
  { id: 'jmi', name: 'Jamia Millia Islamia', location: 'Delhi' },
  { id: 'ipu', name: 'IP University', location: 'Delhi' },
  { id: 'amity', name: 'Amity University', location: 'Noida, UP' }
];

export const users = [
  {
    id: '1',
    name: 'Alex Dev',
    college: 'hrit',
    studentId: '2021CS001',
    isVerified: true,
    coins: 1250,
    score: 95
  },
  {
    id: '2',
    name: 'Sarah Chen',
    college: 'hrit',
    studentId: '2021CS002',
    isVerified: true,
    coins: 1100,
    score: 92
  },
  {
    id: '3',
    name: 'Mike Johnson',
    college: 'hrit',
    studentId: '2021CS003',
    isVerified: false,
    coins: 950,
    score: 88
  },
  {
    id: '4',
    name: 'Emma Wilson',
    college: 'iitd',
    studentId: '2021CS101',
    isVerified: true,
    coins: 1400,
    score: 98
  },
  {
    id: '5',
    name: 'Raj Patel',
    college: 'iitk',
    studentId: '2021CS201',
    isVerified: true,
    coins: 1300,
    score: 96
  }
];

export const competitions = [
  {
    id: 'comp1',
    title: 'Frontend Challenge: React Dashboard',
    description: 'Build a responsive dashboard component with charts and data visualization',
    college: 'hrit',
    difficulty: 'Medium',
    participants: 45,
    deadline: '2024-04-15',
    status: 'active',
    tasks: [
      'Create a responsive grid layout',
      'Implement data fetching and state management',
      'Add interactive charts using Recharts',
      'Ensure mobile-first design'
    ]
  },
  {
    id: 'comp2',
    title: 'Backend API: User Authentication',
    description: 'Design and implement a secure authentication system with JWT',
    college: 'hrit',
    difficulty: 'Hard',
    participants: 32,
    deadline: '2024-04-20',
    status: 'active',
    tasks: [
      'Set up Express.js server',
      'Implement user registration and login',
      'Add JWT token generation and validation',
      'Create middleware for protected routes'
    ]
  },
  {
    id: 'comp3',
    title: 'Full Stack: Task Management App',
    description: 'Complete MERN stack application for task management',
    college: 'iitd',
    difficulty: 'Hard',
    participants: 28,
    deadline: '2024-04-25',
    status: 'active',
    tasks: [
      'Design MongoDB schema',
      'Build RESTful API endpoints',
      'Create React frontend with CRUD operations',
      'Implement user authentication'
    ]
  },
  {
    id: 'comp4',
    title: 'Data Structures: Binary Tree Implementation',
    description: 'Implement various binary tree operations and algorithms',
    college: 'hrit',
    difficulty: 'Medium',
    participants: 67,
    deadline: '2024-04-10',
    status: 'completed',
    tasks: [
      'Implement basic tree operations (insert, delete, search)',
      'Add tree traversal methods (inorder, preorder, postorder)',
      'Implement balancing algorithms',
      'Add visualization for tree structure'
    ]
  }
];

export const leaderboard = [
  { rank: 1, name: 'Emma Wilson', college: 'IIT Delhi', score: 98, coins: 1400, isVerified: true },
  { rank: 2, name: 'Raj Patel', college: 'IIT Kanpur', score: 96, coins: 1300, isVerified: true },
  { rank: 3, name: 'Alex Dev', college: 'HRIT University', score: 95, coins: 1250, isVerified: true },
  { rank: 4, name: 'Sarah Chen', college: 'HRIT University', score: 92, coins: 1100, isVerified: true },
  { rank: 5, name: 'Mike Johnson', college: 'HRIT University', score: 88, coins: 950, isVerified: false },
  { rank: 6, name: 'Priya Sharma', college: 'NSIT Delhi', score: 85, coins: 900, isVerified: true },
  { rank: 7, name: 'David Kim', college: 'DTU Delhi', score: 82, coins: 850, isVerified: true },
  { rank: 8, name: 'Lisa Wang', college: 'BITS Pilani', score: 80, coins: 800, isVerified: true },
  { rank: 9, name: 'John Doe', college: 'VIT Vellore', score: 78, coins: 750, isVerified: false },
  { rank: 10, name: 'Maria Garcia', college: 'Jamia Millia Islamia', score: 75, coins: 700, isVerified: true }
];

// Helper functions
export const getCollegeById = (id) => colleges.find(college => college.id === id);

export const getUsersByCollege = (collegeId) => users.filter(user => user.college === collegeId);

export const getCompetitionsByCollege = (collegeId) => competitions.filter(comp => comp.college === collegeId);

export const getLeaderboardByCollege = (collegeId) => {
  return leaderboard
    .filter(entry => entry.college === getCollegeById(collegeId)?.name)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
};

export const getCurrentUser = () => {
  // Mock current user - in real app, get from auth context
  return users[0]; // Alex Dev
};
