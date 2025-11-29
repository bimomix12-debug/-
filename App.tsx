import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LessonScreen } from './components/LessonScreen';
import { UserState, TopicConfig } from './types';
import { INITIAL_HEARTS } from './constants';

function App() {
  const [view, setView] = useState<'dashboard' | 'lesson'>('dashboard');
  const [currentTopic, setCurrentTopic] = useState<TopicConfig | null>(null);
  
  const [userState, setUserState] = useState<UserState>({
    hearts: INITIAL_HEARTS,
    xp: 0,
    streak: 1,
    completedLessons: []
  });

  const handleSelectTopic = (topic: TopicConfig) => {
    if (userState.hearts <= 0) {
      alert("ليس لديك قلوب كافية! انتظر قليلاً أو تدرب لاستعادة القلوب. (Not enough hearts)");
      return;
    }
    setCurrentTopic(topic);
    setView('lesson');
  };

  const handleLessonExit = () => {
    if (confirm("هل أنت متأكد من الخروج؟ ستفقد تقدمك في هذا الدرس. (Are you sure?)")) {
      setView('dashboard');
      setCurrentTopic(null);
    }
  };

  const handleLessonComplete = (xpGained: number) => {
    setUserState(prev => ({
      ...prev,
      xp: prev.xp + xpGained,
      completedLessons: currentTopic ? [...prev.completedLessons, currentTopic.id] : prev.completedLessons
    }));
    // Simple celebration effect could be added here
    setTimeout(() => {
      setView('dashboard');
      setCurrentTopic(null);
    }, 500); // Small delay to let user see empty state if needed, or just switch
  };

  const handleLoseHeart = () => {
    setUserState(prev => {
      const newHearts = Math.max(0, prev.hearts - 1);
      if (newHearts === 0) {
        // Game Over logic
        setTimeout(() => {
            alert("لقد نفذت قلوبك! (Out of hearts!)");
            setView('dashboard');
            setCurrentTopic(null);
        }, 1500);
      }
      return { ...prev, hearts: newHearts };
    });
  };

  // Recover hearts slowly over time (simulation)
  useEffect(() => {
    const timer = setInterval(() => {
      setUserState(prev => {
        if (prev.hearts < INITIAL_HEARTS) {
          return { ...prev, hearts: prev.hearts + 1 };
        }
        return prev;
      });
    }, 60000 * 5); // Recover 1 heart every 5 minutes
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      {view === 'dashboard' ? (
        <Dashboard userState={userState} onSelectTopic={handleSelectTopic} />
      ) : currentTopic ? (
        <LessonScreen 
          topic={currentTopic} 
          onExit={handleLessonExit} 
          onComplete={handleLessonComplete}
          onLoseHeart={handleLoseHeart}
          hearts={userState.hearts}
        />
      ) : (
        <div>Error state</div>
      )}
    </Layout>
  );
}

export default App;