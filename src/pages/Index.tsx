import { useState } from 'react';
import { TimeDisplay } from '@/components/TimeDisplay';
import { SearchBar } from '@/components/SearchBar';
import { WordResult } from '@/components/WordResult';
import { PracticeMode } from '@/components/PracticeMode';
import { GermanChat } from '@/components/GermanChat';
import { lookupWord, generatePracticeQuestions } from '@/services/gemini';
import { savePracticeResult } from '@/services/storage';
import type { WordData, Question } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Info } from 'lucide-react';
import mountainBg from '@/assets/mountain-bg.jpg';

type ViewMode = 'search' | 'result' | 'practice';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPracticeLoading, setIsPracticeLoading] = useState(false);
  const [searchedWord, setSearchedWord] = useState('');
  const { toast } = useToast();

  const handleSearch = async (word: string) => {
    setIsSearching(true);
    setSearchedWord(word);
    try {
      const data = await lookupWord(word);
      setWordData(data);
      setViewMode('result');
    } catch (error) {
      toast({
        title: 'Hata',
        description: error instanceof Error ? error.message : 'Kelime bulunamadı',
        variant: 'destructive'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartPractice = async () => {
    if (!wordData) return;
    setIsPracticeLoading(true);
    try {
      const q = await generatePracticeQuestions(wordData);
      setQuestions(q);
      setViewMode('practice');
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Sorular oluşturulamadı',
        variant: 'destructive'
      });
    } finally {
      setIsPracticeLoading(false);
    }
  };

  const handlePracticeComplete = (score: number, total: number) => {
    if (wordData) {
      savePracticeResult({
        date: new Date().toISOString(),
        word: wordData.word,
        score,
        totalQuestions: total
      });
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${mountainBg})` }}
    >
      {/* Header */}
      <header className="relative z-10 flex items-center justify-center px-6 py-4">
        <TimeDisplay />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center px-4 py-8">
        {/* Search Bar - Always visible at top when in result view */}
        {viewMode === 'result' && (
          <div className="w-full max-w-2xl mb-8">
            <SearchBar 
              onSearch={handleSearch} 
              isLoading={isSearching}
              initialValue={searchedWord}
            />
          </div>
        )}

        {viewMode === 'search' && (
          <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
            <SearchBar onSearch={handleSearch} isLoading={isSearching} />
          </div>
        )}

        {viewMode === 'result' && wordData && (
          <div className="w-full flex justify-start pl-4 md:pl-12">
            <WordResult 
              wordData={wordData} 
              onPractice={handleStartPractice}
              isPracticeLoading={isPracticeLoading}
            />
          </div>
        )}

        {viewMode === 'practice' && wordData && (
          <PracticeMode 
            questions={questions}
            word={wordData.word}
            onComplete={handlePracticeComplete}
            onBack={() => setViewMode('result')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-3">
        <button className="w-8 h-8 rounded-full border-2 border-foreground/50 flex items-center justify-center hover:border-foreground transition-colors">
          <Info className="w-4 h-4 text-foreground/50 hover:text-foreground" />
        </button>
        <span className="text-sm text-foreground/70 font-medium">
          Progress coded v1.0-alpha norelease
        </span>
        <div className="w-8" /> {/* Spacer for balance */}
      </footer>

      {/* Chat Widget */}
      <GermanChat />
    </div>
  );
};

export default Index;
