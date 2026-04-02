import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';

const CompetitionItem = ({ competition, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-4 border border-gray-200 dark:border-dark-600 rounded-lg hover:border-experr-300 dark:hover:border-experr-700 transition-colors cursor-pointer"
      onClick={() => onClick(competition.id)}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="font-semibold">{competition.title}</h3>
          <Badge variant={
            competition.difficulty === 'Easy' ? 'success' :
            competition.difficulty === 'Medium' ? 'warning' : 'danger'
          }>
            {competition.difficulty}
          </Badge>
          <Badge variant={competition.status === 'active' ? 'primary' : 'outline'}>
            {competition.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {competition.description}
        </p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {competition.participants} participants
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Due {new Date(competition.deadline).toLocaleDateString()}
          </span>
        </div>
      </div>
      <Button variant="ghost" size="sm">
        View Details
      </Button>
    </motion.div>
  );
};

export default CompetitionItem;