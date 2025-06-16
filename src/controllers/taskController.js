const Task = require('../models/taskModel');

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    // Implement search if "search" parameter is provided
    if (search) {
      query = { $text: { $search: search } };
    }
    
    const tasks = await Task.find(query).sort({ title: 1 });
    
    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get a single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    
    // Ensure the returned object has the same structure
    // expected by the frontend
    res.status(200).json({
      status: 'success',
      data: {
        _id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        notes: task.notes,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: newTask
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: task
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}; 