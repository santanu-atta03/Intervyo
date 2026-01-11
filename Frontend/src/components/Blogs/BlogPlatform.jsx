import { useState, useEffect ,useMemo} from 'react';
import { 
  Search, Plus, TrendingUp, Clock, Eye, Heart, MessageCircle, 
  Tag, User, Calendar, Edit, Trash2, Share2, Bookmark, Filter,
  ChevronRight, Sparkles, X, ArrowLeft, Send, MoreVertical, Star
} from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
const API_URL = 'https://intervyo.onrender.com/api';
// ============================================
// SEED CONTENT & SKELETON (Add at top)
// ============================================
const SEED_ARTICLES = [
  {
    _id: 'seed-1',
    title: "Mastering System Design: From Monolith to Microservices",
    slug: "mastering-system-design",
    excerpt: "Learn how to scale applications effectively using load balancers and caching strategies.",
    author: { name: "System Architect", avatar: "SA" },
    publishedAt: new Date().toISOString(),
    tags: ["System Design", "Backend"],
    likesCount: 124, views: 1540, readTime: 12, featured: true
  },
  {
    _id: 'seed-2',
    title: "Cracking the FAANG Interview: A 3-Month Roadmap",
    slug: "faang-roadmap",
    excerpt: "A comprehensive guide on Data Structures, Algorithms, and behavioral preparation.",
    author: { name: "Interview Expert", avatar: "IE" },
    publishedAt: new Date().toISOString(),
    tags: ["Interview Prep", "Career"],
    likesCount: 89, views: 3200, readTime: 8, featured: true
  },
  {
    _id: 'seed-3',
    title: "10 React Performance Optimization Techniques",
    slug: "react-performance",
    excerpt: "Boost your web app speed using useMemo, useCallback, and dynamic imports.",
    author: { name: "Frontend Pro", avatar: "FP" },
    publishedAt: new Date().toISOString(),
    tags: ["React", "Frontend"],
    likesCount: 45, views: 980, readTime: 6, featured: false
  },
  {
    _id: 'seed-4',
    title: "Navigating Career Growth in Remote Tech",
    slug: "remote-career-growth",
    excerpt: "How to stay visible and get promoted while working from home in a global team.",
    author: { name: "Career Coach", avatar: "CC" },
    publishedAt: new Date().toISOString(),
    tags: ["Career", "Soft Skills"],
    likesCount: 67, views: 1100, readTime: 5, featured: false
  }
];
const ReadingProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-purple-500 to-cyan-500 z-[100] origin-left" style={{ scaleX }} />;
};
const BlogSkeleton = () => (
  <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 p-6 animate-pulse">
    <div className="h-48 bg-gray-700/20 rounded-xl mb-4" />
    <div className="flex gap-3 mb-4">
      <div className="w-10 h-10 bg-gray-700/40 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-700/40 rounded w-1/2" />
        <div className="h-2 bg-gray-700/40 rounded w-1/4" />
      </div>
    </div>
    <div className="h-6 bg-gray-700/40 rounded w-3/4 mb-3" />
    <div className="h-10 bg-gray-700/40 rounded-xl w-full" />
  </div>
);
// ============================================
// MAIN BLOG PAGE
// ============================================
export default function BlogPlatform() {
  const [currentPage, setCurrentPage] = useState('list');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('-publishedAt');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [currentUser, setCurrentUser] = useState({
    id: 'user123',
    name: 'Manmohan Atta',
    avatar: 'M'
  });

  useEffect(() => {
    fetchBlogs();
    fetchFeaturedBlogs();
    fetchPopularTags();
  }, [searchQuery, selectedTag, sortBy, currentPageNum]);

  const fetchBlogs = async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams({ 
      page: currentPageNum, limit: 12, search: searchQuery, tag: selectedTag, sort: sortBy 
    });
    const response = await fetch(`${API_URL}/blogs?${params}`);
    const data = await response.json();
    
    if (data.success) {
      setBlogs(data.blogs);
      setTotalPages(data.pagination.pages);
    } else {
      setBlogs(SEED_ARTICLES); // Fallback if success is false
    }
  } catch (error) {
    console.error('API Error:', error);
    setBlogs(SEED_ARTICLES); // Fallback if API is blocked (CORS)
  } finally {
    // Add a slight delay for a smooth "Wow" transition from skeleton to content
    setTimeout(() => setLoading(false), 800); 
  }
};

  const fetchFeaturedBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/blogs/featured`);
      const data = await response.json();
      if (data.success) setFeaturedBlogs(data.blogs);
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
    }
  };
  // Ensure this useMemo is inside your BlogPlatform function
const displayBlogs = useMemo(() => {
  // Use API blogs if available, otherwise fall back to SEED_ARTICLES
  let list = blogs.length > 0 ? blogs : SEED_ARTICLES;

  // Real-time filtering logic
  return list.filter(blog => {
    const titleMatch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
    const excerptMatch = blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const tagMatch = blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Show if search matches title, excerpt, OR tags
    return titleMatch || excerptMatch || tagMatch;
  });
}, [blogs, searchQuery]);
  const fetchPopularTags = async () => {
    try {
      const response = await fetch(`${API_URL}/blogs/tags`);
      const data = await response.json();
      if (data.success) setPopularTags(data.tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const viewBlog = async (slugOrId) => {
    try {
      const response = await fetch(`${API_URL}/blogs/${slugOrId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedBlog(data.blog);
        setCurrentPage('detail');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {currentPage === 'list' && (
        <BlogList 
          blogs={blogs}
          featuredBlogs={featuredBlogs}
          popularTags={popularTags}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          sortBy={sortBy}
          setSortBy={setSortBy}
          loading={loading}
          currentPage={currentPageNum}
          totalPages={totalPages}
          setCurrentPage={setCurrentPageNum}
          onViewBlog={viewBlog}
          onCreateBlog={() => setCurrentPage('create')}
          currentUser={currentUser}
        />
      )}

      {currentPage === 'detail' && selectedBlog && (
        <BlogDetail 
          blog={selectedBlog}
          currentUser={currentUser}
          onBack={() => setCurrentPage('list')}
          onEdit={() => setCurrentPage('edit')}
        />
      )}

      {currentPage === 'create' && (
        <BlogEditor 
          mode="create"
          currentUser={currentUser}
          onBack={() => setCurrentPage('list')}
          onSuccess={() => {
            setCurrentPage('list');
            fetchBlogs();
          }}
        />
      )}

      {currentPage === 'edit' && selectedBlog && (
        <BlogEditor 
          mode="edit"
          blog={selectedBlog}
          currentUser={currentUser}
          onBack={() => setCurrentPage('detail')}
          onSuccess={(updatedBlog) => {
            setSelectedBlog(updatedBlog);
            setCurrentPage('detail');
            fetchBlogs();
          }}
        />
      )}
    </div>
  );
}

