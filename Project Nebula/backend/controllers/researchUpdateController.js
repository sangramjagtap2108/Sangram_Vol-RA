const ResearchUpdate = require('../models/ResearchUpdate');

// Get all research updates with optional filters
exports.getAllUpdates = async (req, res) => {
  try {
    const { updateType, category, highPriority } = req.query;
    
    let filter = {};
    
    if (updateType) {
      filter.updateType = updateType;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (highPriority === 'true') {
      filter.isHighPriority = true;
    }
    
    const updates = await ResearchUpdate.find(filter)
      .populate('createdBy', 'name email')
      .sort({ publishedDate: -1 });
    
    res.status(200).json({
      success: true,
      count: updates.length,
      updates
    });
  } catch (error) {
    console.error('Error fetching research updates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching research updates',
      error: error.message
    });
  }
};

// Get single update by ID
exports.getUpdateById = async (req, res) => {
  try {
    const update = await ResearchUpdate.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Research update not found'
      });
    }
    
    res.status(200).json({
      success: true,
      update
    });
  } catch (error) {
    console.error('Error fetching research update:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching research update',
      error: error.message
    });
  }
};

// Create a new research update
exports.createUpdate = async (req, res) => {
  try {
    const {
      title,
      description,
      link,
      updateType,
      category,
      tags,
      imageUrl,
      publishedDate,
      isHighPriority,
      source,
      researchOrganization
    } = req.body;
    
    // Validation
    if (!title || !description || !link || !updateType || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, link, updateType, and category'
      });
    }
    
    const update = new ResearchUpdate({
      title,
      description,
      link,
      updateType,
      category,
      tags: tags || [],
      imageUrl: imageUrl || '',
      publishedDate: publishedDate || Date.now(),
      isHighPriority: isHighPriority || false,
      source: source || '',
      researchOrganization: researchOrganization || '',
      createdBy: req.user.userId
    });
    
    await update.save();
    
    res.status(201).json({
      success: true,
      message: 'Research update created successfully',
      update
    });
  } catch (error) {
    console.error('Error creating research update:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating research update',
      error: error.message
    });
  }
};

// Update a research update
exports.updateUpdate = async (req, res) => {
  try {
    const update = await ResearchUpdate.findById(req.params.id);
    
    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Research update not found'
      });
    }
    
    // Check if user is the creator
    if (update.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this research update'
      });
    }
    
    // Update fields
    const allowedUpdates = [
      'title', 'description', 'link', 'updateType', 'category',
      'tags', 'imageUrl', 'publishedDate', 'isHighPriority',
      'source', 'researchOrganization'
    ];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    });
    
    await update.save();
    
    res.status(200).json({
      success: true,
      message: 'Research update updated successfully',
      update
    });
  } catch (error) {
    console.error('Error updating research update:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating research update',
      error: error.message
    });
  }
};

// Delete a research update
exports.deleteUpdate = async (req, res) => {
  try {
    const update = await ResearchUpdate.findById(req.params.id);
    
    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Research update not found'
      });
    }
    
    // Check if user is the creator
    if (update.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this research update'
      });
    }
    
    await ResearchUpdate.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Research update deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting research update:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting research update',
      error: error.message
    });
  }
};
