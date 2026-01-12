import express from 'express';
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getNewsletterSubscribers,
  deleteNewsletterSubscriber,
} from '../controllers/Newsletter.controller.js';

const router = express.Router();

// Public routes
router.post('/subscribe', subscribeNewsletter);
router.post('/unsubscribe', unsubscribeNewsletter);

// Admin routes (should be protected with admin middleware)
router.get('/subscribers', getNewsletterSubscribers);
router.delete('/subscribers/:email', deleteNewsletterSubscriber);

export default router;
