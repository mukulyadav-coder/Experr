// Mock data for Experr application

export const userProfile = {
    name: "Alex Dev",
    role: "Aspiring Software Engineer",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    employabilityScore: 85,
    completedTasks: 12,
    activeSimulations: 2,
    feedbackReceived: 8,
    totalCoinsEarned: 620,
};

export const currentSimulation = {
    id: "sim-1",
    title: "Frontend Optimization",
    role: "Software Engineer",
    company: "Stripe",
    progress: 65,
};

export const upcomingDeadlines = [
    { id: 1, title: "API Integration Task", date: "Today, 5:00 PM", status: "urgent" },
    { id: 2, title: "Code Review Simulation", date: "Tomorrow", status: "pending" },
    { id: 3, title: "Database Schema Design", date: "In 3 days", status: "pending" },
];

export const activityFeed = [
    { id: 101, type: "assignment", message: "New Task Assigned: Implement JWT Authentication", time: "2 hours ago" },
    { id: 102, type: "feedback", message: "Senior Engineer left feedback on your Component Architecture", time: "5 hours ago" },
    { id: 103, type: "completion", message: "Successfully completed: Responsive Dashboard Layout", time: "1 day ago" },
];

export const performanceData = [
    { name: 'Week 1', score: 65 },
    { name: 'Week 2', score: 68 },
    { name: 'Week 3', score: 74 },
    { name: 'Week 4', score: 79 },
    { name: 'Week 5', score: 85 },
];

export const mockTasks = [
    {
        id: "task-101",
        title: "Implement JWT Authentication",
        role: "Backend Engineer",
        difficulty: "Medium",
        deadline: "2024-05-15",
        description: `## Task Description
Your team is migrating from session-based authentication to JWTs. 

You need to implement the \`generateToken\` and \`verifyToken\` middleware functions for the Express API.

### Requirements:
1. Use \`jsonwebtoken\` library.
2. Sign the token with an expiration of 1 hour.
3. The payload should include the \`userId\` and \`role\`.
4. The verify middleware should return a 401 if the token is missing, and 403 if it's invalid.

### Resources
*   [JWT Documentation](https://jwt.io/introduction)
*   [Express Middleware Guide](#)
`,
        starterCode: `const jwt = require('jsonwebtoken');\n\nfunction generateToken(user) {\n  // Implement token generation\n}\n\nfunction verifyToken(req, res, next) {\n  // Implement verification middleware\n}\n\nmodule.exports = { generateToken, verifyToken };`,
        status: "todo",
        company: "Netflix",
        estimatedTime: "45 mins"
    },
    {
        id: "task-102",
        title: "Fix Race Condition in Cart State",
        role: "Frontend Engineer",
        difficulty: "Hard",
        deadline: "2024-05-12",
        description: `## Task Description
Users are reporting that quick successive clicks on the 'Add to Cart' button result in incorrect total quantities. This is a classic race condition in React state management.

### Requirements:
1. Identify the race condition in the code
2. Implement proper state management (use a queue or mutex pattern)
3. Ensure atomic cart updates
4. Write tests for concurrent operations

### Resources
*   [React State Management Best Practices](https://react.dev)
*   [Atomic Operations in JavaScript](#)
`,
        starterCode: `// Fix the React state updates\nconst addToCart = async (item) => {\n  setCartItems([...cartItems, item]);\n  await updateDatabase(item);\n};`,
        status: "in-progress",
        company: "Airbnb",
        estimatedTime: "60 mins"
    },
    {
        id: "task-103",
        title: "Design Database Schema for E-commerce",
        role: "Database Engineer",
        difficulty: "Medium",
        deadline: "2024-05-20",
        description: `## Task Description
Design a scalable MySQL database schema for an e-commerce platform supporting millions of transactions.

### Requirements:
1. Create tables for Users, Products, Orders, and OrderItems
2. Implement proper indexing for performance
3. Add appropriate constraints and relationships
4. Design for scalability and replication

### Resources
*   [Database Design Patterns](#)
*   [MySQL Best Practices](#)
`,
        starterCode: `-- Create your database schema here\nCREATE TABLE users (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  -- Add columns\n);\n`,
        status: "todo",
        company: "Amazon",
        estimatedTime: "90 mins"
    },
    {
        id: "task-104",
        title: "Build Responsive Dashboard Component",
        role: "Frontend Engineer",
        difficulty: "Easy",
        deadline: "2024-05-10",
        description: `## Task Description
Create a fully responsive dashboard component that works on mobile, tablet, and desktop devices.

### Requirements:
1. Mobile-first responsive design
2. Touch-friendly interactions
3. Accessibility (WCAG 2.1 AA compliance)
4. Performance optimized (LCP < 2.5s)

### Resources
*   [Responsive Design Guide](#)
*   [Tailwind CSS Responsive Utilities](#)
`,
        starterCode: `import React from 'react';\n\nexport default function Dashboard() {\n  // Build your responsive dashboard\n  return (\n    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">\n      {/* Add components */}\n    </div>\n  );\n}`,
        status: "todo",
        company: "Stripe",
        estimatedTime: "120 mins"
    },
    {
        id: "task-105",
        title: "Implement Search Algorithm Optimization",
        role: "Backend Engineer",
        difficulty: "Hard",
        deadline: "2024-05-25",
        description: `## Task Description
Optimize the search algorithm for a document retrieval system to handle 10M+ documents with sub-second response times.

### Requirements:
1. Implement full-text search indexing
2. Optimize query execution
3. Add relevance ranking
4. Implement pagination efficiently

### Resources
*   [Elasticsearch Guide](#)
*   [Query Optimization Techniques](#)
`,
        starterCode: `const searchDocuments = (query, limit = 20) => {\n  // Implement optimized search\n  // Expected response time: < 100ms\n};\n\nmodule.exports = { searchDocuments };`,
        status: "todo",
        company: "Google",
        estimatedTime: "150 mins"
    },
    {
        id: "task-106",
        title: "Create Testing Suite for Payment API",
        role: "QA Engineer",
        difficulty: "Medium",
        deadline: "2024-05-18",
        description: `## Task Description
Write comprehensive unit and integration tests for the payment processing API.

### Requirements:
1. 80%+ code coverage
2. Test success and failure scenarios
3. Mock external payment providers
4. Test edge cases and error handling

### Resources
*   [Jest Testing Framework](#)
*   [API Testing Best Practices](#)
`,
        starterCode: `describe('Payment API', () => {\n  it('should process payment successfully', () => {\n    // Write your test\n  });\n\n  it('should handle payment failures', () => {\n    // Write your test\n  });\n});\n`,
        status: "todo",
        company: "Square",
        estimatedTime: "75 mins"
    },
    {
        id: "task-107",
        title: "Refactor Legacy Code to Modern Architecture",
        role: "Software Engineer",
        difficulty: "Hard",
        deadline: "2024-05-22",
        description: `## Task Description
Refactor a legacy monolithic application to use modern microservices architecture.

### Requirements:
1. Break down into independent services
2. Implement API gateways
3. Setup service communication
4. Deploy with Docker containers

### Resources
*   [Microservices Architecture Guide](#)
*   [Docker & Kubernetes Basics](#)
`,
        starterCode: `// Service 1\nconst userService = require('./services/user-service');\n// Implement service structure\n`,
        status: "todo",
        company: "Uber",
        estimatedTime: "240 mins"
    },
    {
        id: "task-108",
        title: "Implement Real-time Notification System",
        role: "DevOps Engineer",
        difficulty: "Medium",
        deadline: "2024-05-16",
        description: `## Task Description
Build a scalable real-time notification system using WebSockets and message queues.

### Requirements:
1. WebSocket implementation
2. Message queue (Redis/RabbitMQ)
3. Horizontal scaling support
4. Delivery guarantees

### Resources
*   [Socket.io Documentation](#)
*   [Message Queue Patterns](#)
`,
        starterCode: `const io = require('socket.io')(server);\n\nio.on('connection', (socket) => {\n  // Implement notification handling\n});\n`,
        status: "todo",
        company: "Slack",
        estimatedTime: "120 mins"
    }
];

