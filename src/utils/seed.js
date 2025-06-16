const mongoose = require('mongoose');
const Task = require('../models/taskModel');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tasks-manager-db';

const initialTasks = [
  {
    title: 'Complete Project Documentation',
    description: 'Write comprehensive documentation for the new feature',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date('2024-03-25'),
    notes: 'Include API examples and usage scenarios'
  },
  {
    title: 'Review Pull Requests',
    description: 'Review and provide feedback on team members\' pull requests',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2024-03-20'),
    notes: 'Focus on code quality and best practices'
  },
  {
    title: 'Update Dependencies',
    description: 'Update project dependencies to their latest stable versions',
    status: 'completed',
    priority: 'low',
    dueDate: new Date('2024-03-15'),
    notes: 'Test thoroughly after updates'
  },
  {
    title: 'Implement New Feature',
    description: 'Add user authentication system',
    status: 'pending',
    priority: 'high',
    dueDate: new Date('2024-03-30'),
    notes: 'Include JWT implementation'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Task.deleteMany({});
    console.log('Previous data removed');

    const tasks = await Task.create(initialTasks);
    console.log(`${tasks.length} tasks were created in the database`);

    tasks.forEach(task => {
      console.log(`- ${task.title}: ${task.status} (Priority: ${task.priority})`);
    });

    console.log('Seeding process completed successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}

seedDatabase(); 