import express from "express";
import {
    getJobListings,
    getJobListingById,
    getCareerResources,
    getFeaturedContent,
} from "../controllers/Career.controller.js";

const router = express.Router();

// Job Listings
router.get("/jobs", getJobListings);
router.get("/jobs/:id", getJobListingById);

// Career Resources
router.get("/resources", getCareerResources);

// Featured Content
router.get("/featured", getFeaturedContent);

export default router;
