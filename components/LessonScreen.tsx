import React, { useState, useEffect } from 'react';
import { Question, QuestionType, TopicConfig } from '../types';
import { generateLessonContent } from '../services/geminiService';
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';
import { FeedbackSheet } from './FeedbackSheet';
import { X, Volume2 } from 'lucide-react';

interface LessonScreenProps {
  topic: TopicConfig;
  onExit: () => void;
  onComplete: (xp: number) => void;
  onLoseHeart: () => void;
  hearts: number;
}

export const LessonScreen: React.FC<LessonScreenProps> = ({ topic, onExit, onComplete, onLoseHeart, hearts }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await generateLessonContent(topic.name, topic.level);
      setQuestions(data);
      setLoading(false);
    };
    load();
  }, [topic]);

  const playTTS = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleCheck = () => {
    if (!questions[currentIdx]) return;
    const q = questions[currentIdx];
    let isCorrect = false;

    if (q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.FILL_IN_BLANK) {
      isCorrect = selectedOption === q.correctAnswer;
    } else {
      const normalizedInput = textInput.trim().toLowerCase();
      const normalizedAnswer = q.correctAnswer.toLowerCase();
      const acceptables = q.acceptableAnswers?.map(a => a.toLowerCase()) || [];
      
      isCorrect = normalizedInput === normalizedAnswer || acceptables.includes(normalizedInput);
    }

    if (isCorrect) {
      setFeedbackStatus('correct');
      // Play success sound logic here
    } else {
      setFeedbackStatus('incorrect');
      onLoseHeart();
      // Play error sound logic here
    }
  };

  const handleContinue = () => {
    setFeedbackStatus(null);
    setSelectedOption(null);
    setTextInput('');

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      onComplete(15); // Award 15 XP
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <p className="text-gray-500 font-bold text-lg">جاري تحضير الدرس بواسطة الذكاء الاصطناعي...</p>
        <p className="text-gray-400 text-sm">Generating lesson...</p>
      </div>
    );
  }

  if (questions.length === 0) return <div>Error loading lesson.</div>;

  const currentQ = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  // Detect if question involves listening or speaking
  const isListening = currentQ.type === QuestionType.TRANSLATE_EN_TO_AR || currentQ.type === QuestionType.FILL_IN_BLANK;

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <button onClick={onExit} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <ProgressBar progress={progress} />
        <div className="flex items-center text-red-500 font-bold">
           <span className="mr-1">{hearts}</span> ❤️
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center max-w-lg mx-auto w-full">
        
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-8" dir="rtl">
          {currentQ.type === QuestionType.TRANSLATE_EN_TO_AR ? 'ترجم هذه الجملة' : 
           currentQ.type === QuestionType.MULTIPLE_CHOICE ? 'اختر الإجابة الصحيحة' :
           'أكمل الفراغ'}
        </h2>

        {/* Prompt / Bubble */}
        <div className="flex items-center gap-4 mb-8 w-full justify-center">
          {(isListening || currentQ.type === QuestionType.MULTIPLE_CHOICE) && (
            <button 
              onClick={() => playTTS(currentQ.prompt)}
              className="w-12 h-12 bg-[#1cb0f6] rounded-xl flex items-center justify-center text-white shadow-[0_4px_0_0_#1899d6] active:shadow-none active:translate-y-1 transition-all shrink-0"
            >
              <Volume2 />
            </button>
          )}
          
          <div className="border-2 border-gray-200 rounded-2xl p-4 relative w-fit">
            <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-b-2 border-l-2 border-gray-200 rotate-45"></span>
            <p className="text-xl font-medium text-gray-700">{currentQ.prompt}</p>
          </div>
        </div>

        {/* Inputs / Options */}
        <div className="w-full space-y-4">
          {(currentQ.type === QuestionType.MULTIPLE_CHOICE || currentQ.type === QuestionType.FILL_IN_BLANK) && currentQ.options ? (
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedOption(opt)}
                  className={`
                    p-4 rounded-xl border-2 cursor-pointer font-medium text-lg text-center transition-all
                    ${selectedOption === opt 
                      ? 'bg-blue-100 border-[#1cb0f6] text-[#1cb0f6]' 
                      : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-[0_2px_0_0_rgba(0,0,0,0.1)]'}
                  `}
                >
                  {opt}
                  {/* number shortcut could go here */}
                </div>
              ))}
            </div>
          ) : (
             <div className="w-full">
               <textarea
                dir="ltr"
                className="w-full p-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors resize-none"
                rows={3}
                placeholder="Type in English..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
               />
             </div>
          )}
        </div>
      </div>

      {/* Footer / Check Button */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <Button 
          fullWidth 
          variant="primary" 
          disabled={!selectedOption && textInput.length === 0}
          onClick={handleCheck}
        >
          تحقق (Check)
        </Button>
      </div>

      <FeedbackSheet 
        status={feedbackStatus} 
        correctAnswer={currentQ.correctAnswer}
        explanation={currentQ.explanation}
        onContinue={handleContinue} 
      />
    </div>
  );
};