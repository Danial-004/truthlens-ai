import { useState } from 'react';
import { Upload, FileText, Loader, AlertTriangle, CheckCircle, HelpCircle, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../hooks/useAuth';
import { FakeNewsDetector } from '../utils/fakeNewsDetector';
import { LocalAnalytics } from '../utils/localAnalytics';

interface PredictionResult {
  id: string;
  classification: 'REAL' | 'FAKE' | 'UNCERTAIN';
  confidence: number;
  explanation: {
    reasoning: string;
    keywords: string[];
    sources: string[];
  };
  language: string;
  model?: string;
}

export function CheckTextPage() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      console.log('Using enhanced client-side fake news detection...');
      const detector = FakeNewsDetector.getInstance();
      const clientResult = await detector.predict(text.trim(), detectLanguage(text));
      
      // Save prediction locally for analytics
      LocalAnalytics.savePrediction({
        id: clientResult.id,
        text: text.trim(),
        classification: clientResult.classification,
        confidence: clientResult.confidence,
        timestamp: new Date().toISOString(),
        language: clientResult.language
      });
      
      setResult(clientResult);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const detectLanguage = (text: string): string => {
    // Simple language detection based on character patterns
    const cyrillicPattern = /[а-яё]/i;
    const kazakhPattern = /[әғіңөүұқһ]/i;
    
    if (kazakhPattern.test(text)) return 'kz';
    if (cyrillicPattern.test(text)) return 'ru';
    return 'en';
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'REAL': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'FAKE': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'UNCERTAIN': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const highlightKeywords = (text: string, keywords: string[]) => {
    if (!keywords.length) return text;
    
    let highlightedText = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$&</mark>`);
    });
    
    return highlightedText;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">
            {t('checkText')}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Analyze text for authenticity using advanced pattern recognition
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Text Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={t('pasteText')}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {text.length} characters
                    </span>
                    <Badge variant="outline">
                      {detectLanguage(text).toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" size="sm" asChild>
                        <span className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          {t('uploadFile')}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>

                {/* Enhanced Sample Buttons */}
                <div className="space-y-3">
                  <div className="text-sm text-slate-600 dark:text-slate-400">Quick samples:</div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setText("According to research published in a peer-reviewed journal, scientists have made progress in renewable energy technology. The study, conducted over two years, shows promising results that could contribute to sustainable development.")}
                    >
                      Credible News
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setText("Government officials announced new infrastructure projects today. The ministry reported that construction will begin next quarter, according to the spokesperson who stated the budget has been approved by the committee.")}
                    >
                      Official News
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setText("Breaking: Unbelievable miracle cure discovered! This one weird trick will shock you! They don't want you to know this amazing secret that doctors hate!")}
                    >
                      Suspicious Content
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setText("The weather was nice today. Some people went outside. It was sunny and warm. Many enjoyed the good conditions.")}
                    >
                      Neutral Text
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={analyzeText}
                  disabled={!text.trim() || isAnalyzing}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      {t('analyzing')}
                    </>
                  ) : (
                    t('analyzeText')
                  )}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Educational Notice */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t('disclaimer')} This system uses advanced pattern recognition and works completely offline for privacy and reliability.
              </AlertDescription>
            </Alert>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Classification Result */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Analysis Result</span>
                      <Badge className={getClassificationColor(result.classification)}>
                        {t(result.classification.toLowerCase() as any)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {t('confidence')}
                        </span>
                        <span className="text-sm font-medium">
                          {result.confidence}%
                        </span>
                      </div>
                      <Progress 
                        value={result.confidence} 
                        className="h-2"
                      />
                      <div className={`h-2 rounded-full ${getConfidenceColor(result.confidence)} mt-1`} 
                           style={{ width: `${result.confidence}%` }} />
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-2">{t('explanation')}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {result.explanation.reasoning}
                      </p>
                    </div>

                    {result.model && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Analysis Model:
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {result.model === 'enhanced-client-heuristic' ? 'Enhanced Pattern Analysis' : 'AI Model'}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Keywords */}
                {result.explanation.keywords.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t('keywords')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {result.explanation.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Highlighted Text */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Highlighted Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                      dangerouslySetInnerHTML={{ 
                        __html: highlightKeywords(text, result.explanation.keywords) 
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Sources */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('sources')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.explanation.sources.length > 0 ? (
                      <div className="space-y-2">
                        {result.explanation.sources.map((source, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <span className="text-sm">{source}</span>
                            <ExternalLink className="h-4 w-4 text-slate-400" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                        <HelpCircle className="h-4 w-4" />
                        <span className="text-sm">Manual fact-checking recommended with trusted sources</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="h-64 flex items-center justify-center border-dashed border-2">
                <div className="text-center text-slate-400 dark:text-slate-600">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>Analysis results will appear here</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}