import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function SubmissionsTab({ submissions = [] }) {
  if (!submissions || submissions.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500 dark:text-gray-400">No submissions found yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((sub) => {
        const isAccepted = sub.status === 'accepted';
        const isRejected = sub.status === 'rejected';
        return (
          <Card key={sub.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{sub.title || sub.task_title || 'Untitled Submission'}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(sub.created_at).toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{sub.description || sub.task_description || 'No description available'}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${isAccepted ? 'bg-green-100 text-green-700' : isRejected ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {isAccepted ? <CheckCircle className="h-3 w-3" /> : isRejected ? <AlertCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {sub.status}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{sub.language || 'Unknown language'}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
