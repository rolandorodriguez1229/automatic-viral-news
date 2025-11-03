'use client';

import { TrendingTopic } from '@/lib/firestore';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface TopicsListProps {
  topics: TrendingTopic[];
  loading: boolean;
}

export default function TopicsList({ topics, loading }: TopicsListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Tendencias Recientes</h2>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { icon: any; color: string; text: string }> = {
      pending: {
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Pendiente',
      },
      generating_script: {
        icon: Clock,
        color: 'bg-blue-100 text-blue-800',
        text: 'Generando script...',
      },
      script_ready: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800',
        text: 'Script listo',
      },
      error: {
        icon: AlertCircle,
        color: 'bg-red-100 text-red-800',
        text: 'Error',
      },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Tendencias Recientes</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {topics.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No hay tendencias aún. El sistema comenzará a detectar tendencias cada 2 horas.
          </div>
        ) : (
          topics.map((topic) => (
            <div key={topic.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {topic.keyword}
                    </h3>
                    {getStatusBadge(topic.status)}
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>📊 Tráfico: {topic.traffic}</span>
                    <span>⭐ Score: {topic.score}</span>
                    <span>
                      🕐 {formatDistanceToNow(topic.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  {topic.articles && topic.articles.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Artículos relacionados:</p>
                      <div className="space-y-1">
                        {topic.articles.slice(0, 2).map((article, idx) => (
                          <a
                            key={idx}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {article.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {topic.script && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-xs font-medium text-gray-700 mb-1">Hook:</p>
                      <p className="text-sm text-gray-600">{topic.script.hook}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

