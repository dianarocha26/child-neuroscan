import React, { useState, useEffect } from 'react';
import { Play, Search, Filter, Clock, CheckCircle, BookmarkPlus, X, Tag, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { logger } from '../lib/logger';

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  condition_type: string;
  age_group: string;
  difficulty_level: string;
  views: number;
  category: {
    name: string;
    icon: string;
  };
  tags: string[];
  progress?: {
    watched: boolean;
    progress_seconds: number;
  };
}

interface VideoCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface VideoLibraryProps {
  userId?: string;
}

export default function VideoLibrary({ userId }: VideoLibraryProps) {
  const { t } = useLanguage();
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [loading, setLoading] = useState(true);
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

    let query = supabase
      .from('videos')
      .select(`
        *,
        category:video_categories(name, icon),
        tags:video_tags(tag)
      `)
      .order('created_at', { ascending: false });

    if (selectedCondition !== 'all') {
      query = query.eq('condition_type', selectedCondition);
    }

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    if (selectedAgeGroup !== 'all') {
      query = query.or(`age_group.eq.${selectedAgeGroup},age_group.eq.all`);
    }

    const [videosResult, categoriesResult] = await Promise.all([
      query,
      supabase.from('video_categories').select('*').order('name')
    ]);

    if (videosResult.error) {
      logger.error('Error loading videos:', videosResult.error);
    } else {
      const videosWithTags = videosResult.data.map((video: any) => ({
        ...video,
        tags: video.tags?.map((t: any) => t.tag) || []
      }));

      if (userId) {
        const videoIds = videosWithTags.map((v: Video) => v.id);
        const { data: progressData } = await supabase
          .from('user_video_progress')
          .select('video_id, watched, progress_seconds')
          .eq('user_id', userId)
          .in('video_id', videoIds);

        const progressMap = new Map(
          progressData?.map(p => [p.video_id, { watched: p.watched, progress_seconds: p.progress_seconds }])
        );

        videosWithTags.forEach((video: Video) => {
          video.progress = progressMap.get(video.id);
        });
      }

      setVideos(videosWithTags);
    }

    if (categoriesResult.error) {
      logger.error('Error loading categories:', categoriesResult.error);
    } else {
      setCategories(categoriesResult.data || []);
    }

    setLoading(false);
  };

  const handleVideoClick = async (video: Video) => {
    setSelectedVideo(video);

    await supabase
      .from('videos')
      .update({ views: (video.views || 0) + 1 })
      .eq('id', video.id);

    if (userId) {
      await supabase
        .from('user_video_progress')
        .upsert({
          user_id: userId,
          video_id: video.id,
          watched: false,
          progress_seconds: 0,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,video_id'
        });
    }
  };

  const handleMarkAsWatched = async (videoId: string) => {
    if (!userId) return;

    await supabase
      .from('user_video_progress')
      .upsert({
        user_id: userId,
        video_id: videoId,
        watched: true,
        progress_seconds: 0,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,video_id'
      });

    await loadVideosAndCategories();
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = searchQuery === '' ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedVideo(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <X className="w-5 h-5" />
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

            <div className="p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedVideo.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(selectedVideo.duration)}
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
                        : 'bg-blue-600 text-white hover:bg-blue-700'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('Video Library', 'Biblioteca de Videos')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('Educational videos, therapy techniques, and parent resources',
               'Videos educativos, técnicas de terapia y recursos para padres')}
          </p>
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
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Condition Type', 'Tipo de Condición')}
                  </label>
                  <select
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Category', 'Categoría')}
                  </label>
                  <select
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Age Group', 'Grupo de Edad')}
                  </label>
                  <select
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
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100">
                      <Play className="w-8 h-8 text-blue-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
                    {formatDuration(video.duration)}
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