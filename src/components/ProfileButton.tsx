import { Star } from 'lucide-react';
import { getUserProfile } from '@/services/storage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ProfileButtonProps {
  onOpenChange?: (open: boolean) => void;
}

export function ProfileButton({ onOpenChange }: ProfileButtonProps) {
  const profile = getUserProfile();
  
  const renderStars = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalf = score % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < 10; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-muted-foreground/30" />
        );
      }
    }
    return stars;
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🐻</span>
          <span className="text-lg font-semibold text-foreground">Test_User</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🐻</span>
            Your Learning Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-primary">{profile.totalPractices}</p>
              <p className="text-sm text-muted-foreground">Total Practices</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-primary">{profile.averageScore.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Average Performance</p>
            <div className="flex gap-1">
              {renderStars(profile.averageScore)}
            </div>
          </div>

          {profile.practiceHistory.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Recent Practice</p>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {profile.practiceHistory.slice(-5).reverse().map((result, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-secondary/30 rounded-lg p-3">
                    <div>
                      <p className="font-medium text-foreground">{result.word}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(result.date).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-foreground">{result.score}/{result.totalQuestions}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.totalPractices === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <p>No practice sessions yet.</p>
              <p className="text-sm">Search for a word and practice to get started!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
