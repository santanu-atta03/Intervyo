import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Briefcase,
    BookOpen,
    GraduationCap,
    Search,
    Filter,
    ArrowRight,
    MapPin,
    Clock,
    ChevronRight,
    Target,
    Users,
    Sparkles,
} from "lucide-react";
import { apiConnector } from "../services/apiConnector";
import { careerEndpoints } from "../services/apis";
import Navbar from "../components/Navbar";
import SEO from "../components/shared/SEO";
import Footer from "../components/shared/Footer";

const MOCK_JOBS = [
    {
        _id: "1",
        title: "Frontend Developer",
        company: "TechFlow",
        location: "Remote",
        type: "Full-time",
        salaryRange: "$80k - $120k",
        postedAt: new Date().toISOString()
    },
    {
        _id: "2",
        title: "Senior Product Designer",
        company: "Creative Labs",
        location: "New York, NY",
        type: "Full-time",
        salaryRange: "$110k - $150k",
        postedAt: new Date().toISOString()
    },
    {
        _id: "3",
        title: "Backend Engineer (Node.js)",
        company: "CloudScale",
        location: "Remote",
        type: "Full-time",
        salaryRange: "$90k - $140k",
        postedAt: new Date().toISOString()
    }
];

const MOCK_RESOURCES = [
    {
        _id: "1",
        title: "Mastering System Design Interviews",
        type: "Guide",
        category: "Interview Prep",
        description: "A comprehensive guide to acing system design questions."
    },
    {
        _id: "2",
        title: "Resume Building for Tech Roles",
        type: "Article",
        category: "Resume Tips",
        description: "How to make your resume stand out to FAANG recruiters."
    }
];

