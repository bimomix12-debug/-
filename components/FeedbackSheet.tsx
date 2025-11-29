import React from 'react';
import { Button } from './Button';
import { CheckCircle, XCircle } from 'lucide-react';

interface FeedbackSheetProps {
  status: 'correct' | 'incorrect' | null;
  correctAnswer?: string;
  explanation?: string;
  onContinue: () => void;
}

export const FeedbackSheet: React.FC<FeedbackSheetProps> = ({ status, correctAnswer, explanation, onContinue }) => {
  if (!status) return null;

  const isCorrect = status === 'correct';

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-6 z-50 animate-slide-up border-t-2 ${isCorrect ? 'bg-[#d7ffb8] border-[#b8f28b]' : 'bg-[#ffdfe0] border-[#ffc1c1]'}`}>
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <div className="flex items-start gap-3">
          {isCorrect ? (
            <CheckCircle className="w-8 h-8 text-[#58cc02] shrink-0" />
          ) : (
            <XCircle className="w-8 h-8 text-[#ff4b4b] shrink-0" />
          )}
          
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-1 ${isCorrect ? 'text-[#58cc02]' : 'text-[#ff4b4b]'}`}>
              {isCorrect ? 'أحسنت! (Excellent!)' : 'إجابة خاطئة (Incorrect)'}
            </h3>
            {!isCorrect && (
              <div className="text-gray-700 mb-2">
                <p className="font-bold text-sm text-gray-500 uppercase mb-1">الحل الصحيح:</p>
                <p className="text-lg">{correctAnswer}</p>
              </div>
            )}
            {explanation && (
              <div className="text-gray-600 text-sm mt-2 p-2 bg-white/50 rounded-lg">
                <span className="font-bold">ملاحظة:</span> {explanation}
              </div>
            )}
          </div>
        </div>
        
        <Button 
          onClick={onContinue} 
          variant={isCorrect ? 'primary' : 'danger'} 
          fullWidth
        >
          تابع (Continue)
        </Button>
      </div>
    </div>
  );
};