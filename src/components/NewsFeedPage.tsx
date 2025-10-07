import { useState, useEffect } from 'react';
import { Calendar, Filter, ExternalLink, TrendingUp, Clock, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/skeleton';
import { useTranslation } from '../hooks/useTranslation';
import { LocalNewsFeed } from '../utils/localNewsFeed';

interface Article {
  id: string;
  title: string;
  content: string;
  url: string;
  language: string;
  source: string;
  published_at: string;
  classification?: 'REAL' | 'FAKE' | 'UNCERTAIN';
  confidence?: number;
}

export function NewsFeedPage() {
  const { t, language } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  useEffect(() => {
    fetchArticles();
  }, [selectedLanguage]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const articles = LocalNewsFeed.getArticles(selectedLanguage);
      setArticles(articles);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getClassificationColor = (classification?: string) => {
    switch (classification) {
      case 'REAL': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'FAKE': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'UNCERTAIN': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case 'en': return '🇺🇸';
      case 'ru': return '🇷🇺';
      case 'kz': return '🇰🇿';
      default: return '🌐';
    }
  };

  const sortedArticles = [...articles].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      case 'confidence':
        return (b.confidence || 0) - (a.confidence || 0);
      case 'source':
        return a.source.localeCompare(b.source);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">
            {t('newsFeed')}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Verified news articles from trusted sources
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="kz">Қазақша</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-slate-500" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Latest</SelectItem>
                <SelectItem value="confidence">Confidence</SelectItem>
                <SelectItem value="source">Source</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={fetchArticles} variant="outline">
            Refresh
          </Button>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                  <div className="flex justify-between items-center mt-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {getLanguageFlag(article.language)} {article.source}
                    </Badge>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(article.published_at)}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                    {article.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {article.classification && (
                        <Badge className={getClassificationColor(article.classification)}>
                          {article.classification}
                          {article.confidence && ` ${article.confidence}%`}
                        </Badge>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm" asChild>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Read
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && sortedArticles.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Globe className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg text-slate-600 dark:text-slate-400 mb-2">
                No articles found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Try adjusting your filters or check back later for new content.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Summary */}
        {!loading && sortedArticles.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-blue-600 dark:text-blue-400 mb-1">
                  {sortedArticles.length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Total Articles
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-green-600 dark:text-green-400 mb-1">
                  {sortedArticles.filter(a => a.classification === 'REAL').length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Verified Real
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-red-600 dark:text-red-400 mb-1">
                  {sortedArticles.filter(a => a.classification === 'FAKE').length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Flagged Fake
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-yellow-600 dark:text-yellow-400 mb-1">
                  {sortedArticles.filter(a => a.classification === 'UNCERTAIN').length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Under Review
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}