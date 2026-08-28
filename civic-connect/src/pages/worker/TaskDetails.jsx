import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockIssues } from '../../data/mockIssues';
import IssueStatus from '../../components/issues/IssueStatus';
import { ArrowLeft, MapPin, Calendar, UploadCloud, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  
  // Form states
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const foundTask = mockIssues.find(i => i.id === id);
    if (foundTask) {
      setTask(foundTask);
      setStatus(foundTask.status);
    }
  }, [id]);

  if (!task) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Loading task details...</p>
      </div>
    );
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a fake URL for the uploaded image preview
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app we'd update the backend here
      // For the mock, we'll just navigate back to tasks
      setIsSubmitting(false);
      navigate('/worker/tasks');
    }, 1000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24">
      <Link 
        to="/worker/tasks" 
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tasks
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Task Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-500">{task.id}</span>
                  <IssueStatus status={task.status} />
                  <span className={cn(
                    "text-xs font-semibold px-2.5 py-1 rounded-full",
                    task.priority === 'High' ? "bg-red-100 text-red-700" :
                    task.priority === 'Medium' ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {task.priority}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
              </div>
            </div>
            
            {task.images?.before?.[0] && (
              <div className="w-full h-64 bg-gray-100">
                <img 
                  src={task.images.before[0]} 
                  alt="Issue before repair"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-900">{task.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
                  <div className="flex items-start gap-2 text-gray-900">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{task.location.address}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Reported On</h3>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Update Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Update Task Status</h2>
            
            <div className="space-y-5">
              {/* Status Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {['assigned', 'in-progress', 'resolved'].map((s) => (
                    <label 
                      key={s}
                      className={cn(
                        "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                        status === s ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <input 
                        type="radio" 
                        name="status"
                        value={s}
                        checked={status === s}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="flex items-center gap-2 text-sm font-medium text-gray-900 capitalize">
                        {s === 'resolved' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                        {s === 'in-progress' && <Clock className="w-4 h-4 text-blue-600" />}
                        {s === 'assigned' && <Clock className="w-4 h-4 text-amber-600" />}
                        {s.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Evidence Upload (Shown if resolving) */}
              {status === 'resolved' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Proof (After Photo)
                  </label>
                  
                  {uploadedImage ? (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={uploadedImage} alt="Uploaded proof" className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer px-4 py-2 bg-white text-sm font-medium text-gray-900 rounded-lg shadow-sm hover:bg-gray-50">
                          Change Image
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Notes (Optional)
                </label>
                <textarea 
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add details about the work done..."
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || (status === 'resolved' && !uploadedImage)}
                className="w-full py-3 px-4 flex justify-center items-center gap-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Save Update
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
