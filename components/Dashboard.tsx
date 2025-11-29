import React from 'react';
import { TOPICS } from '../constants';
import { TopicConfig, UserState } from '../types';
import { Star, Heart, Flame } from 'lucide-react';

interface DashboardProps {
  userState: UserState;
  onSelectTopic: (topic: TopicConfig) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userState, onSelectTopic }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-gray-200 p-4 flex justify-between items-center text-gray-500 font-bold">
        <div className="flex items-center gap-1 text-orange-500">
          <Flame fill="currentColor" /> <span>{userState.streak}</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star fill="currentColor" /> <span>{userState.xp}</span>
        </div>
        <div className="flex items-center gap-1 text-red-500">
          <Heart fill="currentColor" /> <span>{userState.hearts}</span>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-20">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-700">اختر درساً</h1>
          <p className="text-gray-400">Choose a lesson to start</p>
        </div>

        <div className="flex flex-col items-center gap-6">
          {TOPICS.map((topic, index) => {
            const isCompleted = userState.completedLessons.includes(topic.id);
            // Simple logic to stagger icons like a path
            const offset = index % 2 === 0 ? 'translate-x-0' : 'translate-x-0'; 
            
            return (
              <button
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className={`group relative flex flex-col items-center gap-2 transition-transform hover:scale-105 ${offset}`}
              >
                {/* Connector Line (simplified) */}
                {index < TOPICS.length - 1 && (
                  <div className="absolute top-16 w-1 h-12 bg-gray-200 -z-10 rounded-full" />
                )}

                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-[0_6px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1.5 transition-all ${isCompleted ? 'bg-yellow-400' : topic.color}`}>
                  {/* Icons are placeholders or lucide if available, using simple text first letter or generic icon here */}
                  <Star fill="white" className="w-10 h-10" />
                </div>
                <span className="font-bold text-gray-600 text-lg group-hover:text-blue-500">{topic.name}</span>
                {isCompleted && (
                   <span className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full border-2 border-white font-bold">
                     ✓
                   </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};