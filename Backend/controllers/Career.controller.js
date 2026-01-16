import { JobListing, CareerResource } from "../models/Career.model.js";

// =====================================
// JOB LISTINGS
// =====================================

export const getJobListings = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            type = "",
            location = ""
        } = req.query;

        const query = { isActive: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        if (type) query.type = type;
        if (location) query.location = { $regex: location, $options: "i" };

        const jobs = await JobListing.find(query)
            .sort({ postedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await JobListing.countDocuments(query);

        res.json({
            success: true,
            jobs,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getJobListingById = async (req, res) => {
    try {
        const job = await JobListing.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// =====================================
// CAREER RESOURCES
// =====================================

export const getCareerResources = async (req, res) => {
    try {
        const { category = "", type = "" } = req.query;
        const query = {};

        if (category) query.category = category;
        if (type) query.type = type;

        const resources = await CareerResource.find(query).sort({ publishedAt: -1 });

        res.json({ success: true, resources });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// =====================================
// FEATURED CONTENT
// =====================================

export const getFeaturedContent = async (req, res) => {
    try {
        const featuredJobs = await JobListing.find({ isActive: true })
            .sort({ postedAt: -1 })
            .limit(3);

        const featuredResources = await CareerResource.find({ featured: true })
            .sort({ publishedAt: -1 })
            .limit(4);

        res.json({
            success: true,
            featured: {
                jobs: featuredJobs,
                resources: featuredResources,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
