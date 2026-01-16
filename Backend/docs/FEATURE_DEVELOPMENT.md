# Feature Development Guide

Complete guide for adding new features to Intervyo.

---

## 🎯 Feature Development Process

### 1. Planning Phase
- [ ] Create GitHub issue describing the feature
- [ ] Discuss with maintainers
- [ ] Get approval before starting development
- [ ] Define acceptance criteria
- [ ] Identify dependencies

### 2. Implementation Phase
- [ ] Create feature branch: `feature/feature-name`
- [ ] Implement backend changes
- [ ] Implement frontend changes
- [ ] Add proper error handling
- [ ] Add input validation
- [ ] Add rate limiting if needed

### 3. Testing Phase
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Test manually
- [ ] Test edge cases
- [ ] Test error scenarios

### 4. Documentation Phase
- [ ] Update API documentation
- [ ] Update README if needed
- [ ] Add code comments
- [ ] Update CHANGELOG
- [ ] Create migration guide if needed

### 5. Review Phase
- [ ] Self-review code
- [ ] Create pull request
- [ ] Address review comments
- [ ] Ensure CI/CD passes
- [ ] Get approval from maintainers

---

## 🏗️ Architecture Patterns

### Backend Structure

```
Backend/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middlewares/     # Express middlewares
├── models/          # Database models (Mongoose)
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helper functions
├── tests/           # Test files
└── docs/            # Documentation
```

### Adding a New Feature

#### 1. Create Model (if needed)

```javascript
// models/Feature.model.js
import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
featureSchema.index({ userId: 1, createdAt: -1 });
featureSchema.index({ status: 1 });

// Virtual fields
featureSchema.virtual('isActive').get(function() {
  return this.status === 'active';
});

// Instance methods
featureSchema.methods.activate = function() {
  this.status = 'active';
  return this.save();
};

// Static methods
featureSchema.statics.findByUserId = function(userId) {
  return this.find({ userId }).sort('-createdAt');
};

export default mongoose.model('Feature', featureSchema);
```

#### 2. Create Service Layer

```javascript
// services/feature.service.js
import Feature from '../models/Feature.model.js';

export class FeatureService {
  /**
   * Create new feature
   */
  async create(userId, data) {
    const feature = await Feature.create({
      userId,
      ...data
    });
    
    return feature;
  }

  /**
   * Get feature by ID
   */
  async getById(featureId, userId) {
    const feature = await Feature.findOne({
      _id: featureId,
      userId
    });

    if (!feature) {
      throw new Error('Feature not found');
    }

    return feature;
  }

  /**
   * Update feature
   */
  async update(featureId, userId, updates) {
    const feature = await this.getById(featureId, userId);
    
    Object.assign(feature, updates);
    await feature.save();
    
    return feature;
  }

  /**
   * Delete feature
   */
  async delete(featureId, userId) {
    const feature = await this.getById(featureId, userId);
    await feature.remove();
    return { message: 'Feature deleted successfully' };
  }

  /**
   * List user features
   */
  async list(userId, filters = {}) {
    const query = { userId, ...filters };
    
    const features = await Feature.find(query)
      .sort('-createdAt')
      .limit(100);
    
    return features;
  }
}

export default new FeatureService();
```

#### 3. Create Controller

```javascript
// controllers/Feature.controller.js
import featureService from '../services/feature.service.js';

/**
 * @desc    Create new feature
 * @route   POST /api/features
 * @access  Private
 */
export const createFeature = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    const feature = await featureService.create(userId, data);

    res.status(201).json({
      success: true,
      message: 'Feature created successfully',
      data: feature
    });
  } catch (error) {
    console.error('Create feature error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create feature'
    });
  }
};

/**
 * @desc    Get feature by ID
 * @route   GET /api/features/:id
 * @access  Private
 */
export const getFeature = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const feature = await featureService.getById(id, userId);

    res.json({
      success: true,
      data: feature
    });
  } catch (error) {
    console.error('Get feature error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Feature not found'
    });
  }
};

/**
 * @desc    Update feature
 * @route   PUT /api/features/:id
 * @access  Private
 */
export const updateFeature = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updates = req.body;

    const feature = await featureService.update(id, userId, updates);

    res.json({
      success: true,
      message: 'Feature updated successfully',
      data: feature
    });
  } catch (error) {
    console.error('Update feature error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update feature'
    });
  }
};

/**
 * @desc    Delete feature
 * @route   DELETE /api/features/:id
 * @access  Private
 */
export const deleteFeature = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await featureService.delete(id, userId);

    res.json({
      success: true,
      message: 'Feature deleted successfully'
    });
  } catch (error) {
    console.error('Delete feature error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete feature'
    });
  }
};

/**
 * @desc    List user features
 * @route   GET /api/features
 * @access  Private
 */
export const listFeatures = async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = req.query;

    const features = await featureService.list(userId, filters);

    res.json({
      success: true,
      count: features.length,
      data: features
    });
  } catch (error) {
    console.error('List features error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to list features'
    });
  }
};
```

