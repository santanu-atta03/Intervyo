import InterviewReplay from "../models/InterviewReplay.model.js";
import Interview from "../models/Interview.model.js";
import InterviewSession from "../models/InterviewSession.js";

/**
 * Interview Replay Controller
 * 
 * Provides endpoints for:
 * - Getting replay data with conversation playback
 * - Adding/updating/deleting notes
 * - Managing bookmarks
 * - Tracking replay views
 * - Searching within interviews
 * - Sharing replays
 */

class InterviewReplayController {
  /**
   * Get or create replay for an interview
   * GET /api/replay/:interviewId
   */
  async getReplay(req, res) {
    try {
      const { interviewId } = req.params;
      const userId = req.user.id;

      // Verify interview exists and belongs to user
      const interview = await Interview.findOne({
        _id: interviewId,
        userId,
        status: "completed",
      });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found or not completed",
        });
      }

      // Get session for conversation data
      const session = await InterviewSession.findOne({
        interviewId,
      }).select("conversation questionEvaluations technicalScore communicationScore problemSolvingScore");

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Interview session not found",
        });
      }

      // Get or create replay
      const replay = await InterviewReplay.getOrCreate(
        interviewId,
        userId,
        session._id
      );

      // Populate full data
      await replay.populate([
        {
          path: "interviewId",
          select: "role difficulty duration overallScore completedAt createdAt status targetCompany",
        },
      ]);

      res.json({
        success: true,
        data: {
          replay,
          conversation: session.conversation,
          evaluations: session.questionEvaluations,
          scores: {
            technical: session.technicalScore,
            communication: session.communicationScore,
            problemSolving: session.problemSolvingScore,
          },
        },
      });
    } catch (error) {
      console.error("Get replay error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get replay",
        error: error.message,
      });
    }
  }

  /**
   * Get shared replay (public access via token)
   * GET /api/replay/shared/:shareToken
   */
  async getSharedReplay(req, res) {
    try {
      const { shareToken } = req.params;

      const replay = await InterviewReplay.findOne({
        shareToken,
        isPublic: true,
      })
        .populate({
          path: "interviewId",
          select: "role difficulty duration overallScore completedAt",
        })
        .populate({
          path: "sessionId",
          select: "conversation questionEvaluations",
        });

      if (!replay) {
        return res.status(404).json({
          success: false,
          message: "Shared replay not found or access revoked",
        });
      }

      // Track view (but don't increment for shared views)
      res.json({
        success: true,
        data: {
          replay: {
            interviewInfo: replay.interviewId,
            conversation: replay.sessionId?.conversation,
            notes: replay.notes,
            bookmarks: replay.bookmarks,
            createdAt: replay.createdAt,
          },
        },
      });
    } catch (error) {
      console.error("Get shared replay error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get shared replay",
        error: error.message,
      });
    }
  }

  /**
   * Track replay view
   * POST /api/replay/:replayId/view
   */
  async trackView(req, res) {
    try {
      const { replayId } = req.params;
      const { watchDuration } = req.body; // in seconds
      const userId = req.user.id;

      const replay = await InterviewReplay.findOne({
        _id: replayId,
        userId,
      });

      if (!replay) {
        return res.status(404).json({
          success: false,
          message: "Replay not found",
        });
      }

      await replay.trackView(watchDuration || 0);

      res.json({
        success: true,
        message: "View tracked",
        data: {
          viewCount: replay.viewCount,
          totalWatchTime: replay.totalWatchTime,
        },
      });
    } catch (error) {
      console.error("Track view error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to track view",
        error: error.message,
      });
    }
  }

  /**
   * Add a note to replay
   * POST /api/replay/:replayId/notes
   */
  async addNote(req, res) {
    try {
      const { replayId } = req.params;
      const { timestamp, conversationIndex, noteText, category, tags, isBookmarked } =
        req.body;
      const userId = req.user.id;

      // Validation
      if (!noteText || noteText.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Note text is required",
        });
      }

      if (conversationIndex === undefined || timestamp === undefined) {
        return res.status(400).json({
          success: false,
          message: "conversationIndex and timestamp are required",
        });
      }

      const replay = await InterviewReplay.findOne({
        _id: replayId,
        userId,
      });

      if (!replay) {
        return res.status(404).json({
          success: false,
          message: "Replay not found",
        });
      }

      await replay.addNote({
        timestamp,
        conversationIndex,
        noteText: noteText.trim(),
        category: category || "general",
        tags: tags || [],
        isBookmarked: isBookmarked || false,
      });

      res.json({
        success: true,
        message: "Note added successfully",
        data: {
          note: replay.notes[replay.notes.length - 1],
          notesCount: replay.notesCount,
        },
      });
    } catch (error) {
      console.error("Add note error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to add note",
        error: error.message,
      });
    }
  }

  /**
   * Update a note
   * PUT /api/replay/:replayId/notes/:noteId
   */
  async updateNote(req, res) {
    try {
      const { replayId, noteId } = req.params;
      const { noteText, category, tags, isBookmarked } = req.body;
      const userId = req.user.id;

      const replay = await InterviewReplay.findOne({
        _id: replayId,
        userId,
      });

      if (!replay) {
        return res.status(404).json({
          success: false,
          message: "Replay not found",
        });
      }

      const updates = {};
      if (noteText !== undefined) updates.noteText = noteText.trim();
      if (category !== undefined) updates.category = category;
      if (tags !== undefined) updates.tags = tags;
      if (isBookmarked !== undefined) updates.isBookmarked = isBookmarked;

      await replay.updateNote(noteId, updates);

      res.json({
        success: true,
        message: "Note updated successfully",
        data: {
          note: replay.notes.id(noteId),
        },
      });
    } catch (error) {
      console.error("Update note error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update note",
        error: error.message,
      });
    }
  }

  /**
   * Delete a note
   * DELETE /api/replay/:replayId/notes/:noteId
   */
  async deleteNote(req, res) {
    try {
      const { replayId, noteId } = req.params;
      const userId = req.user.id;

      const replay = await InterviewReplay.findOne({
        _id: replayId,
        userId,
      });

      if (!replay) {
        return res.status(404).json({
          success: false,
          message: "Replay not found",
        });
      }

      await replay.deleteNote(noteId);

      res.json({
        success: true,
        message: "Note deleted successfully",
        data: {
          notesCount: replay.notesCount,
        },
      });
    } catch (error) {
      console.error("Delete note error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete note",
        error: error.message,
      });
    }
  }

  /**
   * Add a bookmark
   * POST /api/replay/:replayId/bookmarks
   */
  async addBookmark(req, res) {
    try {
      const { replayId } = req.params;
      const { conversationIndex, label, timestamp, type } = req.body;
      const userId = req.user.id;

      if (
        conversationIndex === undefined ||
        !label ||
        timestamp === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "conversationIndex, label, and timestamp are required",
        });
      }

      const replay = await InterviewReplay.findOne({
        _id: replayId,
        userId,
      });

      if (!replay) {
        return res.status(404).json({
          success: false,
          message: "Replay not found",
        });
      }

      await replay.addBookmark({
        conversationIndex,
        label: label.trim(),
        timestamp,
        type: type || "custom",
      });

      res.json({
        success: true,
        message: "Bookmark added successfully",
        data: {
          bookmark: replay.bookmarks[replay.bookmarks.length - 1],
          bookmarksCount: replay.bookmarksCount,
        },
      });
    } catch (error) {
      console.error("Add bookmark error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to add bookmark",
        error: error.message,
      });
    }
  }

  /**
   * Delete a bookmark
   * DELETE /api/replay/:replayId/bookmarks/:bookmarkId
   */
  async deleteBookmark(req, res) {
    try {
      const { replayId, bookmarkId } = req.params;
      const userId = req.user.id;

      const replay = await InterviewReplay.findOne({
        _id: replayId,
        userId,
      });

      if (!replay) {
        return res.status(404).json({
          success: false,
          message: "Replay not found",
        });
      }

      const bookmark = replay.bookmarks.id(bookmarkId);
      if (!bookmark) {
        return res.status(404).json({
          success: false,
          message: "Bookmark not found",
        });
      }

      bookmark.remove();
      await replay.save();

      res.json({
        success: true,
        message: "Bookmark deleted successfully",
        data: {
          bookmarksCount: replay.bookmarksCount,
        },
      });
    } catch (error) {
      console.error("Delete bookmark error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete bookmark",
        error: error.message,
      });
    }
  }

  /**
   * Update playback position (for resume functionality)
   * PUT /api/replay/:replayId/position
   */
  async updatePlaybackPosition(req, res) {
    try {
      const { replayId } = req.params;
      const { conversationIndex, timestamp } = req.body;
      const userId = req.user.id;

      const replay = await InterviewReplay.findOne({
        _id: replayId,
        userId,
      });

      if (!replay) {
        return res.status(404).json({
          success: false,
          message: "Replay not found",
        });
      }

      replay.lastPlaybackPosition = {
        conversationIndex: conversationIndex || 0,
        timestamp: timestamp || 0,
      };
      await replay.save();

      res.json({
        success: true,
        message: "Playback position updated",
      });
    } catch (error) {
      console.error("Update position error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update position",
        error: error.message,
      });
    }
  }

  /**
   * Search notes across all replays
   * GET /api/replay/search/notes?q=searchQuery
   */
  async searchNotes(req, res) {
    try {
      const { q } = req.query;
      const userId = req.user.id;

      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const replays = await InterviewReplay.searchNotes(userId, q.trim());

      // Filter notes that match the search
      const results = replays.map((replay) => ({
        interviewId: replay.interviewId._id,
        interviewRole: replay.interviewId.role,
        interviewDifficulty: replay.interviewId.difficulty,
        interviewDate: replay.interviewId.completedAt,
        replayId: replay._id,
        matchingNotes: replay.notes.filter(
          (note) =>
            note.noteText.toLowerCase().includes(q.toLowerCase()) ||
            note.tags.some((tag) =>
              tag.toLowerCase().includes(q.toLowerCase())
            )
        ),
      }));

      res.json({
        success: true,
        data: {
          query: q,
          resultsCount: results.reduce(
            (sum, r) => sum + r.matchingNotes.length,
            0
          ),
          results,
        },
      });
    } catch (error) {
      console.error("Search notes error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to search notes",
        error: error.message,
      });
    }
  }

  /**
   * Get all replays for user
   * GET /api/replay/my-replays
   */
  async getMyReplays(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, sortBy = "createdAt", order = "desc" } =
        req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const sortOrder = order === "asc" ? 1 : -1;

      const replays = await InterviewReplay.find({ userId })
        .populate({
          path: "interviewId",
          select: "role difficulty duration overallScore completedAt",
        })
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await InterviewReplay.countDocuments({ userId });

      res.json({
        success: true,
        data: {
          replays,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get my replays error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get replays",
        error: error.message,
      });
    }
  }

  /**
   * Generate share link for replay
   * POST /api/replay/:replayId/share
   */
  async generateShareLink(req, res) {
    try {
      const { replayId } = req.params;
      const userId = req.user.id;

      const replay = await InterviewReplay.findOne({
        _id: replayId,
        userId,
      });

      if (!replay) {
        return res.status(404).json({
          success: false,
          message: "Replay not found",
        });
      }

      await replay.generateShareToken();

      const shareUrl = `${req.protocol}://${req.get("host")}/replay/shared/${replay.shareToken}`;

      res.json({
        success: true,
        message: "Share link generated",
        data: {
          shareToken: replay.shareToken,
          shareUrl,
          isPublic: replay.isPublic,
        },
      });
    } catch (error) {
      console.error("Generate share link error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate share link",
        error: error.message,
      });
    }
  }

  /**
   * Revoke share access
   * DELETE /api/replay/:replayId/share
   */
  async revokeShareAccess(req, res) {
    try {
      const { replayId } = req.params;
      const userId = req.user.id;

      const replay = await InterviewReplay.findOne({
        _id: replayId,
        userId,
      });

      if (!replay) {
        return res.status(404).json({
          success: false,
          message: "Replay not found",
        });
      }

      await replay.revokeShare();

      res.json({
        success: true,
        message: "Share access revoked",
      });
    } catch (error) {
      console.error("Revoke share error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to revoke share access",
        error: error.message,
      });
    }
  }

  /**
   * Get replay statistics
   * GET /api/replay/stats
   */
  async getReplayStats(req, res) {
    try {
      const userId = req.user.id;

      const replays = await InterviewReplay.find({ userId });

      const stats = {
        totalReplays: replays.length,
        totalViews: replays.reduce((sum, r) => sum + r.viewCount, 0),
        totalWatchTime: replays.reduce((sum, r) => sum + r.totalWatchTime, 0),
        totalNotes: replays.reduce((sum, r) => sum + r.notes.length, 0),
        totalBookmarks: replays.reduce((sum, r) => sum + r.bookmarks.length, 0),
        averageNotesPerReplay:
          replays.length > 0
            ? Math.round(
                replays.reduce((sum, r) => sum + r.notes.length, 0) /
                  replays.length
              )
            : 0,
        mostReviewedInterview: null,
      };

      // Find most reviewed
      if (replays.length > 0) {
        const mostReviewed = replays.reduce((max, r) =>
          r.viewCount > max.viewCount ? r : max
        );
        await mostReviewed.populate("interviewId", "role difficulty completedAt");
        stats.mostReviewedInterview = {
          interviewId: mostReviewed.interviewId._id,
          role: mostReviewed.interviewId.role,
          viewCount: mostReviewed.viewCount,
        };
      }

      // Category breakdown
      const categoryCount = {};
      replays.forEach((replay) => {
        replay.notes.forEach((note) => {
          categoryCount[note.category] =
            (categoryCount[note.category] || 0) + 1;
        });
      });
      stats.notesByCategory = categoryCount;

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Get replay stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get stats",
        error: error.message,
      });
    }
  }
}

export default new InterviewReplayController();
