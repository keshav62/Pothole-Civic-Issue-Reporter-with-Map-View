import { useState } from 'react';
import { mockIssues } from '../../data/mockIssues';
import { currentWorker } from '../../data/mockUsers';
import { Link } from 'react-router-dom';
import { MapPin, Filter } from 'lucide-react';
import IssueStatus from '../../components/issues/IssueStatus';
import { cn } from '../../utils/cn';

const AssignedTasks = () => {
  const [filter, setFilter] = useState('all');
  
  const myIssues = mockIssues.filter(i => i.assignedTo === currentWorker.id);
  
  const filteredIssues = myIssues.filter(issue => {
    if (filter === 'all') return true;
    return issue.status === filter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Assigned Tasks</h1>
          <p className="text-gray-500 mt-1">Manage and update the issues assigned to you.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
          <Filter className="w-4 h-4 text-gray-500" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
          >
            <option value="all">All Tasks</option>
            <option value="assigned">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((task) => (
            <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              {task.images?.before?.[0] && (
                <div className="h-48 w-full bg-gray-200 relative">
                  <img 
                    src={task.images.before[0]} 
                    alt={task.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={cn(
                      "text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md bg-white/90",
                      task.priority === 'High' ? "text-red-700" :
                      task.priority === 'Medium' ? "text-amber-700" :
                      "text-blue-700"
                    )}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500">{task.id}</span>
                  <IssueStatus status={task.status} />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{task.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{task.description}</p>
                
                <div className="flex items-start gap-2 text-gray-500 mt-auto pt-4 border-t border-gray-100">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-xs">{task.location.address}</span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <Link 
                  to={`/worker/tasks/${task.id}`}
                  className="flex items-center justify-center w-full py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  Manage Task
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
            <p className="text-gray-500">There are no tasks matching your current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedTasks;
