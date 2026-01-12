const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllUpdates,
  getUpdateById,
  createUpdate,
  updateUpdate,
  deleteUpdate
} = require('../controllers/researchUpdateController');

// Public routes
router.get('/research-updates', getAllUpdates);
router.get('/research-updates/:id', getUpdateById);

// Protected routes (require authentication)
router.post('/research-updates', auth, createUpdate);
router.put('/research-updates/:id', auth, updateUpdate);
router.delete('/research-updates/:id', auth, deleteUpdate);

module.exports = router;
