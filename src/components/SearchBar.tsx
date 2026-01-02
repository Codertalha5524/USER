import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (word: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export function SearchBar({ onSearch, isLoading, initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suchen Sie, um Wörter zu finden"
          className="w-full px-8 py-5 text-xl rounded-full bg-white/95 border-[3px] border-foreground focus:outline-none focus:border-primary shadow-lg transition-all duration-300 pr-16"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="absolute right-4 w-12 h-12 flex items-center justify-center text-foreground hover:text-primary transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <Search className="w-8 h-8" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </form>
  );
}
