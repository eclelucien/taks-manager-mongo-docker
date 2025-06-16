const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const searchTerm = req.query.search;
    let query = {};
    
    if (searchTerm) {
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }
    
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json({ data: tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }
    res.json({ data: task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json({ data: savedTask });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }
    
    res.json({ data: task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }
    
    res.json({ message: 'Tarefa excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 