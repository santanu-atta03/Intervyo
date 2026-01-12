import Newsletter from '../models/Newsletter.model.js';
import { successResponse, errorResponse, HTTP_STATUS } from '../utils/response.js';

// Subscribe to newsletter
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return errorResponse(res, {
        message: 'Email is required and must be a string',
        statusCode: HTTP_STATUS.BAD_REQUEST
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Email validation regex
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return errorResponse(res, {
        message: 'Please enter a valid email address',
        statusCode: HTTP_STATUS.BAD_REQUEST
      });
    }

    // Check if email is already subscribed
    const existingSubscriber = await Newsletter.findOne({ email: trimmedEmail });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return errorResponse(res, {
          message: 'This email is already subscribed to our newsletter',
          statusCode: HTTP_STATUS.CONFLICT
        });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.unsubscribedAt = null;
        await existingSubscriber.save();
        return successResponse(res, {
          statusCode: HTTP_STATUS.OK,
          message: 'You have been resubscribed to our newsletter',
          data: {
            email: existingSubscriber.email,
            subscribedAt: existingSubscriber.subscribedAt,
          }
        });
      }
    }

    // Create new newsletter subscriber
    const newSubscriber = new Newsletter({
      email: trimmedEmail,
      // If user is authenticated, link their account
      userId: req.user ? req.user.id : null,
    });

    await newSubscriber.save();

    return successResponse(res, {
      statusCode: HTTP_STATUS.CREATED,
      message: 'Thank you for subscribing to our newsletter! Check your inbox for updates.',
      data: {
        email: newSubscriber.email,
        subscribedAt: newSubscriber.subscribedAt,
      }
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return errorResponse(res, {
        message: 'This email is already subscribed to our newsletter',
        statusCode: HTTP_STATUS.CONFLICT
      });
    }

    return errorResponse(res, {
      message: 'An error occurred while processing your subscription. Please try again later.',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      stack: error.stack
    });
  }
};

// Unsubscribe from newsletter
export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return errorResponse(res, {
        message: 'Email is required',
        statusCode: HTTP_STATUS.BAD_REQUEST
      });
    }

    const subscriber = await Newsletter.findOne({ email: email.trim().toLowerCase() });

    if (!subscriber) {
      return errorResponse(res, {
        message: 'Email not found in our newsletter list',
        statusCode: HTTP_STATUS.NOT_FOUND
      });
    }

    if (!subscriber.isActive) {
      return successResponse(res, {
        statusCode: HTTP_STATUS.OK,
        message: 'You are already unsubscribed from our newsletter'
      });
    }

    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return successResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: 'You have been unsubscribed from our newsletter'
    });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return errorResponse(res, {
      message: 'An error occurred while processing your request',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      stack: error.stack
    });
  }
};

// Get newsletter subscribers (admin only)
export const getNewsletterSubscribers = async (req, res) => {
  try {
    const { isActive = true, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = { isActive: isActive === 'true' };
    const subscribers = await Newsletter.find(query)
      .select('email subscribedAt emailsSent')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ subscribedAt: -1 });

    const total = await Newsletter.countDocuments(query);

    return successResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: 'Newsletter subscribers retrieved successfully',
      data: {
        subscribers,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        }
      }
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    return errorResponse(res, {
      message: 'An error occurred while retrieving subscribers',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      stack: error.stack
    });
  }
};

// Delete newsletter subscriber (admin only)
export const deleteNewsletterSubscriber = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return errorResponse(res, {
        message: 'Email is required',
        statusCode: HTTP_STATUS.BAD_REQUEST
      });
    }

    const subscriber = await Newsletter.findOneAndDelete({ email: email.trim().toLowerCase() });

    if (!subscriber) {
      return errorResponse(res, {
        message: 'Email not found in our newsletter list',
        statusCode: HTTP_STATUS.NOT_FOUND
      });
    }

    return successResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: 'Subscriber removed successfully'
    });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    return errorResponse(res, {
      message: 'An error occurred while deleting the subscriber',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      stack: error.stack
    });
  }
}
