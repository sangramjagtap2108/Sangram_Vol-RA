const EducationalResource = require('../models/EducationalResource');

// Get all educational resources with optional filters
exports.getAllResources = async (req, res) => {
  try {
    const { resourceType, category, featured } = req.query;
    
    let filter = {};
    
    if (resourceType) {
      filter.resourceType = resourceType;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    
    const resources = await EducationalResource.find(filter)
      .populate('createdBy', 'name email')
      .sort({ publishedDate: -1 });
    
    res.status(200).json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (error) {
    console.error('Error fetching educational resources:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching educational resources',
      error: error.message
    });
  }
};

// Get single resource by ID
exports.getResourceById = async (req, res) => {
  try {
    const resource = await EducationalResource.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    res.status(200).json({
      success: true,
      resource
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resource',
      error: error.message
    });
  }
};

// Create a new resource
exports.createResource = async (req, res) => {
  try {
    const {
      title,
      description,
      link,
      organization,
      resourceType,
      category,
      tags,
      imageUrl,
      publishedDate,
      isFeatured
    } = req.body;
    
    // Validation
    if (!title || !description || !link || !organization || !resourceType || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, link, organization, resourceType, and category'
      });
    }
    
    const resource = new EducationalResource({
      title,
      description,
      link,
      organization,
      resourceType,
      category,
      tags: tags || [],
      imageUrl: imageUrl || '',
      publishedDate: publishedDate || Date.now(),
      isFeatured: isFeatured || false,
      createdBy: req.user.userId
    });
    
    await resource.save();
    
    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      resource
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating resource',
      error: error.message
    });
  }
};

// Update a resource
exports.updateResource = async (req, res) => {
  try {
    const resource = await EducationalResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    // Check if user is the creator
    if (resource.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this resource'
      });
    }
    
    // Update fields
    const allowedUpdates = [
      'title', 'description', 'link', 'organization', 'resourceType',
      'category', 'tags', 'imageUrl', 'publishedDate', 'isFeatured'
    ];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        resource[field] = req.body[field];
      }
    });
    
    await resource.save();
    
    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      resource
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating resource',
      error: error.message
    });
  }
};

// Delete a resource
exports.deleteResource = async (req, res) => {
  try {
    const resource = await EducationalResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    // Check if user is the creator
    if (resource.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this resource'
      });
    }
    
    await EducationalResource.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting resource',
      error: error.message
    });
  }
};
