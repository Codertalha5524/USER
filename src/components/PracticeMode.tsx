import { useState } from 'react';
import { ArrowRight, Check, X, Star, Trophy, RotateCcw } from 'lucide-react';
import type { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PracticeModeProps {
  questions: Question[];
  word: string;
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}

export function PracticeMode({ questions, word, onComplete, onBack }: PracticeModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];

  const checkAnswer = () => {
    if (isAnswered) return;

    let isCorrect = false;
    
    if (currentQuestion.type === 'fill_blank') {
      isCorrect = textAnswer.toLowerCase().trim() === 
        String(currentQuestion.correctAnswer).toLowerCase().trim();
    } else {
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    }

    if (isCorrect) {
      setScore(s => s + 1);
    }
    
    setIsAnswered(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setTextAnswer('');
      setIsAnswered(false);
    } else {
      setIsComplete(true);
      onComplete(score + (isAnswered && isCorrectAnswer() ? 1 : 0), questions.length);
    }
  };

  const isCorrectAnswer = () => {
    if (currentQuestion.type === 'fill_blank') {
      return textAnswer.toLowerCase().trim() === 
        String(currentQuestion.correctAnswer).toLowerCase().trim();
    }
    return selectedAnswer === currentQuestion.correctAnswer;
  };

  const renderStars = (count: number, total: number) => {
    const stars = [];
    const ratio = count / total * 10;
    
    for (let i = 0; i < 10; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-8 h-8 ${i < Math.round(ratio) 
            ? 'fill-[hsl(45,100%,51%)] text-[hsl(45,100%,51%)]' 
            : 'text-muted-foreground/30'}`} 
        />
      );
    }
    return stars;
  };

  if (isComplete) {
    const finalScore = score;
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="glass-card rounded-2xl p-8 text-center space-y-6">
          <Trophy className="w-20 h-20 mx-auto text-[hsl(45,100%,51%)]" />
          <h2 className="text-3xl font-bold text-foreground font-['Poppins']">
            Practice Complete!
          </h2>
          <p className="text-xl text-muted-foreground">
            You practiced: <span className="font-semibold text-foreground">{word}</span>
          </p>
          
          <div className="py-4">
            <p className="text-5xl font-bold text-primary mb-2">
              {finalScore}/{questions.length}
            </p>
            <div className="flex justify-center gap-1">
              {renderStars(finalScore, questions.length)}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Back to Word
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl p-6 space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[hsl(45,100%,51%)] text-[hsl(45,100%,51%)]" />
            <span className="font-semibold text-foreground">{score}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="py-4">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {currentQuestion.type.replace('_', ' ')}
          </span>
          <h3 className="text-xl font-semibold text-foreground mt-2 font-['Poppins']">
            {currentQuestion.question}
          </h3>
          {currentQuestion.hint && (
            <p className="text-sm text-muted-foreground mt-1">
              Hint: {currentQuestion.hint}
            </p>
          )}
        </div>

        {/* Answer Options */}
        {currentQuestion.type === 'fill_blank' ? (
          <div className="space-y-4">
            <Input
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your answer..."
              disabled={isAnswered}
              className="text-lg h-14"
              onKeyDown={(e) => e.key === 'Enter' && !isAnswered && checkAnswer()}
            />
            {isAnswered && (
              <div className={`p-3 rounded-lg ${isCorrectAnswer() 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'}`}>
                {isCorrectAnswer() ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-5 h-5" /> Correct!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <X className="w-5 h-5" /> 
                    Correct answer: {currentQuestion.correctAnswer}
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {currentQuestion.options?.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQuestion.correctAnswer;
              
              let buttonClass = 'w-full p-4 text-left rounded-xl border-2 transition-all ';
              
              if (isAnswered) {
                if (isCorrect) {
                  buttonClass += 'bg-green-100 border-green-500 text-green-800';
                } else if (isSelected && !isCorrect) {
                  buttonClass += 'bg-red-100 border-red-500 text-red-800';
                } else {
                  buttonClass += 'bg-secondary/50 border-transparent text-muted-foreground';
                }
              } else {
                buttonClass += isSelected 
                  ? 'bg-primary/10 border-primary text-foreground' 
                  : 'bg-secondary/50 border-transparent hover:bg-secondary text-foreground';
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isAnswered && setSelectedAnswer(idx)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-sm font-semibold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                    {isAnswered && isCorrect && (
                      <Check className="w-5 h-5 ml-auto text-green-600" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <X className="w-5 h-5 ml-auto text-red-600" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          {!isAnswered ? (
            <Button 
              onClick={checkAnswer} 
              className="flex-1"
              disabled={
                currentQuestion.type === 'fill_blank' 
                  ? !textAnswer.trim() 
                  : selectedAnswer === null
              }
            >
              Check Answer
            </Button>
          ) : (
            <Button onClick={nextQuestion} className="flex-1">
              {currentIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                'See Results'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