#### 4. Create Routes

```javascript
// routes/feature.routes.js
import express from 'express';
const router = express.Router();
import { protect } from '../middlewares/auth.js';
import { validateFeature } from '../middlewares/validation.middleware.js';
import {
  createFeature,
  getFeature,
  updateFeature,
  deleteFeature,
  listFeatures
} from '../controllers/Feature.controller.js';

// Apply authentication to all routes
router.use(protect);

// POST /api/features - Create feature
router.post('/', validateFeature, createFeature);

// GET /api/features - List features
router.get('/', listFeatures);

// GET /api/features/:id - Get feature
router.get('/:id', getFeature);

// PUT /api/features/:id - Update feature
router.put('/:id', validateFeature, updateFeature);

// DELETE /api/features/:id - Delete feature
router.delete('/:id', deleteFeature);

export default router;
```

#### 5. Add Validation

```javascript
// Add to middlewares/validation.middleware.js

export const validateFeature = (req, res, next) => {
  const { name, status } = req.body;
  const errors = [];

  // Validate name
  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string');
  } else if (name.length > 100) {
    errors.push('Name cannot exceed 100 characters');
  }

  // Validate status (if provided)
  if (status && !['active', 'inactive'].includes(status)) {
    errors.push('Status must be either "active" or "inactive"');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};
```

#### 6. Register Routes

```javascript
// Add to Backend/index.js

import featureRoutes from './routes/feature.routes.js';

// Add after other routes
app.use('/api/features', featureRoutes);
```

---

## 🧪 Testing Your Feature

### Unit Tests

```javascript
// tests/feature.test.js
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../index.js';
import Feature from '../models/Feature.model.js';

describe('Feature API', () => {
  let authToken;
  let userId;
  let featureId;

  beforeAll(async () => {
    // Login and get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'TestPass123!'
      });
    
    authToken = res.body.token;
    userId = res.body.user.id;
  });

  afterAll(async () => {
    // Cleanup
    await Feature.deleteMany({ userId });
  });

  describe('POST /api/features', () => {
    it('should create a new feature', async () => {
      const res = await request(app)
        .post('/api/features')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Feature',
          status: 'active'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      
      featureId = res.body.data._id;
    });

    it('should reject invalid data', async () => {
      const res = await request(app)
        .post('/api/features')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '',  // Invalid
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/features/:id', () => {
    it('should get feature by ID', async () => {
      const res = await request(app)
        .get(`/api/features/${featureId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(featureId);
    });
  });

  // Add more tests...
});
```

---

## 📝 Best Practices

### 1. Error Handling
Always use try-catch blocks and provide meaningful error messages:

```javascript
try {
  // Your code
} catch (error) {
  console.error('Operation failed:', error);
  res.status(500).json({
    success: false,
    message: error.message || 'Operation failed',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
}
```

### 2. Input Validation
Validate all user inputs:

```javascript
// Use express-validator or custom validation
import { body, validationResult } from 'express-validator';

export const validateInput = [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 2, max: 50 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

### 3. Database Queries
- Always use indexes for frequently queried fields
- Limit results to prevent memory issues
- Use lean() for read-only queries
- Avoid N+1 queries with populate

```javascript
// Good
const features = await Feature.find({ userId })
  .sort('-createdAt')
  .limit(100)
  .lean();

// Bad
const features = await Feature.find({ userId }); // No limit!
```

### 4. Security
- Never expose sensitive data
- Always validate user authorization
- Use rate limiting on endpoints
- Sanitize user inputs

### 5. Performance
- Use caching when appropriate
- Paginate large result sets
- Use database indexes
- Monitor slow queries

---

## 🚀 Deployment Checklist

Before deploying your feature:

- [ ] All tests pass
- [ ] Code is properly documented
- [ ] API documentation is updated
- [ ] Environment variables are documented
- [ ] Database migrations are included (if needed)
- [ ] Rate limiting is configured
- [ ] Error handling is comprehensive
- [ ] Security considerations are addressed
- [ ] Performance impact is minimal
- [ ] Backwards compatibility is maintained

---

## 💡 Examples of Good Features

1. **Email Notification System**
   - Service layer for email sending
   - Queue for async processing
   - Templates for different email types
   - Rate limiting to prevent abuse

2. **File Upload System**
   - Validation of file types and sizes
   - Cloudinary integration
   - Cleanup of temporary files
   - Security checks

3. **Analytics Dashboard**
   - Aggregation pipeline for statistics
   - Caching of computed results
   - Real-time updates via WebSocket
   - Export functionality

---

## 📞 Need Help?

- **Documentation**: Check `/Backend/docs/`
- **Examples**: Look at existing controllers and services
- **Questions**: Open a GitHub discussion
- **Issues**: Report bugs on GitHub Issues

---

## 🎓 Learning Resources

- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [API Design Best Practices](https://github.com/microsoft/api-guidelines)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)