export const mockSubmissions = [
    {
        id: "sub-001",
        taskId: "task-101",
        taskTitle: "Implement JWT Authentication",
        company: "Netflix",
        status: "approved",
        submittedDate: "2024-05-10",
        reviewedDate: "2024-05-11",
        coins: 150,
        feedback: "Excellent implementation! Your JWT middleware is clean and follows all best practices. Great error handling and validation.",
        reviewer: "Senior Engineer - Sarah Chen",
        reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        codeQuality: 95,
        functionality: 90,
        documentation: 88,
    },
    {
        id: "sub-002",
        taskId: "task-102",
        taskTitle: "Fix Race Condition in Cart State",
        company: "Airbnb",
        status: "rejected",
        submittedDate: "2024-05-09",
        reviewedDate: "2024-05-10",
        coins: 0,
        feedback: "The race condition solution is incomplete and doesn't fully handle concurrent updates. Consider using Redux with middleware or useReducer for proper state management. Resubmit after revisions.",
        reviewer: "Senior Engineer - James Wilson",
        reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        codeQuality: 65,
        functionality: 60,
        documentation: 55,
    },
    {
        id: "sub-003",
        taskId: "task-104",
        taskTitle: "Build Responsive Dashboard Component",
        company: "Stripe",
        status: "approved",
        submittedDate: "2024-05-05",
        reviewedDate: "2024-05-06",
        coins: 130,
        feedback: "Very solid responsive design! The mobile-first approach is well implemented. Accessibility is great! Nice animations for micro-interactions.",
        reviewer: "Senior Engineer - Emma Rodriguez",
        reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
        codeQuality: 90,
        functionality: 90,
        documentation: 82,
    },
    {
        id: "sub-004",
        taskId: "task-103",
        taskTitle: "Design Database Schema for E-commerce",
        company: "Amazon",
        status: "approved",
        submittedDate: "2024-04-28",
        reviewedDate: "2024-04-29",
        coins: 140,
        feedback: "Excellent schema design with proper indexing strategy. Your normalization decisions are sound. Consider adding audit columns for compliance.",
        reviewer: "Senior Engineer - Michael Zhang",
        reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        codeQuality: 88,
        functionality: 88,
        documentation: 80,
    },
    {
        id: "sub-005",
        taskId: "task-105",
        taskTitle: "Implement Search Algorithm Optimization",
        company: "Google",
        status: "rejected",
        submittedDate: "2024-05-12",
        reviewedDate: "2024-05-13",
        coins: 0,
        feedback: "The search implementation doesn't meet the performance requirements. Response times exceed 100ms threshold. Optimize your indexing strategy and consider Elasticsearch. Please resubmit.",
        reviewer: "Senior Engineer - David Park",
        reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        codeQuality: 70,
        functionality: 65,
        documentation: 72,
    },
    {
        id: "sub-006",
        taskId: "task-106",
        taskTitle: "Create Testing Suite for Payment API",
        company: "Square",
        status: "approved",
        submittedDate: "2024-05-08",
        reviewedDate: "2024-05-09",
        coins: 160,
        feedback: "Comprehensive test coverage! Your test cases cover all edge cases and error scenarios. Great use of mocking external dependencies. Best submission this week!",
        reviewer: "Senior Engineer - Lisa Parker",
        reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
        codeQuality: 92,
        functionality: 92,
        documentation: 85,
    },
];
