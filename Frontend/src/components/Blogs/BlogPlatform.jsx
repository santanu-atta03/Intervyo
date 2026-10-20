import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Search, Plus, TrendingUp, Clock, Eye, Heart, MessageCircle,
  Tag, User, Calendar, Edit, Trash2, Share2, Bookmark, Filter,
  ChevronRight, Sparkles, X, ArrowLeft, Send, MoreVertical, Star
} from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { BLOG_DATA } from '../../data/blogData';

import { useContext } from "react";
import { ThemeContext } from "../../components/shared/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";
const API_URL = 'https://intervyo.onrender.com/api';
// ============================================
// SEED CONTENT & SKELETON (Add at top)
// ============================================
const SEED_ARTICLES = BLOG_DATA;

const BLOG_CSS = `
.blog-root {
  --blog-ink: #111111;
  --blog-on-ink: #ffffff;
  --blog-canvas: #ffffff;
  --blog-cloud: #f5f5f5;
  --blog-hairline: #cacacb;
  --blog-hairline-soft: #e5e5e5;
  --blog-charcoal: #39393b;
  --blog-mute: #707072;
  --blog-success: #007d48;
  --blog-danger: #d30005;
  --blog-ease: cubic-bezier(.22, 1, .36, 1);

  min-height: 100vh;
  background: var(--blog-canvas);
  color: var(--blog-ink);
  font-family:
    "Helvetica Now Text",
    "Helvetica Neue",
    Inter,
    Helvetica,
    Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
}

.blog-root[data-blog-theme="dark"] {
  --blog-ink: #ffffff;
  --blog-on-ink: #111111;
  --blog-canvas: #111111;
  --blog-cloud: #1f1f21;
  --blog-hairline: #39393b;
  --blog-hairline-soft: #2a2a2c;
  --blog-charcoal: #cacacb;
  --blog-mute: #9e9ea0;
  --blog-success: #1eaa52;
  --blog-danger: #ff5b61;
}

.blog-root *,
.blog-root *::before,
.blog-root *::after {
  box-sizing: border-box;
}

.blog-root button,
.blog-root input,
.blog-root textarea,
.blog-root select {
  font: inherit;
}

.blog-root button {
  cursor: pointer;
}

.blog-root button:disabled {
  cursor: not-allowed;
}

.blog-root :is(button, input, textarea, select, a):focus-visible {
  outline: 2px solid var(--blog-ink);
  outline-offset: 3px;
}

.blog-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px;
}

.blog-header {
  position: sticky;
  top: 0;
  z-index: 50;
  min-height: 72px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--blog-hairline-soft);
  background: color-mix(in srgb, var(--blog-canvas) 92%, transparent);
  backdrop-filter: blur(18px);
}

.blog-header-inner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.blog-brand {
  display: flex;
  align-items: center;
  gap: 11px;
}

.blog-brand-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--blog-ink);
  color: var(--blog-on-ink);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .04em;
}

.blog-brand-name {
  font-size: 15px;
  font-weight: 500;
}

.blog-brand-subtitle {
  margin-top: 2px;
  color: var(--blog-mute);
  font-size: 12px;
}

.blog-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.blog-btn {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 19px;
  border: 0;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  transition:
    transform .2s var(--blog-ease),
    background-color .25s ease,
    color .25s ease,
    opacity .25s ease;
}

.blog-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.blog-btn-primary {
  background: var(--blog-ink);
  color: var(--blog-on-ink);
}

.blog-btn-primary:hover:not(:disabled) {
  background: var(--blog-charcoal);
}

.blog-btn-secondary {
  background: var(--blog-cloud);
  color: var(--blog-ink);
}

.blog-btn-secondary:hover:not(:disabled) {
  background: var(--blog-hairline-soft);
}

.blog-btn:disabled {
  opacity: .4;
}

.blog-main {
  padding: 56px 0 80px;
}

.blog-page-intro {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 30px;
}

.blog-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 29px;
  padding: 0 12px;
  border: 1px solid var(--blog-hairline);
  border-radius: 999px;
  color: var(--blog-mute);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.blog-page-title {
  margin: 17px 0 0;
  font-size: clamp(36px, 6vw, 68px);
  font-weight: 500;
  line-height: .95;
  letter-spacing: -.06em;
  text-transform: uppercase;
}

.blog-page-description {
  max-width: 560px;
  margin: 14px 0 0;
  color: var(--blog-mute);
  font-size: 17px;
  line-height: 1.55;
}

.blog-search {
  position: relative;
  margin-bottom: 30px;
}

.blog-search svg {
  position: absolute;
  top: 50%;
  left: 16px;
  color: var(--blog-mute);
  transform: translateY(-50%);
}

.blog-search input,
.blog-editor-field,
.blog-editor-textarea {
  width: 100%;
  border: 1px solid var(--blog-hairline);
  outline: none;
  background: var(--blog-canvas);
  color: var(--blog-ink);
  transition:
    border-color .25s ease,
    box-shadow .25s ease;
}

.blog-search input {
  height: 52px;
  padding: 0 18px 0 48px;
}

.blog-search input::placeholder,
.blog-editor-field::placeholder,
.blog-editor-textarea::placeholder {
  color: var(--blog-mute);
}

.blog-search input:focus,
.blog-editor-field:focus,
.blog-editor-textarea:focus {
  border-color: var(--blog-ink);
  box-shadow: 0 0 0 3px color-mix(
    in srgb,
    var(--blog-ink) 10%,
    transparent
  );
}

.blog-featured {
  margin-bottom: 42px;
}

.blog-section-heading {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 16px;
}

.blog-section-heading h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.blog-section-heading p {
  margin: 4px 0 0;
  color: var(--blog-mute);
  font-size: 13px;
}

.blog-featured-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.blog-featured-card,
.blog-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--blog-hairline-soft);
  background: var(--blog-canvas);
  cursor: pointer;
  transition:
    transform .35s var(--blog-ease),
    border-color .25s ease,
    box-shadow .25s ease;
}

.blog-featured-card:hover,
.blog-card:hover {
  transform: translateY(-5px);
  border-color: var(--blog-hairline);
  box-shadow: 0 18px 44px rgba(17, 17, 17, .08);
}

.blog-featured-cover {
  height: 150px;
  display: grid;
  place-items: center;
  background:
    linear-gradient(
      135deg,
      var(--blog-ink),
      var(--blog-charcoal)
    );
  color: var(--blog-on-ink);
}

.blog-featured-cover span {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 50%;
}

.blog-card-body {
  padding: 20px;
}

.blog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.blog-tag {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 9px;
  border: 1px solid var(--blog-hairline);
  border-radius: 999px;
  color: var(--blog-mute);
  font-size: 11px;
  font-weight: 500;
}

.blog-tag.is-selected {
  border-color: var(--blog-ink);
  background: var(--blog-ink);
  color: var(--blog-on-ink);
}

.blog-card-title {
  margin: 14px 0 0;
  color: var(--blog-ink);
  font-size: 19px;
  font-weight: 500;
  line-height: 1.2;
}

.blog-card-excerpt {
  margin: 9px 0 0;
  color: var(--blog-mute);
  font-size: 13px;
  line-height: 1.55;
}

.blog-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1px solid var(--blog-hairline-soft);
  color: var(--blog-mute);
  font-size: 12px;
}

.blog-card-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.blog-card-stat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.blog-layout {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 32px;
}

.blog-sidebar {
  align-self: start;
  position: sticky;
  top: 96px;
}

.blog-sidebar-card {
  padding: 20px;
  border: 1px solid var(--blog-hairline-soft);
  background: var(--blog-cloud);
}

.blog-sidebar-card + .blog-sidebar-card {
  margin-top: 8px;
}

.blog-sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: var(--blog-ink);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: .04em;
  text-transform: uppercase;
}

.blog-sort-list {
  display: grid;
  gap: 5px;
}

.blog-sort-button {
  width: 100%;
  min-height: 38px;
  padding: 0 11px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--blog-mute);
  text-align: left;
  font-size: 13px;
  transition:
    background-color .25s ease,
    color .25s ease,
    border-color .25s ease;
}

.blog-sort-button:hover,
.blog-sort-button.is-active {
  border-color: var(--blog-hairline);
  background: var(--blog-canvas);
  color: var(--blog-ink);
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.blog-card-author {
  display: flex;
  align-items: center;
  gap: 9px;
}

.blog-avatar {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--blog-ink);
  color: var(--blog-on-ink);
  font-size: 13px;
  font-weight: 500;
}

.blog-author-name {
  color: var(--blog-ink);
  font-size: 13px;
  font-weight: 500;
}

.blog-author-role {
  margin-top: 2px;
  color: var(--blog-mute);
  font-size: 10px;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.blog-pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 28px;
}

.blog-page-button {
  min-width: 38px;
  height: 38px;
  padding: 0 13px;
  border: 1px solid var(--blog-hairline);
  border-radius: 999px;
  background: var(--blog-canvas);
  color: var(--blog-mute);
  font-size: 12px;
  font-weight: 500;
}

.blog-page-button:hover:not(:disabled),
.blog-page-button.is-active {
  background: var(--blog-ink);
  color: var(--blog-on-ink);
}

.blog-page-button:disabled {
  opacity: .35;
}

.blog-detail {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 0 80px;
}

.blog-detail-article {
  border: 1px solid var(--blog-hairline-soft);
  background: var(--blog-canvas);
  box-shadow: 0 22px 70px rgba(17, 17, 17, .06);
}

.blog-detail-cover {
  height: 260px;
  display: grid;
  place-items: center;
  background: var(--blog-ink);
  color: var(--blog-on-ink);
}

.blog-detail-cover span {
  width: 66px;
  height: 66px;
  display: grid;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 50%;
}

.blog-detail-body {
  padding: 42px;
}

.blog-detail-author {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.blog-detail-author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.blog-detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 6px;
  color: var(--blog-mute);
  font-size: 12px;
}

.blog-detail-title {
  margin: 0;
  color: var(--blog-ink);
  font-size: clamp(34px, 6vw, 62px);
  font-weight: 500;
  line-height: .98;
  letter-spacing: -.055em;
}

.blog-detail-content {
  margin-top: 30px;
  padding-top: 28px;
  border-top: 1px solid var(--blog-hairline-soft);
  color: var(--blog-mute);
  font-size: 17px;
  line-height: 1.8;
  white-space: pre-wrap;
}

.blog-detail-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 30px;
  padding-top: 22px;
  border-top: 1px solid var(--blog-hairline-soft);
}

.blog-comments {
  margin-top: 42px;
  padding-top: 30px;
  border-top: 1px solid var(--blog-hairline-soft);
}

.blog-comment-form {
  margin-top: 18px;
}

.blog-comment-form textarea {
  width: 100%;
  min-height: 110px;
  padding: 14px;
  resize: vertical;
}

.blog-comment {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-top: 8px;
  padding: 16px;
  background: var(--blog-cloud);
}

.blog-comment-content {
  min-width: 0;
  flex: 1;
}

.blog-comment-meta {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--blog-ink);
  font-size: 13px;
  font-weight: 500;
}

.blog-comment-date {
  color: var(--blog-mute);
  font-size: 11px;
  font-weight: 400;
}

.blog-comment p {
  margin: 7px 0 0;
  color: var(--blog-mute);
  font-size: 13px;
  line-height: 1.55;
}

.blog-editor {
  max-width: 1000px;
  margin: 0 auto;
  padding: 48px 0 80px;
}

.blog-editor-card {
  padding: 38px;
  border: 1px solid var(--blog-hairline-soft);
  background: var(--blog-canvas);
  box-shadow: 0 22px 70px rgba(17, 17, 17, .06);
}

.blog-editor-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
}

.blog-editor-title {
  margin: 0;
  color: var(--blog-ink);
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -.04em;
}

.blog-editor-field,
.blog-editor-textarea {
  padding: 14px 16px;
}

.blog-editor-field {
  height: 50px;
}

.blog-editor-textarea {
  min-height: 380px;
  resize: vertical;
  line-height: 1.65;
}

.blog-editor-label {
  display: block;
  margin-bottom: 8px;
  color: var(--blog-ink);
  font-size: 13px;
  font-weight: 500;
}

.blog-editor-group {
  margin-top: 22px;
}

.blog-editor-help {
  margin-top: 6px;
  color: var(--blog-mute);
  font-size: 11px;
}

.blog-editor-preview {
  margin-top: 30px;
  padding: 24px;
  border: 1px solid var(--blog-hairline-soft);
  background: var(--blog-cloud);
}

.blog-editor-preview h3 {
  margin: 0;
  color: var(--blog-ink);
  font-size: 18px;
  font-weight: 500;
}

.blog-editor-preview-content {
  margin-top: 20px;
  color: var(--blog-mute);
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
}

.blog-empty,
.blog-loading {
  min-height: 260px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 12px;
  border: 1px solid var(--blog-hairline-soft);
  background: var(--blog-cloud);
  color: var(--blog-mute);
  text-align: center;
}

.blog-spinner {
  width: 42px;
  height: 42px;
  border: 2px solid var(--blog-hairline);
  border-top-color: var(--blog-ink);
  border-radius: 50%;
  animation: blog-spin 1s linear infinite;
}

.blog-skeleton {
  height: 260px;
  background: var(--blog-cloud);
  animation: blog-pulse 1.5s ease-in-out infinite;
}

@keyframes blog-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes blog-pulse {
  0%,
  100% {
    opacity: .55;
  }

  50% {
    opacity: 1;
  }
}

@media (max-width: 1000px) {
  .blog-container {
    padding-left: 32px;
    padding-right: 32px;
  }

  .blog-featured-grid {
    grid-template-columns: 1fr;
  }

  .blog-layout {
    grid-template-columns: 1fr;
  }

  .blog-sidebar {
    position: static;
  }
}

@media (max-width: 640px) {
  .blog-container {
    padding-left: 16px;
    padding-right: 16px;
  }

  .blog-page-intro,
  .blog-editor-top,
  .blog-detail-author {
    align-items: flex-start;
    flex-direction: column;
  }

  .blog-main {
    padding-top: 32px;
  }

  .blog-grid {
    grid-template-columns: 1fr;
  }

  .blog-detail-body,
  .blog-editor-card {
    padding: 24px 17px;
  }

  .blog-detail-cover {
    height: 190px;
  }

  .blog-detail-title {
    font-size: 38px;
  }

  .blog-header-inner {
    padding-left: 16px;
    padding-right: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .blog-root *,
  .blog-root *::before,
  .blog-root *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;

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
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(slug ? "detail" : "list");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("-publishedAt");
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { theme } = useContext(ThemeContext);
const blogTheme = theme === "dark" ? "dark" : "light";

  const [currentUser, setCurrentUser] = useState({
    id: "user123",
    name: "Manmohan Atta",
    avatar: "M",
  });

  useEffect(() => {
    fetchBlogs();
    fetchFeaturedBlogs();
    fetchPopularTags();
    
    if (slug) {
      viewBlog(slug);
    } else {
      setCurrentPage("list");
      setSelectedBlog(null);
    }
  }, [searchQuery, selectedTag, sortBy, currentPageNum, slug]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPageNum, limit: 12, search: searchQuery, tag: selectedTag, sort: sortBy
      });
      const response = await fetch(`${API_URL}/blogs?${params}`);
      const data = await response.json();

      if (data.success) {
        // Merge seed articles with API blogs, avoiding duplicates by slug or ID
        const apiSlugs = new Set(data.blogs.map(b => b.slug));
        const apiIds = new Set(data.blogs.map(b => b._id));
        const uniqueSeeds = SEED_ARTICLES.filter(s => !apiSlugs.has(s.slug) && !apiIds.has(s._id));
        
        setBlogs([...uniqueSeeds, ...data.blogs]);
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
      if (data.success) {
        const apiSlugs = new Set(data.blogs.map(b => b.slug));
        const featuredSeeds = SEED_ARTICLES.filter(b => b.featured && !apiSlugs.has(b.slug));
        setFeaturedBlogs([...featuredSeeds, ...data.blogs]);
      } else {
        setFeaturedBlogs(SEED_ARTICLES.filter(b => b.featured));
      }
    } catch (error) {
      console.error("Error fetching featured blogs:", error);
      setFeaturedBlogs(SEED_ARTICLES.filter(b => b.featured));
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
      if (data.success) {
        setPopularTags(data.tags);
      } else {
        // Fallback: extract unique tags from SEED_ARTICLES
        const tags = [...new Set(SEED_ARTICLES.flatMap(blog => blog.tags))].map(tag => ({ name: tag }));
        setPopularTags(tags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      const tags = [...new Set(SEED_ARTICLES.flatMap(blog => blog.tags))].map(tag => ({ name: tag }));
      setPopularTags(tags);
    }
  };

  const viewBlog = async (blog) => {
    // If we already have the blog object (from the list), we can just use it
    if (blog && typeof blog === 'object') {
      setSelectedBlog(blog);
      setCurrentPage("detail");
      navigate(`/blog/${blog.slug}`);
      return;
    }

    const slugOrId = blog;
    try {
      const response = await fetch(`${API_URL}/blogs/${slugOrId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedBlog(data.blog);
        setCurrentPage("detail");
      } else {
        // Fallback to SEED_ARTICLES
        const foundBlog = SEED_ARTICLES.find(b => b.slug === slugOrId || b._id === slugOrId);
        if (foundBlog) {
          setSelectedBlog(foundBlog);
          setCurrentPage("detail");
        }
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      // Fallback to SEED_ARTICLES
      const foundBlog = SEED_ARTICLES.find(b => b.slug === slugOrId || b._id === slugOrId);
      if (foundBlog) {
        setSelectedBlog(foundBlog);
        setCurrentPage("detail");
      }
    }
  };

  return (
  <div className="blog-root" data-blog-theme={blogTheme}>
    <style>{BLOG_CSS}</style>

    <BlogHeader
      onCreateBlog={() => setCurrentPage("create")}
      onBack={() => {
        setCurrentPage("list");
        navigate("/blog");
      }}
    />

    {currentPage === "list" && (
      <BlogList
        blogs={displayBlogs}
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
        onCreateBlog={() => setCurrentPage("create")}
        currentUser={currentUser}
      />
    )}

    {currentPage === "detail" && selectedBlog && (
      <BlogDetail
        blog={selectedBlog}
        currentUser={currentUser}
        onBack={() => {
          setCurrentPage("list");
          navigate("/blog");
        }}
        onEdit={() => setCurrentPage("edit")}
      />
    )}

    {currentPage === "create" && (
      <BlogEditor
        mode="create"
        currentUser={currentUser}
        onBack={() => setCurrentPage("list")}
        onSuccess={() => {
          setCurrentPage("list");
          fetchBlogs();
        }}
      />
    )}

    {currentPage === "edit" && selectedBlog && (
      <BlogEditor
        mode="edit"
        blog={selectedBlog}
        currentUser={currentUser}
        onBack={() => setCurrentPage("detail")}
        onSuccess={(updatedBlog) => {
          setSelectedBlog(updatedBlog);
          setCurrentPage("detail");
          fetchBlogs();
        }}
      />
    )}
  </div>
);
}

