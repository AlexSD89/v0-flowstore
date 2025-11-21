import * as React from "react";
import { Search, X, Mic, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'suggestion' | 'popular';
  category?: string;
}

export interface SearchBoxProps {
  value?: string;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  showVoiceInput?: boolean;
  showFilters?: boolean;
  onSearch: (query: string) => void;
  onVoiceInput?: () => void;
  onFiltersToggle?: () => void;
  className?: string;
}

const SearchBox = React.forwardRef<HTMLDivElement, SearchBoxProps>(
  ({
    value = "",
    placeholder = "搜索AI解决方案...",
    suggestions = [],
    recentSearches = [],
    showVoiceInput = true,
    showFilters = true,
    onSearch,
    onVoiceInput,
    onFiltersToggle,
    className
  }, ref) => {
    const [inputValue, setInputValue] = React.useState(value);
    const [isFocused, setIsFocused] = React.useState(false);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim()) {
        onSearch(inputValue.trim());
        setShowSuggestions(false);
      }
    };
    
    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
      setInputValue(suggestion.text);
      onSearch(suggestion.text);
      setShowSuggestions(false);
    };
    
    const clearInput = () => {
      setInputValue("");
      setShowSuggestions(false);
    };
    
    return (
      <div ref={ref} className={cn("relative w-full max-w-2xl", className)}>
        <form onSubmit={handleSubmit}>
          <div className="relative flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => {
                  setIsFocused(true);
                  setShowSuggestions(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                  // 延迟隐藏建议，允许点击
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder={placeholder}
                className="h-12 w-full rounded-xl border border-border-primary bg-background-glass px-12 py-3 text-sm backdrop-blur-xl transition-all placeholder:text-text-muted focus:border-cloudsway-primary-500 focus:outline-none focus:ring-2 focus:ring-cloudsway-primary-500/20"
              />
              
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {inputValue && (
                  <button
                    type="button"
                    onClick={clearInput}
                    className="p-1 rounded-full hover:bg-background-glass transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                
                {showVoiceInput && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onVoiceInput}
                    className="h-8 w-8 p-0"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                )}
                
                {showFilters && (
                  <Button
                    type="button"
                    variant="ghost" 
                    size="sm"
                    onClick={onFiltersToggle}
                    className="h-8 w-8 p-0"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
        
        {/* 搜索建议下拉框 */}
        {showSuggestions && (isFocused || inputValue) && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50">
            <div className="rounded-xl border border-border-primary bg-background-glass/95 backdrop-blur-xl p-4 shadow-xl">
              {/* 最近搜索 */}
              {recentSearches.length > 0 && !inputValue && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-text-primary mb-2">
                    最近搜索
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.slice(0, 5).map((search, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-cloudsway-primary-500/10"
                        onClick={() => handleSuggestionClick({
                          id: `recent-${index}`,
                          text: search,
                          type: 'history'
                        })}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 搜索建议 */}
              {suggestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-text-primary mb-2">
                    搜索建议
                  </h4>
                  <div className="space-y-1">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-background-glass transition-colors"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center gap-3">
                          <Search className="h-4 w-4 text-text-muted" />
                          <span className="text-sm text-text-primary">
                            {suggestion.text}
                          </span>
                          {suggestion.category && (
                            <Badge variant="secondary" size="sm">
                              {suggestion.category}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 无结果提示 */}
              {suggestions.length === 0 && inputValue && (
                <div className="text-center py-4">
                  <p className="text-sm text-text-muted">
                    没有找到相关建议
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

SearchBox.displayName = "SearchBox";

export { SearchBox };