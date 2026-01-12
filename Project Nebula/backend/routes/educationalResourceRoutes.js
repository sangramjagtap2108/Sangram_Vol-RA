const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
} = require('../controllers/educationalResourceController');

// Public routes
router.get('/resources', getAllResources);
router.get('/resources/:id', getResourceById);

// Protected routes (require authentication)
router.post('/resources', auth, createResource);
router.put('/resources/:id', auth, updateResource);
router.delete('/resources/:id', auth, deleteResource);

module.exports = router;
