import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
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
        <div className="min-h-screen bg-gray-950 text-white font-sans pt-20">
            <Navbar tone="light" showAuthButtons={false} />

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />

            {/* Hero Section */}
            <section className="relative px-4 pt-16 pb-24 md:pt-24 md:pb-32 max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                    <Sparkles className="w-4 h-4" />
                    <span>Launch Your Dream Career</span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                    Elevate Your <span className="text-emerald-500">Professional</span> Journey
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    Access curated job listings, expert career advice, and premium resources to help you land your next big role.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search jobs, roles, companies..."
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white placeholder:text-gray-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                        Search
                    </button>
                </div>
            </section>

            {/* Main Content */}
            <section className="px-4 pb-24 max-w-7xl mx-auto">
                {/* Navigation Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-gray-900/50 p-1.5 rounded-2xl border border-gray-800 inline-flex">
                        <button
                            onClick={() => setActiveTab("jobs")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "jobs"
                                ? "bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-500/20"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            <Briefcase className="w-4 h-4" />
                            Job Openings
                        </button>
                        <button
                            onClick={() => setActiveTab("resources")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "resources"
                                ? "bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-500/20"
                                : "text-gray-400 hover:text-white"
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
                            <h2 className="text-2xl font-bold">Featured Opportunities</h2>
                            <div className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors text-sm font-medium">
                                View All Jobs <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job) => (
                                <div key={job._id} className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all hover:bg-gray-800/80">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-xl">
                                            {job.company?.[0]}
                                        </div>
                                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold">
                                            {job.type}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1 group-hover:text-emerald-400 transition-colors">{job.title}</h3>
                                    <p className="text-gray-400 mb-6 font-medium">{job.company}</p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-8 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {new Date(job.postedAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <button className="w-full bg-gray-800 hover:bg-emerald-500 hover:text-gray-950 text-white font-bold py-3 px-4 rounded-xl transition-all border border-gray-700 hover:border-emerald-500">
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Latest Resources</h2>
                            <div className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors text-sm font-medium">
                                Browse Library <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {resources.map((resource) => (
                                <div key={resource._id} className="group flex flex-col md:flex-row bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all">
                                    <div className="md:w-1/3 bg-emerald-950/30 flex items-center justify-center p-8 group-hover:bg-emerald-900/20 transition-all border-b md:border-b-0 md:border-r border-gray-800">
                                        <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                                            {resource.type === 'Video' ? <Sparkles className="w-8 h-8" /> : <BookOpen className="w-8 h-8" />}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2 block">{resource.category}</span>
                                            <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">{resource.title}</h3>
                                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{resource.description}</p>
                                        </div>
                                        <Link to="#" className="inline-flex items-center gap-2 text-white font-semibold text-sm hover:gap-3 transition-all">
                                            Read More <ChevronRight className="w-4 h-4 text-emerald-500" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="px-4 py-24 bg-emerald-500/5 border-y border-emerald-500/10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Need expert help with your <span className="text-emerald-500 text-stroke-1">career path?</span></h2>
                            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                                Intervyo providing 1-on-1 mentorship, resume reviews, and strategic career planning to help you navigate the complex tech industry landscape.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Tailored Strategy</h4>
                                        <p className="text-sm text-gray-500">Personalized roadmap based on your goals.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Expert Network</h4>
                                        <p className="text-sm text-gray-500">Connect with industry leading mentors.</p>
                                    </div>
                                </div>
                            </div>
                            <button className="bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-bold py-4 px-10 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 inline-flex items-center gap-3">
                                Talk to an Expert <GraduationCap className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full" />
                            <div className="relative bg-gray-900 border border-gray-800 p-8 md:p-12 rounded-[2rem] shadow-2xl">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                                        <Sparkles className="w-7 h-7 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-lg">Career Growth Tool</h5>
                                        <p className="text-sm text-gray-500">AI-Powered insights</p>
                                    </div>
                                </div>
                                <div className="space-y-4 mb-8">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-4 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500"
                                                style={{ width: `${60 + (i * 10)}%`, opacity: 1 - (i * 0.2) }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed mb-8 italic">
                                    "Intervyo's career resources helped me transition from Junior to Senior Developer within 6 months. The interview prep guides are absolute gold!"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-700 rounded-full" />
                                    <div>
                                        <p className="text-sm font-bold">Alex Johnson</p>
                                        <p className="text-xs text-emerald-500 font-bold">Senior Engineer @ Google</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
