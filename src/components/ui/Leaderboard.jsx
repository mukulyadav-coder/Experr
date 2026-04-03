import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const Leaderboard = ({ entries, currentUserName, showVerification = true }) => {
  return (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <motion.div
          key={entry.rank}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center justify-between p-3 rounded-lg ${
            entry.rank <= 3 ? 'bg-gradient-to-r from-experr-50 to-accent-cyan/20 dark:from-experr-900/20 dark:to-accent-cyan/10' : ''
          } ${entry.name === currentUserName ? 'ring-2 ring-experr-500' : ''}`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              entry.rank === 1 ? 'bg-yellow-500 text-white' :
              entry.rank === 2 ? 'bg-gray-400 text-white' :
              entry.rank === 3 ? 'bg-amber-600 text-white' :
              'bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-gray-300'
            }`}>
              {entry.rank}
            </div>
            <div>
              <p className="font-medium">{entry.name}</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">0 pts</span>
                {showVerification && entry.isVerified && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-experr-600">{entry.coins}</p>
            <p className="text-xs text-gray-500">coins</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Leaderboard;