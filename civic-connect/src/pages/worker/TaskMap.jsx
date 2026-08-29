const TaskMap = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-8">
    <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
      <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    </div>
    <h2 className="text-xl font-bold text-gray-800 mb-2">Task Map</h2>
    <p className="text-gray-500 max-w-sm">Interactive map view of your assigned tasks will be displayed here.</p>
  </div>
);

export default TaskMap;
