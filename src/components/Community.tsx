import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Send, Filter, Plus, TrendingUp, Clock, Award, X, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { logger } from '../lib/logger';

interface Post {
  id: string;
  user_id: string;
  author_name: string;
  title: string;
  content: string;
  category: string;
  condition_tags: string[];
  is_anonymous: boolean;
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  created_at: string;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  content: string;
  is_anonymous: boolean;
  likes_count: number;
  created_at: string;
}

interface CommunityProps {
  userId: string;
  onBack?: () => void;
}

export default function Community({ userId, onBack }: CommunityProps) {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPosts();
    loadUserLikes();
  }, [sortBy]);

  useEffect(() => {
    if (selectedPost) {
      loadComments(selectedPost.id);
    }
  }, [selectedPost]);

  const loadPosts = async () => {
    setLoading(true);
    let query = supabase
      .from('community_posts')
      .select('*');

    if (sortBy === 'recent') {
      query = query.order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
    } else {
      query = query.order('is_pinned', { ascending: false }).order('likes_count', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Failed to load community posts', error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const loadComments = async (postId: string) => {
    const { data, error } = await supabase
      .from('community_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      logger.error('Error loading comments:', error);
    } else {
      setComments(data || []);
    }
  };

  const loadUserLikes = async () => {
    const { data, error } = await supabase
      .from('community_likes')
      .select('post_id, comment_id')
      .eq('user_id', userId);

    if (error) {
      logger.error('Error loading likes:', error);
    } else {
      const likes = new Set<string>();
      data?.forEach(like => {
        if (like.post_id) likes.add(`post_${like.post_id}`);
        if (like.comment_id) likes.add(`comment_${like.comment_id}`);
      });
      setUserLikes(likes);
    }
  };

  const toggleLike = async (postId?: string, commentId?: string) => {
    const likeKey = postId ? `post_${postId}` : `comment_${commentId}`;
    const isLiked = userLikes.has(likeKey);

    if (isLiked) {
      let query = supabase.from('community_likes').delete().eq('user_id', userId);
      if (postId) query = query.eq('post_id', postId);
      if (commentId) query = query.eq('comment_id', commentId);

      const { error } = await query;
      if (!error) {
        setUserLikes(prev => {
          const newLikes = new Set(prev);
          newLikes.delete(likeKey);
          return newLikes;
        });
        await loadPosts();
        if (selectedPost) await loadComments(selectedPost.id);
      }
    } else {
      const { error } = await supabase.from('community_likes').insert({
        user_id: userId,
        post_id: postId || null,
        comment_id: commentId || null
      });

      if (!error) {
        setUserLikes(prev => new Set(prev).add(likeKey));
        await loadPosts();
        if (selectedPost) await loadComments(selectedPost.id);
      }
    }
  };

  const categories = [
    { id: 'all', label: 'All Posts', icon: MessageSquare },
    { id: 'question', label: 'Questions', icon: MessageSquare },
    { id: 'experience', label: 'Experiences', icon: MessageSquare },
    { id: 'advice', label: 'Advice', icon: Award },
    { id: 'celebration', label: 'Celebrations', icon: Award },
    { id: 'support', label: 'Support', icon: Heart },
  ];

  const conditions = [
    { id: 'all', label: 'All Conditions' },
    { id: 'asd', label: 'Autism Spectrum' },
    { id: 'adhd', label: 'ADHD' },
    { id: 'speech', label: 'Speech & Language' },
    { id: 'developmental', label: 'Developmental Delay' },
    { id: 'learning', label: 'Learning Disorders' },
    { id: 'sensory', label: 'Sensory Processing' },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesCondition = selectedCondition === 'all' || post.condition_tags.includes(selectedCondition);
    return matchesCategory && matchesCondition;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'question': return 'bg-blue-100 text-blue-700';
      case 'experience': return 'bg-green-100 text-green-700';
      case 'advice': return 'bg-purple-100 text-purple-700';
      case 'celebration': return 'bg-yellow-100 text-yellow-700';
      case 'support': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getConditionLabel = (conditionId: string) => {
    return conditions.find(c => c.id === conditionId)?.label || conditionId;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (selectedPost) {
    return (
      <PostDetail
        post={selectedPost}
        comments={comments}
        userId={userId}
        userLikes={userLikes}
        onBack={() => setSelectedPost(null)}
        onLike={toggleLike}
        onCommentAdded={() => loadComments(selectedPost.id)}
        getCategoryColor={getCategoryColor}
        getConditionLabel={getConditionLabel}
        formatTimeAgo={formatTimeAgo}
      />
    );
  }

  if (showNewPost) {
    return (
      <NewPostForm
        userId={userId}
        onBack={() => setShowNewPost(false)}
        onPostCreated={() => {
          setShowNewPost(false);
          loadPosts();
        }}
        categories={categories.filter(c => c.id !== 'all')}
        conditions={conditions.filter(c => c.id !== 'all')}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('Parent Support Community', 'Comunidad de Apoyo para Padres')}
              </h1>
              <p className="text-gray-600">
                {t('Connect, share, and support each other', 'Conéctate, comparte y apóyense mutuamente')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            {t('New Post', 'Nueva Publicación')}
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            showFilters ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-5 h-5" />
          {t('Filters', 'Filtros')}
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('recent')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              sortBy === 'recent' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            {t('Recent', 'Reciente')}
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              sortBy === 'popular' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            {t('Popular', 'Popular')}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Category', 'Categoría')}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Condition', 'Condición')}
              </label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {conditions.map(cond => (
                  <option key={cond.id} value={cond.id}>{cond.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 text-sm text-gray-600">
        {t(`${filteredPosts.length} posts`, `${filteredPosts.length} publicaciones`)}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {t('No posts found', 'No se encontraron publicaciones')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('Be the first to start a conversation!', '¡Sé el primero en iniciar una conversación!')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
            >
              {post.is_pinned && (
                <div className="flex items-center gap-2 text-teal-600 text-sm font-medium mb-2">
                  <Award className="w-4 h-4" />
                  {t('Pinned', 'Destacado')}
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                    {post.condition_tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {getConditionLabel(tag)}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-700 line-clamp-2">{post.content}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="font-medium">{post.author_name}</span>
                  <span>{formatTimeAgo(post.created_at)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(post.id);
                    }}
                    className="flex items-center gap-1 hover:text-pink-600 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${userLikes.has(`post_${post.id}`) ? 'fill-pink-600 text-pink-600' : ''}`} />
                    <span>{post.likes_count}</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments_count}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface PostDetailProps {
  post: Post;
  comments: Comment[];
  userId: string;
  userLikes: Set<string>;
  onBack: () => void;
  onLike: (postId?: string, commentId?: string) => void;
  onCommentAdded: () => void;
  getCategoryColor: (category: string) => string;
  getConditionLabel: (conditionId: string) => string;
  formatTimeAgo: (dateString: string) => string;
}

function PostDetail({
  post,
  comments,
  userId,
  userLikes,
  onBack,
  onLike,
  onCommentAdded,
  getCategoryColor,
  getConditionLabel,
  formatTimeAgo
}: PostDetailProps) {
  const { t } = useLanguage();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    loadAuthorName();
  }, []);

  const loadAuthorName = async () => {
    const { data } = await supabase
      .from('user_profiles')
      .select('display_name')
      .eq('user_id', userId)
      .maybeSingle();

    if (data) {
      setAuthorName(data.display_name);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);

    const { error } = await supabase.from('community_comments').insert({
      post_id: post.id,
      user_id: userId,
      author_name: authorName || 'Anonymous',
      content: newComment.trim(),
      is_anonymous: !authorName
    });

    if (!error) {
      setNewComment('');
      onCommentAdded();
    }

    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        {t('Back to community', 'Volver a la comunidad')}
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
          {post.condition_tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {getConditionLabel(tag)}
            </span>
          ))}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span className="font-medium">{post.author_name}</span>
          <span>{formatTimeAgo(post.created_at)}</span>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Heart className={`w-5 h-5 ${userLikes.has(`post_${post.id}`) ? 'fill-pink-600 text-pink-600' : 'text-gray-600'}`} />
            <span className="font-medium">{post.likes_count}</span>
          </button>
          <div className="flex items-center gap-2 text-gray-600">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">{post.comments_count} {t('comments', 'comentarios')}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t('Comments', 'Comentarios')} ({comments.length})
        </h2>

        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('Share your thoughts...', 'Comparte tus pensamientos...')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3"
            rows={3}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            {submitting ? t('Posting...', 'Publicando...') : t('Post Comment', 'Publicar Comentario')}
          </button>
        </form>

        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="border-l-2 border-gray-200 pl-4 py-2">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-medium text-gray-900">{comment.author_name}</span>
                <span className="text-sm text-gray-500">{formatTimeAgo(comment.created_at)}</span>
              </div>
              <p className="text-gray-700 mb-2">{comment.content}</p>
              <button
                onClick={() => onLike(undefined, comment.id)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-pink-600 transition-colors"
              >
                <Heart className={`w-4 h-4 ${userLikes.has(`comment_${comment.id}`) ? 'fill-pink-600 text-pink-600' : ''}`} />
                <span>{comment.likes_count}</span>
              </button>
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              {t('No comments yet. Be the first to comment!', '¡Aún no hay comentarios. Sé el primero en comentar!')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface NewPostFormProps {
  userId: string;
  onBack: () => void;
  onPostCreated: () => void;
  categories: Array<{ id: string; label: string }>;
  conditions: Array<{ id: string; label: string }>;
}

function NewPostForm({ userId, onBack, onPostCreated, categories, conditions }: NewPostFormProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('question');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAuthorName();
  }, []);

  const loadAuthorName = async () => {
    const { data } = await supabase
      .from('user_profiles')
      .select('display_name')
      .eq('user_id', userId)
      .maybeSingle();

    if (data) {
      setAuthorName(data.display_name);
    } else {
      setAuthorName('Parent');
    }
  };

  const toggleCondition = (conditionId: string) => {
    setSelectedConditions(prev =>
      prev.includes(conditionId)
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || submitting) return;

    setSubmitting(true);

    const { error } = await supabase.from('community_posts').insert({
      user_id: userId,
      author_name: authorName,
      title: title.trim(),
      content: content.trim(),
      category,
      condition_tags: selectedConditions,
      is_anonymous: false
    });

    if (!error) {
      onPostCreated();
    } else {
      logger.error('Error creating post:', error);
    }

    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        {t('Back', 'Atrás')}
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {t('Create New Post', 'Crear Nueva Publicación')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Category', 'Categoría')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Related Conditions', 'Condiciones Relacionadas')}
            </label>
            <div className="flex flex-wrap gap-2">
              {conditions.map(cond => (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => toggleCondition(cond.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedConditions.includes(cond.id)
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cond.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Title', 'Título')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('What\'s on your mind?', '¿Qué tienes en mente?')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Content', 'Contenido')}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('Share your thoughts, experiences, or questions...', 'Comparte tus pensamientos, experiencias o preguntas...')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={8}
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!title.trim() || !content.trim() || submitting}
              className="flex-1 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {submitting ? t('Creating...', 'Creando...') : t('Create Post', 'Crear Publicación')}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              {t('Cancel', 'Cancelar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}