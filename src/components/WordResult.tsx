import { Info, BookOpen } from 'lucide-react';
import type { WordData } from '@/types';
import { Button } from '@/components/ui/button';

interface WordResultProps {
  wordData: WordData;
  onPractice: () => void;
  isPracticeLoading: boolean;
}

export function WordResult({ wordData, onPractice, isPracticeLoading }: WordResultProps) {
  return (
    <div className="w-full max-w-xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Word Info Section */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-foreground flex items-center justify-center flex-shrink-0">
          <Info className="w-5 h-5 text-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Informationen über das Wort
        </h2>
      </div>

      {/* Article */}
      {wordData.article && (
        <div className="flex items-center gap-2 pl-2">
          <span className="text-xl font-bold text-foreground">
            Artikel: {wordData.article.charAt(0).toUpperCase() + wordData.article.slice(1)}
          </span>
          <div className="w-6 h-6 rounded-full border-2 border-foreground flex items-center justify-center">
            <Info className="w-3 h-3 text-foreground" />
          </div>
        </div>
      )}

      {/* Dictionary Meaning */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
        <h3 className="text-xl font-bold text-foreground mb-3">Sözlük Anlamı</h3>
        <div className="space-y-2">
          <p className="text-foreground">
            <span className="font-semibold">Türkçe:</span> {wordData.turkishMeaning}
          </p>
          <p className="text-foreground">
            <span className="font-semibold">English:</span> {wordData.englishMeaning}
          </p>
          {wordData.partOfSpeech && (
            <p className="text-muted-foreground text-sm">
              ({wordData.partOfSpeech})
            </p>
          )}
        </div>
      </div>

      {/* Example Sentences Card */}
      <div className="bg-[#5BB5D1]/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-foreground">5 örnek cümle</h3>
          <div className="w-6 h-6 rounded-full border-2 border-foreground/70 flex items-center justify-center">
            <Info className="w-3 h-3 text-foreground/70" />
          </div>
        </div>
        <div className="space-y-2">
          {wordData.exampleSentences.map((sentence, idx) => (
            <div key={idx}>
              <p className="font-semibold text-foreground">
                {idx + 1}-{sentence.german}
              </p>
              <p className="text-foreground/80">
                ({sentence.turkish})
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Button */}
      <Button 
        onClick={onPractice}
        disabled={isPracticeLoading}
        size="lg"
        className="w-full rounded-xl font-semibold text-lg h-14 mt-4"
      >
        <BookOpen className="w-5 h-5 mr-2" />
        {isPracticeLoading ? 'Sorular hazırlanıyor...' : 'Bu Kelimeyi Çalış'}
      </Button>
    </div>
  );
}
