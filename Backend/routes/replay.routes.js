import express from "express";
import replayController from "../controllers/InterviewReplay.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

/**
 * Interview Replay Routes
 * 
 * Prefix: /api/replay
 * All routes require authentication
 */

// ============================================
// REPLAY ACCESS
// ============================================

/**
 * Get or create replay for an interview
 * @route GET /api/replay/:interviewId
 * @access Private
 */
router.get("/:interviewId", authenticate, replayController.getReplay);

/**
 * Get shared replay (public access via token)
 * @route GET /api/replay/shared/:shareToken
 * @access Public
 */
router.get("/shared/:shareToken", replayController.getSharedReplay);

/**
 * Get all replays for authenticated user
 * @route GET /api/replay/my-replays
 * @access Private
 * @query page, limit, sortBy, order
 */
router.get("/my-replays", authenticate, replayController.getMyReplays);

/**
 * Get replay statistics
 * @route GET /api/replay/stats
 * @access Private
 */
router.get("/stats", authenticate, replayController.getReplayStats);

// ============================================
// VIEW TRACKING
// ============================================

/**
 * Track replay view
 * @route POST /api/replay/:replayId/view
 * @access Private
 * @body { watchDuration: number }
 */
router.post("/:replayId/view", authenticate, replayController.trackView);

/**
 * Update playback position
 * @route PUT /api/replay/:replayId/position
 * @access Private
 * @body { conversationIndex: number, timestamp: number }
 */
router.put(
  "/:replayId/position",
  authenticate,
  replayController.updatePlaybackPosition
);

// ============================================
// NOTES MANAGEMENT
// ============================================

/**
 * Add a note to replay
 * @route POST /api/replay/:replayId/notes
 * @access Private
 * @body { timestamp, conversationIndex, noteText, category, tags, isBookmarked }
 */
router.post("/:replayId/notes", authenticate, replayController.addNote);

/**
 * Update a note
 * @route PUT /api/replay/:replayId/notes/:noteId
 * @access Private
 * @body { noteText, category, tags, isBookmarked }
 */
router.put(
  "/:replayId/notes/:noteId",
  authenticate,
  replayController.updateNote
);

/**
 * Delete a note
 * @route DELETE /api/replay/:replayId/notes/:noteId
 * @access Private
 */
router.delete(
  "/:replayId/notes/:noteId",
  authenticate,
  replayController.deleteNote
);

/**
 * Search notes across all replays
 * @route GET /api/replay/search/notes
 * @access Private
 * @query q (search query)
 */
router.get("/search/notes", authenticate, replayController.searchNotes);

// ============================================
// BOOKMARKS MANAGEMENT
// ============================================

/**
 * Add a bookmark
 * @route POST /api/replay/:replayId/bookmarks
 * @access Private
 * @body { conversationIndex, label, timestamp, type }
 */
router.post(
  "/:replayId/bookmarks",
  authenticate,
  replayController.addBookmark
);

/**
 * Delete a bookmark
 * @route DELETE /api/replay/:replayId/bookmarks/:bookmarkId
 * @access Private
 */
router.delete(
  "/:replayId/bookmarks/:bookmarkId",
  authenticate,
  replayController.deleteBookmark
);

// ============================================
// SHARING
// ============================================

/**
 * Generate share link for replay
 * @route POST /api/replay/:replayId/share
 * @access Private
 */
router.post(
  "/:replayId/share",
  authenticate,
  replayController.generateShareLink
);

/**
 * Revoke share access
 * @route DELETE /api/replay/:replayId/share
 * @access Private
 */
router.delete(
  "/:replayId/share",
  authenticate,
  replayController.revokeShareAccess
);

export default router;
