import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, Target, TrendingUp, Users, FileText, Shield, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../hooks/useAuth';
import { LocalAnalytics } from '../utils/localAnalytics';

interface Stats {
  totalPredictions: number;
  totalArticles: number;
  classifications: {
    fake: number;
    real: number;
    uncertain: number;
  };
  avgConfidence: number;
  recentActivity: any[];
}

interface PredictionHistory {
  id: string;
  text: string;
  classification: string;
  confidence: number;
  timestamp: string;
}

export function DashboardPage() {
  const { t } = useTranslation();
  const { user, session } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [predictions, setPredictions] = useState<PredictionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Use local analytics
      const analytics = LocalAnalytics.getAnalytics();
      setStats(analytics);
      setPredictions(analytics.recentActivity);
      
      // If no data exists, generate demo data
      if (analytics.totalPredictions === 0) {
        LocalAnalytics.generateDemoData();
        const newAnalytics = LocalAnalytics.getAnalytics();
        setStats(newAnalytics);
        setPredictions(newAnalytics.recentActivity);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats ? [
    { name: 'Real', value: stats.classifications.real, color: '#10b981' },
    { name: 'Fake', value: stats.classifications.fake, color: '#ef4444' },
    { name: 'Uncertain', value: stats.classifications.uncertain, color: '#f59e0b' }
  ] : [];

  const activityData = predictions.slice(0, 7).map((pred, index) => ({
    day: `Day ${7 - index}`,
    predictions: Math.floor(Math.random() * 10) + 1,
    accuracy: Math.floor(Math.random() * 20) + 80
  }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'REAL': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'FAKE': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'UNCERTAIN': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="p-8">
            <CardContent>
              <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h2 className="text-xl text-slate-600 dark:text-slate-400 mb-2">
                Please log in to view your dashboard
              </h2>
              <p className="text-slate-500 dark:text-slate-500">
                Sign in to track your verification history and analytics.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">
            {t('dashboard')}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Welcome back, {user.user_metadata?.name || user.email}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }, (_, index) => (
              <Card key={`skeleton-${index}`}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Checks</CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{stats?.totalPredictions || 0}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Texts analyzed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Accuracy</CardTitle>
                  <Target className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{stats?.avgConfidence || 0}%</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Average confidence
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Real News</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-600">
                    {stats?.classifications.real || 0}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Verified authentic
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Fake Detected</CardTitle>
                  <Shield className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-red-600">
                    {stats?.classifications.fake || 0}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    False information
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Classification Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Classification Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="predictions" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Predictions"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  {t('recentActivity')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {predictions.length > 0 ? (
                  <div className="space-y-4">
                    {predictions.slice(0, 5).map((prediction) => (
                      <div 
                        key={prediction.id} 
                        className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getClassificationColor(prediction.classification)}>
                              {prediction.classification}
                            </Badge>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              {prediction.confidence}% confidence
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                            {prediction.text.substring(0, 100)}...
                          </p>
                        </div>
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 ml-4">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(prediction.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-sm">Start checking news to see your analysis history.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}