export default function Career() {
    const [jobs, setJobs] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("jobs");

    useEffect(() => {
        fetchFeaturedContent();
    }, []);

    const fetchFeaturedContent = async () => {
        try {
            const response = await apiConnector("GET", careerEndpoints.GET_FEATURED_API);
            if (response.data.success) {
                const fetchedJobs = response.data.featured.jobs;
                const fetchedResources = response.data.featured.resources;

                if (fetchedJobs && fetchedJobs.length > 0) {
                    setJobs(fetchedJobs);
                } else {
                    // Use mock if empty
                    setJobs(MOCK_JOBS);
                }

                if (fetchedResources && fetchedResources.length > 0) {
                    setResources(fetchedResources);
                } else {
                    // Use mock if empty
                    setResources(MOCK_RESOURCES);
                }
            }
        } catch (error) {
            console.error("Error fetching career content:", error);
            // Fallback mock data if API fails
            setJobs(MOCK_JOBS);
            setResources(MOCK_RESOURCES);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0D12] text-[#F3F4F6] font-sans antialiased selection:bg-[#FFFA64] selection:text-[#0A0D12]">
            <SEO
                title="Careers | Intervyo"
                description="Explore career opportunities and resources to help you take your next step."
                canonical="/career"
            />
            <style>{`
                @font-face {
                    font-family: 'FK Screamer';
                    src: url('https://cdn.ploy.ai/d21bf4ad-2458-43ee-9561-54c28ab0e85f/user/4b73ec13-fkscreamer.woff2') format('woff2');
                    font-weight: 100 900;
                    font-style: normal;
                    font-display: swap;
                }

                .career-heading {
                    font-family: 'FK Screamer', 'Impact', -apple-system, sans-serif;
                    letter-spacing: -0.02em;
                }
            `}</style>
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[680px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(195,219,255,0.12),transparent_58%)]" />

            {/* Hero Section */}
            <section className="relative mx-auto max-w-[1400px] px-4 pb-20 pt-32 text-center sm:px-6 md:pb-28 md:pt-40">
                <h1 className="career-heading mx-auto mb-7 max-w-6xl text-balance text-5xl font-bold uppercase leading-[0.9] text-white sm:text-7xl md:text-8xl lg:text-[112px]">
                    Find your next <span className="text-[#FFFA64]">big move.</span>
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-xl">
                    Access curated job listings, expert career advice, and premium resources to help you land your next big role.
                </p>

                <div className="mx-auto flex max-w-2xl flex-col justify-center gap-3 rounded-2xl border border-white/10 bg-[#131722] p-2 shadow-2xl shadow-black/30 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search jobs, roles, companies..."
                            className="w-full rounded-xl border border-transparent bg-transparent py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#FFFA64]/40"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="rounded-xl bg-white px-8 py-4 font-semibold text-[#0A0D12] transition-colors hover:bg-zinc-200">
                        Search
                    </button>
                </div>
            </section>

            {/* Main Content */}
            <section className="relative mx-auto max-w-[1400px] px-4 pb-24 sm:px-6">
                {/* Navigation Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex rounded-full border border-white/10 bg-[#131722] p-1.5">
                        <button
                            onClick={() => setActiveTab("jobs")}
                            className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all sm:px-7 ${activeTab === "jobs"
                                ? "bg-white text-[#0A0D12]"
                                : "text-zinc-400 hover:text-white"
                                }`}
                        >
                            <Briefcase className="w-4 h-4" />
                            Job Openings
                        </button>
                        <button
                            onClick={() => setActiveTab("resources")}
                            className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all sm:px-7 ${activeTab === "resources"
                                ? "bg-white text-[#0A0D12]"
                                : "text-zinc-400 hover:text-white"
                                }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            Career Resources
                        </button>
                    </div>
                </div>

                {activeTab === "jobs" ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="career-heading text-3xl font-bold uppercase text-white sm:text-4xl">Featured Opportunities</h2>
                            <div className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#FFFA64] transition-colors hover:text-white">
                                View All Jobs <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                <div className="col-span-full rounded-2xl border border-white/10 bg-[#131722] px-6 py-12 text-center text-zinc-400">
                                    Loading opportunities...
                                </div>
                            ) : jobs.map((job) => (
                                <div key={job._id} className="group rounded-2xl border border-white/10 bg-[#131722] p-6 transition-all hover:-translate-y-1 hover:border-[#FFFA64]/40 hover:bg-[#171C28]">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFFA64] text-xl font-bold text-[#0A0D12]">
                                            {job.company?.[0]}
                                        </div>
                                        <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                                            {job.type}
                                        </span>
                                    </div>
                                    <h3 className="mb-1 text-xl font-bold text-white transition-colors group-hover:text-[#FFFA64]">{job.title}</h3>
                                    <p className="mb-6 font-medium text-zinc-400">{job.company}</p>

                                    <div className="mb-8 flex flex-wrap gap-4 text-sm font-medium text-zinc-500">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {new Date(job.postedAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <button className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 font-semibold text-white transition-all hover:border-[#FFFA64] hover:bg-[#FFFA64] hover:text-[#0A0D12]">
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="career-heading text-3xl font-bold uppercase text-white sm:text-4xl">Latest Resources</h2>
                            <div className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#FFFA64] transition-colors hover:text-white">
                                Browse Library <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {loading ? (
                                <div className="col-span-full rounded-2xl border border-white/10 bg-[#131722] px-6 py-12 text-center text-zinc-400">
                                    Loading career resources...
                                </div>
                            ) : resources.map((resource) => (
                                <div key={resource._id} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#131722] transition-all hover:border-[#C3DBFF]/40 md:flex-row">
                                    <div className="flex items-center justify-center border-b border-white/10 bg-[#C3DBFF]/[0.06] p-8 transition-all group-hover:bg-[#C3DBFF]/[0.1] md:w-1/3 md:border-b-0 md:border-r">
                                        <div className="rounded-2xl border border-[#C3DBFF]/20 bg-[#C3DBFF]/10 p-4 text-[#C3DBFF] shadow-xl shadow-[#C3DBFF]/5">
                                            {resource.type === 'Video' ? <Sparkles className="w-8 h-8" /> : <BookOpen className="w-8 h-8" />}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#C3DBFF]">{resource.category}</span>
                                            <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-[#C3DBFF]">{resource.title}</h3>
                                            <p className="mb-6 text-sm leading-relaxed text-zinc-400">{resource.description}</p>
                                        </div>
                                        <Link to="#" className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-all hover:gap-3">
                                            Read More <ChevronRight className="h-4 w-4 text-[#C3DBFF]" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="border-y border-white/10 bg-[#0E121A]/70 px-4 py-24 sm:px-6">
                <div className="mx-auto max-w-[1400px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="career-heading mb-6 text-4xl font-bold uppercase leading-[0.92] text-white md:text-6xl">Need expert help with your <span className="text-[#FFFA64]">career path?</span></h2>
                            <p className="mb-10 text-lg leading-relaxed text-zinc-400">
                                Intervyo providing 1-on-1 mentorship, resume reviews, and strategic career planning to help you navigate the complex tech industry landscape.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FFFA64]/10 text-[#FFFA64]">
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Tailored Strategy</h4>
                                        <p className="text-sm text-zinc-400">Personalized roadmap based on your goals.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C3DBFF]/10 text-[#C3DBFF]">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Expert Network</h4>
                                        <p className="text-sm text-zinc-400">Connect with industry leading mentors.</p>
                                    </div>
                                </div>
                            </div>
                            <button className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-[#0A0D12] shadow-xl transition-all hover:bg-zinc-200">
                                Talk to an Expert <GraduationCap className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-[#C3DBFF]/10 blur-[120px]" />
                            <div className="relative rounded-[2rem] border border-white/10 bg-[#131722] p-8 shadow-2xl md:p-12">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C3DBFF]/20 bg-[#C3DBFF]/10">
                                        <Sparkles className="h-7 w-7 text-[#C3DBFF]" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-lg">Career Growth Tool</h5>
                                        <p className="text-sm text-zinc-400">AI-powered insights</p>
                                    </div>
                                </div>
                                <div className="space-y-4 mb-8">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-4 overflow-hidden rounded-full bg-white/10">
                                            <div
                                                className="h-full bg-[#FFFA64]"
                                                style={{ width: `${60 + (i * 10)}%`, opacity: 1 - (i * 0.2) }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <p className="mb-8 text-sm leading-relaxed text-zinc-300 italic">
                                    "Intervyo's career resources helped me transition from Junior to Senior Developer within 6 months. The interview prep guides are absolute gold!"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-white/10" />
                                    <div>
                                        <p className="text-sm font-bold">Alex Johnson</p>
                                        <p className="text-xs font-bold text-[#FFFA64]">Senior Engineer @ Google</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
