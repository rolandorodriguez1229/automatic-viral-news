'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus } from 'lucide-react';

export default function AddTrendManual() {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [traffic, setTraffic] = useState('50K+');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'trending_topics'), {
        keyword: keyword.trim(),
        traffic: traffic,
        articles: [],
        score: 75, // Score por defecto
        status: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // Refrescar datos
      queryClient.invalidateQueries({ queryKey: ['trendingTopics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });

      // Reset form
      setKeyword('');
      setTraffic('50K+');
      setIsOpen(false);

      alert('✅ Tendencia agregada! El script se generará automáticamente en 1-2 minutos.');
    } catch (error) {
      console.error('Error agregando tendencia:', error);
      alert('❌ Error al agregar tendencia. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span>Agregar Tendencia Manual</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border-2 border-green-200">
      <h3 className="text-lg font-semibold mb-4">Agregar Tendencia Manual</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keyword / Tema Trending
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Ej: Nueva tecnología AI, Noticia importante..."
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tráfico Estimado
          </label>
          <select
            value={traffic}
            onChange={(e) => setTraffic(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="10K+">10K+</option>
            <option value="50K+">50K+</option>
            <option value="100K+">100K+</option>
            <option value="200K+">200K+</option>
            <option value="500K+">500K+</option>
            <option value="1M+">1M+</option>
          </select>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading || !keyword.trim()}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Agregando...' : 'Agregar Tendencia'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setKeyword('');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

