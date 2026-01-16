import mongoose from "mongoose";
import dotenv from "dotenv";
import { JobListing, CareerResource } from "../models/Career.model.js";

dotenv.config();

const jobs = [
    {
        title: "Frontend Developer",
        company: "Intervyo",
        location: "Remote",
        type: "Full-time",
        description: "Join our team to build the future of AI interview preparation.",
        requirements: ["React", "Tailwind CSS", "Node.js"],
        salaryRange: "$80k - $120k",
        applicationUrl: "https://intervyo.xyz/careers/frontend",
        isActive: true
    },
    {
        title: "AI Research Engineer",
        company: "Intervyo",
        location: "Bengaluru, India",
        type: "Full-time",
        description: "Develop cutting-edge LLM integrations for mock interviews.",
        requirements: ["Python", "PyTorch", "LLM experience"],
        salaryRange: "$100k - $160k",
        applicationUrl: "https://intervyo.xyz/careers/ai-research",
        isActive: true
    },
    {
        title: "UI/UX Designer",
        company: "DesignCo",
        location: "Remote",
        type: "Contract",
        description: "Help us create stunning user experiences for our platform.",
        requirements: ["Figma", "Design Systems", "Prototyping"],
        salaryRange: "$50/hr - $80/hr",
        applicationUrl: "https://intervyo.xyz/careers/designer",
        isActive: true
    }
];

const resources = [
    {
        title: "Mastering System Design Interviews",
        type: "Guide",
        description: "A comprehensive guide to acing system design questions.",
        category: "Interview Prep",
        content: "System design basics...",
        featured: true
    },
    {
        title: "Resume Building for Tech Roles",
        type: "Article",
        description: "How to make your resume stand out to FAANG recruiters.",
        category: "Resume Tips",
        content: "Your resume is your first impression...",
        featured: true
    },
    {
        title: "How to Handle Behavioral Questions",
        type: "Video",
        description: "Learn the STAR method to answer tough interview questions.",
        category: "Interview Prep",
        content: "https://youtube.com/example",
        featured: true
    }
];

const seedCareerData = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/intervyo";
        await mongoose.connect(mongoURI);

        console.log("Connected to MongoDB for seeding...");

        await JobListing.deleteMany({});
        await CareerResource.deleteMany({});

        await JobListing.insertMany(jobs);
        await CareerResource.insertMany(resources);

        console.log("✅ Career data seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedCareerData();
