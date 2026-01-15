import mongoose from "mongoose";
import dotenv from "dotenv";
import { Topic } from "../models/LearningHub.model.js";

dotenv.config();

const seedTopics = [
  {
    title: "JavaScript Fundamentals",
    description:
      "Master the core concepts of JavaScript including ES6+ features, async programming, and modern best practices",
    domain: "Frontend",
    difficulty: "Beginner",
    icon: "⚡",
    estimatedHours: 15,
    tags: ["javascript", "es6", "fundamentals", "programming"],
    prerequisites: ["Basic HTML", "Basic CSS"],
    isActive: true,
  },
  {
    title: "React.js Complete Guide",
    description:
      "Build modern web applications with React, Hooks, Context API, and state management",
    domain: "Frontend",
    difficulty: "Intermediate",
    icon: "⚛️",
    estimatedHours: 25,
    tags: ["react", "hooks", "components", "jsx"],
    prerequisites: ["JavaScript Basics", "HTML/CSS"],
    isActive: true,
  },
  {
    title: "Node.js & Express Backend",
    description:
      "Create scalable backend applications with Node.js, Express, and RESTful APIs",
    domain: "Backend",
    difficulty: "Intermediate",
    icon: "🟢",
    estimatedHours: 20,
    tags: ["nodejs", "express", "backend", "api"],
    prerequisites: ["JavaScript", "Basic programming"],
    isActive: true,
  },
  {
    title: "MongoDB Database Design",
    description:
      "Learn NoSQL database design, schema modeling, and efficient query patterns",
    domain: "Backend",
    difficulty: "Intermediate",
    icon: "🍃",
    estimatedHours: 18,
    tags: ["mongodb", "database", "nosql", "data-modeling"],
    prerequisites: ["Basic programming", "Database concepts"],
    isActive: true,
  },
  {
    title: "System Design Fundamentals",
    description:
      "Master system design principles, scalability patterns, and distributed systems",
    domain: "System Design",
    difficulty: "Advanced",
    icon: "🏗️",
    estimatedHours: 30,
    tags: [
      "system-design",
      "scalability",
      "architecture",
      "distributed-systems",
    ],
    prerequisites: ["Backend development", "Database knowledge"],
    isActive: true,
  },
  {
    title: "Python for Data Science",
    description:
      "Learn data analysis, visualization, and machine learning with Python",
    domain: "Data Science",
    difficulty: "Intermediate",
    icon: "🐍",
    estimatedHours: 28,
    tags: ["python", "data-science", "pandas", "numpy"],
    prerequisites: ["Basic Python", "Math basics"],
    isActive: true,
  },
  {
    title: "Docker & Kubernetes",
    description:
      "Containerization and orchestration for modern DevOps workflows",
    domain: "DevOps",
    difficulty: "Advanced",
    icon: "🐳",
    estimatedHours: 22,
    tags: ["docker", "kubernetes", "devops", "containers"],
    prerequisites: ["Linux basics", "Backend knowledge"],
    isActive: true,
  },
  {
    title: "React Native Mobile Apps",
    description: "Build cross-platform mobile applications with React Native",
    domain: "Mobile",
    difficulty: "Intermediate",
    icon: "📱",
    estimatedHours: 24,
    tags: ["react-native", "mobile", "ios", "android"],
    prerequisites: ["JavaScript", "React basics"],
    isActive: true,
  },
  {
    title: "Machine Learning Basics",
    description:
      "Introduction to ML algorithms, neural networks, and practical applications",
    domain: "ML",
    difficulty: "Advanced",
    icon: "🤖",
    estimatedHours: 35,
    tags: ["machine-learning", "ai", "neural-networks", "python"],
    prerequisites: ["Python", "Statistics", "Linear Algebra"],
    isActive: true,
  },
  {
    title: "Full Stack Web Development",
    description: "Complete MERN stack development from frontend to deployment",
    domain: "Fullstack",
    difficulty: "Advanced",
    icon: "🌟",
    estimatedHours: 40,
    tags: ["fullstack", "mern", "web-development", "deployment"],
    prerequisites: ["React", "Node.js", "MongoDB"],
    isActive: true,
  },
  {
    title: "TypeScript Mastery",
    description: "Advanced TypeScript for large-scale applications",
    domain: "Frontend",
    difficulty: "Intermediate",
    icon: "🔷",
    estimatedHours: 16,
    tags: ["typescript", "javascript", "types", "advanced"],
    prerequisites: ["JavaScript ES6+"],
    isActive: true,
  },
  {
    title: "AWS Cloud Solutions",
    description:
      "Master AWS services, cloud architecture, and serverless computing",
    domain: "DevOps",
    difficulty: "Advanced",
    icon: "☁️",
    estimatedHours: 32,
    tags: ["aws", "cloud", "serverless", "architecture"],
    prerequisites: ["Backend basics", "Networking"],
    isActive: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("📦 Connected to MongoDB");

    // Clear existing topics (optional)
    await Topic.deleteMany({});
    console.log("🗑️  Cleared existing topics");

    // Insert new topics
    const topics = await Topic.insertMany(seedTopics);
    console.log(`✅ Successfully seeded ${topics.length} topics`);

    mongoose.connection.close();
    console.log("🔒 Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding topics:", error);
    process.exit(1);
  }
}

seed();
