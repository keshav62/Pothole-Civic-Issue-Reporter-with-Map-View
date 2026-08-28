import { currentWorker } from '../../data/mockUsers';
import { Mail, Phone, MapPin, Building2, Award } from 'lucide-react';

const WorkerProfile = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 pb-24">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Header Background */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-6">
            <div className="flex items-end gap-5">
              <img 
                src={currentWorker.avatar} 
                alt={currentWorker.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white shadow-md object-cover"
              />
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{currentWorker.name}</h1>
                <p className="text-indigo-600 font-medium">{currentWorker.department}</p>
              </div>
            </div>
            
            <div className="mb-2 sm:mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-lg border border-indigo-100">
                <Award className="w-4 h-4" />
                Field Worker
              </span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{currentWorker.completedTasksCount}</p>
              <p className="text-sm font-medium text-gray-500">Tasks Completed</p>
            </div>
            <div className="text-center border-l border-gray-100">
              <p className="text-3xl font-bold text-gray-900">{currentWorker.activeTasksCount}</p>
              <p className="text-sm font-medium text-gray-500">Active Tasks</p>
            </div>
          </div>
          
          {/* Details */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact & Assignment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Email Address</p>
                  <p className="text-sm">{currentWorker.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Phone Number</p>
                  <p className="text-sm">{currentWorker.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Assigned Ward</p>
                  <p className="text-sm">{currentWorker.assignedWard}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Department</p>
                  <p className="text-sm">{currentWorker.department}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
