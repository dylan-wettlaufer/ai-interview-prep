import DashboardHeader from "./components/DashboardHeader";
import { Mic, Zap, NotebookPen } from 'lucide-react';

export default function DashboardClient() {

  return (
    <div>
      <DashboardHeader />

      <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-neutral-900 h-screen w-screen">
        <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-gray-50">Welcome Dylan!</h2>
                <p className="text-gray-400">Ready to ace your next interview?</p>
            </div>
            <button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-colors duration-200 flex items-center gap-2">
            <Mic size={20} />
            Start New Interview
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-neutral-800 rounded-lg p-6 shadow-lg border border-neutral-700 transform hover:-translate-y-1 transition-transform duration-200">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-indigo-500/20 p-3 rounded-full text-indigo-400">
                        <Zap size={24} />
                    </div>
                    <h1 className="text-lg font-semibold text-gray-50">Quick Actions</h1>
                </div>
                <div className="flex flex-col gap-4">
                    <button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-colors duration-200 flex items-center gap-2">
                        <Mic size={16} />
                        Start New Interview
                    </button>
                    <button className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-colors duration-200 flex items-center gap-2">
                        <NotebookPen size={16} />
                        Create New Interview Plan
                    </button>
                </div>
            </div>    
        </div>
      </div>

    </div>
  );
}
