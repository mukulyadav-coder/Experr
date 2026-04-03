import React from 'react';
import { Card } from '../ui/Card';
import { ExternalLink } from 'lucide-react';

export default function ProjectsTab({ projects = [] }) {
  if (!projects || projects.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500 dark:text-gray-400">No projects added yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{project.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{project.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.tech?.map((tech) => (
                  <span key={tech} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-dark-700 dark:text-gray-200">{tech}</span>
                ))}
              </div>
            </div>
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-experr-600 hover:text-experr-800">
                View <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
