'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getDashboardStats, getTrendingTopics, TrendingTopic } from '@/lib/firestore';
import { fetchTrendsNow } from '@/lib/api';
import StatsCards from './StatsCards';
import TopicsList from './TopicsList';
import ContentManager from './ContentManager';
import { BarChart3, TrendingUp, FileText, Settings, Search } from 'lucide-react';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'analytics'>('dashboard');
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    refetchInterval: 30000, // Refetch cada 30 segundos
  });

  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ['trendingTopics'],
    queryFn: () => getTrendingTopics(20),
    refetchInterval: 30000,
  });

  const fetchTrendsMutation = useMutation({
    mutationFn: fetchTrendsNow,
    onSuccess: (data) => {
      if (data.success) {
        // Refrescar los datos después de agregar tendencias
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['trendingTopics'] });
          queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        }, 2000);
      }
    },
  });

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Viral Content Automation
              </h1>
              <p className="text-sm text-gray-500">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Gestión de Contenido</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Botón para buscar tendencias */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Buscar Tendencias Actuales
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Busca las tendencias más populares de Google Trends y agrégalas al sistema
                  </p>
                </div>
                <button
                  onClick={() => fetchTrendsMutation.mutate()}
                  disabled={fetchTrendsMutation.isPending}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Search className="w-5 h-5" />
                  <span>
                    {fetchTrendsMutation.isPending ? 'Buscando...' : 'Buscar Tendencias'}
                  </span>
                </button>
              </div>
              {fetchTrendsMutation.isSuccess && fetchTrendsMutation.data.success && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 font-medium">
                    ✅ {fetchTrendsMutation.data.message}
                  </p>
                  {fetchTrendsMutation.data.addedTrends && fetchTrendsMutation.data.addedTrends.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {fetchTrendsMutation.data.addedTrends.map((trend, idx) => (
                        <li key={idx} className="text-sm text-green-700">
                          • {trend.keyword} (Score: {trend.score})
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-sm text-green-600 mt-2">
                    ⏳ Los scripts se generarán automáticamente en 1-2 minutos...
                  </p>
                </div>
              )}
              {fetchTrendsMutation.isError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">
                    ❌ Error al buscar tendencias. Intenta nuevamente.
                  </p>
                </div>
              )}
            </div>

            <StatsCards stats={stats} loading={statsLoading} />
            <TopicsList topics={topics || []} loading={topicsLoading} />
          </div>
        )}

        {activeTab === 'content' && (
          <ContentManager />
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <p className="text-gray-500">Analytics dashboard en desarrollo...</p>
          </div>
        )}
      </main>
    </div>
  );
}