function BlogHeader({ onCreateBlog, onBack }) {
  return (
    <header className="blog-header">
      <div className="blog-container blog-header-inner">
        <button
          type="button"
          className="blog-brand"
          onClick={onBack}
          style={{
            border: 0,
            padding: 0,
            background: "transparent",
            textAlign: "left",
          }}
        >
          <span className="blog-brand-mark">IH</span>

          <span>
            <span className="blog-brand-name">Intervyo Knowledge Hub</span>
            <span className="blog-brand-subtitle">
              Learn, share, and grow together
            </span>
          </span>
        </button>

        <div className="blog-header-actions">
          <ThemeToggle />

          <button
            type="button"
            className="blog-btn blog-btn-primary"
            onClick={onCreateBlog}
          >
            <Plus size={16} />
            Write article
          </button>
        </div>
      </div>
    </header>
  );
}

// ============================================
// BLOG LIST PAGE
// ============================================
function BlogList({
  blogs,
  featuredBlogs,
  popularTags,
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  sortBy,
  setSortBy,
  loading,
  currentPage,
  totalPages,
  setCurrentPage,
  onViewBlog,
  onCreateBlog,
}) {
  return (
    <main className="blog-main">
      <div className="blog-container">
        <section className="blog-page-intro">
          <div>
            <span className="blog-kicker">Intervyo knowledge hub</span>

            <h1 className="blog-page-title">
              Ideas worth
              <br />
              sharing.
            </h1>

            <p className="blog-page-description">
              Practical insights, interview strategies, and lessons from
              the developer community.
            </p>
          </div>

          <button
            type="button"
            className="blog-btn blog-btn-secondary"
            onClick={onCreateBlog}
          >
            <Plus size={16} />
            Create article
          </button>
        </section>

        <div className="blog-search">
          <Search size={18} />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search articles, topics, or tags"
            aria-label="Search articles"
          />
        </div>

        {featuredBlogs.length > 0 && (
          <section className="blog-featured">
            <div className="blog-section-heading">
              <Star size={18} />
              <div>
                <h2>Featured articles</h2>
                <p>Selected ideas from the community.</p>
              </div>
            </div>

            <div className="blog-featured-grid">
              {featuredBlogs.slice(0, 3).map((blog) => (
                <article
                  key={blog._id || blog.slug}
                  className="blog-featured-card"
                  onClick={() => onViewBlog(blog)}
                >
                  <div className="blog-featured-cover">
                    <span>
                      <Star size={21} />
                    </span>
                  </div>

                  <div className="blog-card-body">
                    <div className="blog-tags">
                      {(blog.tags || []).slice(0, 2).map((tag) => (
                        <span className="blog-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="blog-card-title">{blog.title}</h3>

                    <p className="blog-card-excerpt">
                      {blog.excerpt}
                    </p>

                    <div className="blog-card-footer">
                      <span className="blog-card-stat">
                        <Heart size={14} />
                        {blog.likesCount || 0}
                      </span>

                      <span className="blog-card-stat">
                        <Clock size={14} />
                        {blog.readTime || 1} min
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="blog-layout">
          <aside className="blog-sidebar">
            <div className="blog-sidebar-card">
              <div className="blog-sidebar-title">
                <Filter size={15} />
                Discover
              </div>

              <div className="blog-sort-list">
                {[
                  {
                    label: "Latest stories",
                    value: "-publishedAt",
                  },
                  {
                    label: "Most viewed",
                    value: "-views",
                  },
                  {
                    label: "Highly rated",
                    value: "-likes",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`blog-sort-button ${
                      sortBy === option.value ? "is-active" : ""
                    }`}
                    onClick={() => setSortBy(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="blog-sidebar-card">
              <div className="blog-sidebar-title">
                <Tag size={15} />
                Topics
              </div>

              <div className="blog-tags">
                <button
                  type="button"
                  className={`blog-tag ${
                    !selectedTag ? "is-selected" : ""
                  }`}
                  onClick={() => setSelectedTag("")}
                >
                  All topics
                </button>

                {popularTags.map((tag) => (
                  <button
                    type="button"
                    key={tag.name}
                    className={`blog-tag ${
                      selectedTag === tag.name ? "is-selected" : ""
                    }`}
                    onClick={() => setSelectedTag(tag.name)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section>
            {loading ? (
              <div className="blog-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div className="blog-skeleton" key={index} />
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <div className="blog-empty">
                <BookOpen size={28} />
                <strong>No articles found</strong>
                <span>Try another search or write the first article.</span>

                <button
                  type="button"
                  className="blog-btn blog-btn-primary"
                  onClick={onCreateBlog}
                >
                  <Plus size={16} />
                  Write article
                </button>
              </div>
            ) : (
              <>
                <div className="blog-grid">
                  {blogs.map((blog) => (
                    <BlogCard
                      key={blog._id || blog.slug}
                      blog={blog}
                      onView={onViewBlog}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="blog-pagination">
                    <button
                      type="button"
                      className="blog-page-button"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                    >
                      Previous
                    </button>

                    {Array.from({
                      length: Math.min(5, totalPages),
                    }).map((_, index) => {
                      const page = index + 1;

                      return (
                        <button
                          type="button"
                          key={page}
                          className={`blog-page-button ${
                            currentPage === page ? "is-active" : ""
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      className="blog-page-button"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage(
                          Math.min(totalPages, currentPage + 1),
                        )
                      }
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

// ============================================
// BLOG CARD COMPONENT
// ============================================
function BlogCard({ blog, onView }) {
  return (
    <motion.article
      layout
      className="blog-card"
      onClick={() => onView(blog)}
      whileHover={{ y: -5 }}
    >
      <div className="blog-card-body">
        <div className="blog-card-author">
          <span className="blog-avatar">
            {blog.author?.avatar ||
              blog.author?.name?.charAt(0) ||
              "U"}
          </span>

          <span>
            <span className="blog-author-name">
              {blog.author?.name || "Intervyo member"}
            </span>

            <span className="blog-author-role">
              Community contributor
            </span>
          </span>
        </div>

        <h3 className="blog-card-title">{blog.title}</h3>

        <p className="blog-card-excerpt">
          {blog.excerpt ||
            blog.content?.slice(0, 150) ||
            "Read this article from the Intervyo community."}
        </p>

        <div className="blog-tags" style={{ marginTop: 18 }}>
          {(blog.tags || []).slice(0, 3).map((tag) => (
            <span className="blog-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className="blog-card-footer">
          <div className="blog-card-stats">
            <span className="blog-card-stat">
              <Heart size={14} />
              {blog.likesCount || 0}
            </span>

            <span className="blog-card-stat">
              <MessageCircle size={14} />
              {blog.commentsCount || 0}
            </span>

            <span className="blog-card-stat">
              <Eye size={14} />
              {blog.views || 0}
            </span>
          </div>

          <ChevronRight size={17} />
        </div>
      </div>
    </motion.article>
  );
}
// ============================================
// BLOG DETAIL PAGE
// ============================================
function BlogDetail({ blog, currentUser, onBack, onEdit }) {
  // Keep your existing state and API handlers.

  return (
    <main className="blog-detail">
      <Helmet>
        <title>{blog.title} | Intervyo Blog</title>
        <meta
          name="description"
          content={
            blog.excerpt || blog.content?.substring(0, 160)
          }
        />
      </Helmet>

      <button
        type="button"
        className="blog-btn blog-btn-secondary"
        onClick={onBack}
        style={{ marginBottom: 20 }}
      >
        <ArrowLeft size={16} />
        Back to articles
      </button>

      <article className="blog-detail-article">
        <div className="blog-detail-cover">
          <span>
            <BookOpen size={28} />
          </span>
        </div>

        <div className="blog-detail-body">
          <div className="blog-detail-author">
            <div className="blog-detail-author-info">
              <span className="blog-avatar">
                {blog.author?.avatar ||
                  blog.author?.name?.charAt(0) ||
                  "U"}
              </span>

              <div>
                <strong className="blog-author-name">
                  {blog.author?.name || "Intervyo member"}
                </strong>

                <div className="blog-detail-meta">
                  <span>
                    <Calendar size={13} />
                    {new Date(
                      blog.publishedAt || Date.now(),
                    ).toLocaleDateString()}
                  </span>

                  <span>
                    <Clock size={13} />
                    {blog.readTime || 1} min read
                  </span>

                  <span>
                    <Eye size={13} />
                    {blog.views || 0} views
                  </span>
                </div>
              </div>
            </div>

            {blog.author?._id === currentUser?.id && (
              <button
                type="button"
                className="blog-btn blog-btn-secondary"
                onClick={onEdit}
              >
                <Edit size={15} />
                Edit
              </button>
            )}
          </div>

          <h1 className="blog-detail-title">{blog.title}</h1>

          <div className="blog-tags" style={{ marginTop: 24 }}>
            {(blog.tags || []).map((tag) => (
              <span className="blog-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className="blog-detail-content">
            {blog.content}
          </div>

          <div className="blog-detail-actions">
            <button
              type="button"
              className="blog-btn blog-btn-primary"
              onClick={handleLike}
            >
              <Heart fill={liked ? "currentColor" : "none"} size={16} />
              {likesCount}
            </button>

            <button
              type="button"
              className="blog-btn blog-btn-secondary"
            >
              <Share2 size={16} />
              Share
            </button>

            <button
              type="button"
              className="blog-btn blog-btn-secondary"
            >
              <Bookmark size={16} />
              Save
            </button>
          </div>

          <section className="blog-comments">
            <div className="blog-section-heading">
              <MessageCircle size={18} />
              <div>
                <h2>Comments</h2>
                <p>{comments.length} community responses</p>
              </div>
            </div>

            <div className="blog-comment-form">
              <textarea
                value={newComment}
                onChange={(event) =>
                  setNewComment(event.target.value)
                }
                className="blog-editor-textarea"
                placeholder="Share your thoughts..."
              />

              <button
                type="button"
                className="blog-btn blog-btn-primary"
                style={{ marginTop: 10 }}
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                <Send size={15} />
                Post comment
              </button>
            </div>

            <div style={{ marginTop: 24 }}>
              {comments.map((comment) => (
                <div className="blog-comment" key={comment._id}>
                  <span className="blog-avatar">
                    {comment.userId?.avatar ||
                      comment.userId?.name?.charAt(0) ||
                      "U"}
                  </span>

                  <div className="blog-comment-content">
                    <div className="blog-comment-meta">
                      <span>
                        {comment.userId?.name || "Community member"}
                      </span>

                      <span className="blog-comment-date">
                        {new Date(
                          comment.createdAt || Date.now(),
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <p>{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}

// ============================================
// BLOG EDITOR (Create/Edit)
// ============================================
function BlogEditor({
  mode,
  blog,
  onBack,
  onSuccess,
}) {
  // Keep your existing state and handleSave function.

  return (
    <main className="blog-editor">
      <div className="blog-editor-top">
        <button
          type="button"
          className="blog-btn blog-btn-secondary"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          Cancel
        </button>

        <div className="blog-header-actions">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="blog-editor-field"
            style={{ width: "auto", height: 44 }}
          >
            <option value="draft">Save as draft</option>
            <option value="published">Publish</option>
          </select>

          <button
            type="button"
            className="blog-btn blog-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save article"}
            <Send size={15} />
          </button>
        </div>
      </div>

      <section className="blog-editor-card">
        <span className="blog-kicker">
          {mode === "create" ? "New article" : "Edit article"}
        </span>

        <h1 className="blog-editor-title" style={{ marginTop: 16 }}>
          {mode === "create"
            ? "Write something useful."
            : "Refine your article."}
        </h1>

        <div className="blog-editor-group">
          <label className="blog-editor-label" htmlFor="blog-title">
            Article title
          </label>

          <input
            id="blog-title"
            className="blog-editor-field"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter a clear, useful title"
          />
        </div>

        <div className="blog-editor-group">
          <label className="blog-editor-label" htmlFor="blog-tags">
            Topics
          </label>

          <input
            id="blog-tags"
            className="blog-editor-field"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="javascript, react, interviews"
          />

          <div className="blog-editor-help">
            Separate topics with commas.
          </div>
        </div>

        <div className="blog-editor-group">
          <label className="blog-editor-label" htmlFor="blog-content">
            Content
          </label>

          <textarea
            id="blog-content"
            className="blog-editor-textarea"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write your article here..."
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 7,
              color: "var(--blog-mute)",
              fontSize: 11,
            }}
          >
            <span>
              {content.split(/\s+/).filter(Boolean).length} words
            </span>
            <span>{content.length} characters</span>
          </div>
        </div>

        <div className="blog-editor-preview">
          <div className="blog-section-heading">
            <Eye size={17} />
            <div>
              <h2>Preview</h2>
              <p>How your article will appear to readers.</p>
            </div>
          </div>

          <h3 style={{ marginTop: 24 }}>
            {title || "Your article title"}
          </h3>

          <div className="blog-tags" style={{ marginTop: 14 }}>
            {tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
              .map((tag) => (
                <span className="blog-tag" key={tag}>
                  {tag}
                </span>
              ))}
          </div>

          <div className="blog-editor-preview-content">
            {content || "Your article content will appear here."}
          </div>
        </div>
      </section>
    </main>
  );
}
