import { useState, useEffect } from 'react';
import { Play, Search, Filter, Clock, CheckCircle, Tag, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { logger } from '../lib/logger';
import { PageHeader } from './PageHeader';
import { ErrorState, LOAD_ERROR_MESSAGE } from './ErrorState';
import {
  listVideoCategories, listVideos, markVideoWatched, recordVideoView, startVideoProgress,
  type Video, type VideoCategory
} from '../lib/api/videos';

interface VideoLibraryProps {
  userId?: string;
  onBack?: () => void;
}

export default function VideoLibrary({ userId, onBack }: VideoLibraryProps) {
  const { t } = useLanguage();
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadVideosAndCategories();
  }, [selectedCondition, selectedCategory, selectedAgeGroup]);

  const loadVideosAndCategories = async () => {
    setLoading(true);
    setLoadFailed(false);

    const [videosResult, categoriesResult] = await Promise.allSettled([
      listVideos({ condition: selectedCondition, categoryId: selectedCategory, ageGroup: selectedAgeGroup }, userId),
      listVideoCategories()
    ]);

    if (videosResult.status === 'rejected') {
      logger.error('Error loading videos:', videosResult.reason);
      setLoadFailed(true);
    } else {
      setVideos(videosResult.value);
    }

    if (categoriesResult.status === 'rejected') {
      logger.error('Error loading categories:', categoriesResult.reason);
      setLoadFailed(true);
    } else {
      setCategories(categoriesResult.value);
    }

    setLoading(false);
  };

  const handleVideoClick = async (video: Video) => {
    setSelectedVideo(video);

    try {
      await recordVideoView(video.id);
      const views = (video.views || 0) + 1;
      setSelectedVideo(v => (v?.id === video.id ? { ...v, views } : v));
      setVideos(vs => vs.map(v => (v.id === video.id ? { ...v, views } : v)));
    } catch (error) {
      logger.error('Error recording video view:', error);
    }

    if (userId) {
      try {
        await startVideoProgress(userId, video.id);
      } catch (error) {
        logger.error('Error starting video progress:', error);
      }
    }
  };

  const handleMarkAsWatched = async (videoId: string) => {
    if (!userId) return;

    try {
      await markVideoWatched(userId, videoId);
    } catch (error) {
      logger.error('Error marking video as watched:', error);
    }

    await loadVideosAndCategories();
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = searchQuery === '' ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.description ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const getConditionLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      asd: 'ASD',
      adhd: 'ADHD',
      speech: 'Speech',
      developmental: 'Developmental',
      learning: 'Learning',
      sensory: 'Sensory'
    };
    return labels[type] || type;
  };

  const conditionOptions = [
    { value: 'all', label: 'All Conditions' },
    { value: 'asd', label: 'Autism (ASD)' },
    { value: 'adhd', label: 'ADHD' },
    { value: 'speech', label: 'Speech & Language' },
    { value: 'developmental', label: 'Developmental Delay' },
    { value: 'learning', label: 'Learning Disorders' },
    { value: 'sensory', label: 'Sensory Processing' }
  ];

  const ageGroupOptions = [
    { value: 'all', label: 'All Ages' },
    { value: '0-3', label: '0-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-12', label: '5-12 years' },
    { value: '12+', label: '12+ years' }
  ];

  if (selectedVideo) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-8">
          <button
            onClick={() => setSelectedVideo(null)}
            className="no-print inline-flex items-center gap-1.5 -ml-2 px-2 min-h-[44px] rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors mb-2 sm:mb-4"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {t('Back to Library', 'Volver a la Biblioteca')}
          </button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-900">
              <iframe
                src={selectedVideo.video_url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-4 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-[12rem]">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {selectedVideo.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(selectedVideo.duration ?? 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Play className="w-4 h-4" />
                      {selectedVideo.views} views
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {getConditionLabel(selectedVideo.condition_type)}
                    </span>
                  </div>
                </div>

                {userId && (
                  <button
                    onClick={() => handleMarkAsWatched(selectedVideo.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedVideo.progress?.watched
                        ? 'bg-green-100 text-green-700'
                        : 'bg-teal-700 text-white hover:bg-teal-800'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {selectedVideo.progress?.watched ? 'Watched' : 'Mark as Watched'}
                  </button>
                )}
              </div>

              <div className="prose max-w-none mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About this video</h3>
                <p className="text-gray-700 leading-relaxed">{selectedVideo.description}</p>
              </div>

              {selectedVideo.tags.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-8">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="no-print inline-flex items-center gap-1.5 -ml-2 mb-2 sm:mb-4 px-2 min-h-[44px] rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              {t('Back to Home', 'Volver al inicio')}
            </button>
          )}
          <PageHeader
            icon={Play}
            tone="purple"
            title={t('Video Library', 'Biblioteca de Videos')}
            subtitle={t('Educational videos, therapy techniques, and parent resources',
               'Videos educativos, técnicas de terapia y recursos para padres')}
          />
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('Search videos, topics, or tags...', 'Buscar videos, temas o etiquetas...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Filter className="w-5 h-5" />
              {t('Filters', 'Filtros')}
            </button>
          </div>

          {showFilters && (
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="video-condition" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Condition Type', 'Tipo de Condición')}
                  </label>
                  <select
                    id="video-condition"
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {conditionOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="video-category" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Category', 'Categoría')}
                  </label>
                  <select
                    id="video-category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">{t('All Categories', 'Todas las Categorías')}</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="video-age-group" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Age Group', 'Grupo de Edad')}
                  </label>
                  <select
                    id="video-age-group"
                    value={selectedAgeGroup}
                    onChange={(e) => setSelectedAgeGroup(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ageGroupOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCondition('all');
                  setSelectedCategory('all');
                  setSelectedAgeGroup('all');
                  setSearchQuery('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('Clear all filters', 'Limpiar todos los filtros')}
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : loadFailed ? (
          <ErrorState inline message={LOAD_ERROR_MESSAGE} onRetry={loadVideosAndCategories} />
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-20">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('No videos found', 'No se encontraron videos')}
            </h3>
            <p className="text-gray-600">
              {t('Try adjusting your filters or search query', 'Intente ajustar sus filtros o búsqueda')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => handleVideoClick(video)}
              >
                <div className="relative aspect-video bg-gray-200">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100" aria-hidden="true">
                      <Play className="w-10 h-10 text-blue-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100">
                      <Play className="w-8 h-8 text-blue-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
                    {formatDuration(video.duration ?? 0)}
                  </div>
                  {video.progress?.watched && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {getConditionLabel(video.condition_type)}
                    </span>
                    {video.category && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {video.category.name}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      {video.views} views
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {video.age_group === 'all' ? 'All ages' : `${video.age_group} years`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}