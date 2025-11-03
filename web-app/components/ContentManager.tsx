'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrendingTopicsByStatus, updateTrendingTopicStatus, TrendingTopic } from '@/lib/firestore';
import { formatDistanceToNow } from 'date-fns';
import { Eye, CheckCircle, X, Play } from 'lucide-react';

export default function ContentManager() {
  const [selectedStatus, setSelectedStatus] = useState<string>('script_ready');
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null);

  const { data: topics, isLoading, refetch } = useQuery({
    queryKey: ['contentByStatus', selectedStatus],
    queryFn: () => getTrendingTopicsByStatus(selectedStatus),
  });

  const handleApprove = async (topicId: string) => {
    try {
      await updateTrendingTopicStatus(topicId, 'ready_to_publish');
      refetch();
    } catch (error) {
      console.error('Error approving topic:', error);
    }
  };

  const handleReject = async (topicId: string) => {
    try {
      await updateTrendingTopicStatus(topicId, 'error', {
        rejected: true,
        rejectedAt: new Date(),
      });
      refetch();
    } catch (error) {
      console.error('Error rejecting topic:', error);
    }
  };

  const statuses = [
    { value: 'script_ready', label: 'Scripts Listos', count: 0 },
    { value: 'ready_to_publish', label: 'Listos para Publicar', count: 0 },
    { value: 'published', label: 'Publicados', count: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Gestión de Contenido</h2>
        <div className="flex space-x-4">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedStatus === status.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium">
            {statuses.find(s => s.value === selectedStatus)?.label || 'Contenido'}
          </h3>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {topics && topics.length > 0 ? (
              topics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {topic.keyword}
                      </h4>
                      
                      {topic.script && (
                        <div className="space-y-3 mb-4">
                          <div className="p-3 bg-blue-50 rounded-md">
                            <p className="text-xs font-medium text-blue-900 mb-1">Hook:</p>
                            <p className="text-sm text-blue-800">{topic.script.hook}</p>
                          </div>
                          
                          <div className="p-3 bg-gray-50 rounded-md">
                            <p className="text-xs font-medium text-gray-700 mb-1">Script completo:</p>
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {topic.script.fullText}
                            </p>
                          </div>

                          {topic.analysis && (
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div className="p-2 bg-green-50 rounded">
                                <p className="text-xs text-green-700">Calidad</p>
                                <p className="text-lg font-semibold text-green-900">
                                  {topic.analysis.quality_score}/100
                                </p>
                              </div>
                              <div className="p-2 bg-purple-50 rounded">
                                <p className="text-xs text-purple-700">Potencial Viral</p>
                                <p className="text-lg font-semibold text-purple-900">
                                  {topic.analysis.viral_potential}/100
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>⭐ Score: {topic.score}</span>
                        <span>
                          🕐 {formatDistanceToNow(topic.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => setSelectedTopic(topic)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                        title="Ver detalles"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {selectedStatus === 'script_ready' && (
                        <>
                          <button
                            onClick={() => handleApprove(topic.id)}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md"
                            title="Aprobar"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(topic.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                            title="Rechazar"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No hay contenido con este estado.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold">{selectedTopic.keyword}</h3>
              <button
                onClick={() => setSelectedTopic(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selectedTopic.script && (
                <div>
                  <h4 className="font-medium mb-2">Script Completo</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="whitespace-pre-wrap">{selectedTopic.script.fullText}</p>
                  </div>
                </div>
              )}
              {selectedTopic.analysis && (
                <div>
                  <h4 className="font-medium mb-2">Análisis</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-md">
                      <p className="text-sm text-green-700">Calidad</p>
                      <p className="text-2xl font-bold text-green-900">
                        {selectedTopic.analysis.quality_score}/100
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-md">
                      <p className="text-sm text-purple-700">Potencial Viral</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {selectedTopic.analysis.viral_potential}/100
                      </p>
                    </div>
                  </div>
                  {selectedTopic.analysis.strengths && selectedTopic.analysis.strengths.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium mb-2">Fortalezas:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedTopic.analysis.strengths.map((strength: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-600">{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