// ============================================
// BLOG LIST PAGE
// ============================================
function BlogList({ 
  blogs, featuredBlogs, popularTags, searchQuery, setSearchQuery, 
  selectedTag, setSelectedTag, sortBy, setSortBy, loading,
  currentPage, totalPages, setCurrentPage, onViewBlog, onCreateBlog, currentUser
}) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#1a1f2e] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Knowledge Hub
              </h1>
              <p className="text-gray-400">
                Share insights, learn from peers, and grow together
              </p>
            </div>
            <button
              onClick={onCreateBlog}
              className="px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] hover:from-[#7c3aed] hover:to-[#c026d3] text-white rounded-xl font-semibold flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Write Article
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, topics, or tags..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#0f1419] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Featured Blogs */}
      {featuredBlogs.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-[#d946ef]" />
            <h2 className="text-2xl font-bold text-white">Featured Articles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBlogs.slice(0, 3).map((blog) => (
              <div
                key={blog._id}
                onClick={() => onViewBlog(blog.slug)}
                className="group bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden cursor-pointer hover:border-[#8b5cf6] transition-all"
              >
                <div className="h-44 bg-gradient-to-br from-[#8b5cf6] to-[#d946ef] relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                    <span className="text-white text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {blog.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-lg text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#8b5cf6] transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-gray-500 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {blog.likesCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {blog.commentsCount}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {blog.readTime} min
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Filters */}
                              {/* Sidebar - Clickable Filters */}
                <div className="lg:col-span-3 space-y-8">
                  <div className="p-6 bg-[#161b22] rounded-3xl border border-gray-800/50">
                    <h3 className="text-white font-black mb-6 flex items-center gap-2">
                      <Filter className="w-5 h-5 text-orange-500" /> DISCOVER
                    </h3>
                    
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                        Sort by
                      </p>
                      <div className="flex flex-col gap-3">
                        {[
                          { label: 'Latest Stories', value: '-publishedAt' },
                          { label: 'Most Viewed', value: '-views' },
                          { label: 'Highly Rated', value: '-likes' }
                        ].map((item) => (
                          <button
                            key={item.value}
                            onClick={() => setSortBy(item.value)}
                            className={`text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                              sortBy === item.value 
                              ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-[0_0_15px_rgba(212,88,31,0.1)]' 
                              : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
                            }`}
                          >
                            {sortBy === item.value && <span className="mr-2">●</span>}
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  {/* Clear All Option - Only shows if a tag or specific sort is active */}
                  {(selectedTag || sortBy !== '-publishedAt') && (
                    <button
                      onClick={() => {
                        setSelectedTag('');
                        setSortBy('-publishedAt');
                      }}
                      className="mt-6 w-full text-[11px] font-bold text-gray-500 hover:text-red-400 transition-colors uppercase tracking-tighter flex items-center justify-center gap-2"
                    >
                      <X className="w-3 h-3" /> Reset all filters
                    </button>
                  )}
                </div>

                {/* Tags section follows below... */}
              </div>
                            {/* In the Blog Grid section of BlogList */}
              
                            {/* Popular Tags */}
                            <div className="flex flex-wrap gap-2">
                {/* Standard "All" button */}
                

                {/* Dynamic tags from your data */}
                {popularTags.map(tag => (
                  <button
                    key={tag.name}
                    onClick={() => setSelectedTag(tag.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedTag === tag.name 
                      ? 'bg-orange-500 border-orange-500 text-white' 
                      : 'bg-[#0d1117] border-gray-800 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
                          </div>
                        </div>

                          {/* Blog Grid */}
                          <div className="lg:col-span-3">
                            {loading ? (
                              <div className="text-center py-20">
                                <div className="w-12 h-12 border-3 border-[#8b5cf6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-400">Loading articles...</p>
                              </div>
                            ) : blogs.length === 0 ? (
                              <div className="text-center py-20 bg-[#1a1f2e] rounded-xl border border-gray-800">
                                <p className="text-gray-400 text-lg mb-4">No articles found</p>
                                <button
                                  onClick={onCreateBlog}
                                  className="px-6 py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] rounded-xl text-white font-semibold transition-all"
                                >
                                  Write the first article
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                  {blogs.map(blog => (
                                    <BlogCard key={blog._id} blog={blog} onView={onViewBlog} />
                                  ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                      disabled={currentPage === 1}
                                      className="px-4 py-2 bg-[#1a1f2e] hover:bg-[#8b5cf6]/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-all border border-gray-800"
                                    >
                                      Previous
                                    </button>
                                    
                                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                                      const pageNum = idx + 1;
                                      return (
                                        <button
                                          key={pageNum}
                                          onClick={() => setCurrentPage(pageNum)}
                                          className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                                            currentPage === pageNum
                                              ? 'bg-[#8b5cf6] text-white'
                                              : 'bg-[#1a1f2e] text-gray-400 hover:bg-[#8b5cf6]/20 border border-gray-800'
                                          }`}
                                        >
                                          {pageNum}
                                        </button>
                                      );
                                    })}
                                    
                                    <button
                                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                      disabled={currentPage === totalPages}
                                      className="px-4 py-2 bg-[#1a1f2e] hover:bg-[#8b5cf6]/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-all border border-gray-800"
                                    >
                                      Next
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

// ============================================
// BLOG CARD COMPONENT
// ============================================
function BlogCard({ blog, onView }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onClick={() => onView(blog)}
      className="relative group bg-[#161b22] rounded-3xl border border-gray-800/50 p-6 cursor-pointer overflow-hidden transition-all hover:border-orange-500/50 hover:shadow-[0_20px_50px_rgba(212,88,31,0.15)]"
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {blog.author?.avatar || 'U'}
          </div>
          <div>
            <h4 className="text-white font-bold text-sm leading-tight">{blog.author?.name}</h4>
            <span className="text-[10px] uppercase tracking-widest text-orange-500 font-bold">Expert</span>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-orange-400 transition-colors line-clamp-2">
        {blog.title}
      </h3>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {blog.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[10px] font-bold px-3 py-1 bg-gray-800/50 text-gray-300 rounded-lg border border-gray-700 group-hover:border-orange-500/30">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
        <div className="flex gap-4 text-gray-400">
          <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 hover:text-red-500" /> {blog.likesCount}</span>
          <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> {blog.commentsCount || 0}</span>
        </div>
        <button className="p-2 rounded-xl bg-gray-800/50 text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </motion.div>
  );
}
// ============================================
// BLOG DETAIL PAGE
// ============================================
function BlogDetail({ blog, currentUser, onBack, onEdit }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(blog.likesCount);
  const [comments, setComments] = useState(blog.comments || []);
  const [newComment, setNewComment] = useState('');

  const handleLike = async () => {
    try {
      const response = await fetch(`${API_URL}/blogs/${blog._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`${API_URL}/blogs/${blog._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newComment })
      });
      const data = await response.json();
      if (data.success) {
        setComments(data.comments);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-[#1a1f2e] hover:bg-[#8b5cf6]/20 rounded-lg text-white flex items-center gap-2 transition-all border border-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </button>

        {/* Blog Content */}
        <article className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden">
          {/* Cover */}
          <div className="h-80 bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#d946ef] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>

          <div className="p-8 md:p-12">
            {/* Author Info */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {blog.author?.avatar || blog.author?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{blog.author?.name}</p>
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(blog.publishedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {blog.readTime} min read
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      {blog.views} views
                    </span>
                  </div>
                </div>
              </div>

              {blog.author._id === currentUser.id && (
                <button
                  onClick={onEdit}
                  className="px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] rounded-lg text-white flex items-center gap-2 transition-all"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-800">
              {blog.tags.map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-lg text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none mb-8">
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                {blog.content}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 py-6 border-t border-gray-800">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${
                  liked
                    ? 'bg-red-500 text-white'
                    : 'bg-[#0f1419] text-gray-300 hover:bg-red-500/20 border border-gray-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                {likesCount}
              </button>

              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0f1419] hover:bg-[#8b5cf6]/20 rounded-lg text-gray-300 font-semibold transition-all border border-gray-700">
                <Share2 className="w-5 h-5" />
                Share
              </button>

              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0f1419] hover:bg-[#8b5cf6]/20 rounded-lg text-gray-300 font-semibold transition-all border border-gray-700">
                <Bookmark className="w-5 h-5" />
                Save
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              <div className="mb-8">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 bg-[#0f1419] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] transition-all resize-none"
                  rows="3"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="mt-3 px-6 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold flex items-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Post Comment
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="bg-[#0f1419] rounded-xl p-5 border border-gray-800">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                        {comment.userId?.avatar || comment.userId?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-semibold">{comment.userId?.name}</span>
                          <span className="text-gray-500 text-xs">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

// ============================================
// BLOG EDITOR (Create/Edit)
// ============================================
function BlogEditor({ mode, blog, currentUser, onBack, onSuccess }) {
  const [title, setTitle] = useState(blog?.title || '');
  const [content, setContent] = useState(blog?.content || '');
  const [tags, setTags] = useState(blog?.tags?.join(', ') || '');
  const [status, setStatus] = useState(blog?.status || 'draft');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const url = mode === 'create' 
        ? `${API_URL}/blogs`
        : `${API_URL}/blogs/${blog._id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          status
        })
      });

      const data = await response.json();
      if (data.success) {
        onSuccess(data.blog);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-[#1a1f2e] hover:bg-[#8b5cf6]/20 rounded-lg text-white flex items-center gap-2 transition-all border border-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
            >
              <option value="draft">Save as Draft</option>
              <option value="published">Publish</option>
            </select>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] hover:from-[#7c3aed] hover:to-[#c026d3] disabled:opacity-50 rounded-lg text-white font-bold flex items-center gap-2 transition-all"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {mode === 'create' ? 'Create Article' : 'Update Article'}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-8">
          <h2 className="text-3xl font-bold text-white mb-8">
            {mode === 'create' ? 'Write New Article' : 'Edit Article'}
          </h2>

          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2 text-sm">Article Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling title..."
              className="w-full px-4 py-3 bg-[#0f1419] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] transition-all text-lg"
            />
          </div>

          {/* Tags Input */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2 text-sm">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="javascript, react, tutorials (comma separated)"
              className="w-full px-4 py-3 bg-[#0f1419] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] transition-all"
            />
            <p className="text-gray-500 text-xs mt-2">Separate tags with commas</p>
          </div>

          {/* Content Editor */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2 text-sm">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here..."
              className="w-full px-4 py-3 bg-[#0f1419] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] transition-all resize-none font-mono text-sm leading-relaxed"
              rows="20"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-gray-500 text-xs">
                {content.split(/\s+/).filter(Boolean).length} words • {Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)} min read
              </p>
              <p className="text-gray-500 text-xs">
                {content.length} characters
              </p>
            </div>
          </div>

          {/* Preview Section */}
          <div className="mt-8 p-6 bg-[#0f1419] rounded-xl border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-4">Preview</h3>
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-white mb-4">{title || 'Your Title Here'}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.split(',').filter(t => t.trim()).map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-lg text-xs font-medium">
                    {tag.trim()}
                  </span>
                ))}
              </div>
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {content || 'Your content will appear here...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}