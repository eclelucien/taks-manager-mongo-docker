# Task Manager Application

A modern task management application built with Node.js, Express, MongoDB, and Docker.

## 🚀 Technologies

### Backend
- **Node.js**: JavaScript runtime environment
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling tool
- **dotenv**: Environment variable management
- **CORS**: Cross-Origin Resource Sharing middleware

### Frontend
- **HTML5**: Latest version of HTML
- **CSS3**: Latest version of CSS
- **JavaScript**: Modern ES6+ features
- **Bootstrap 5**: Frontend framework for responsive design
- **Bootstrap Icons**: Icon library

### Development Tools
- **Docker**: Containerization platform
- **Docker Compose**: Multi-container Docker application management
- **Webpack**: Module bundler
- **Babel**: JavaScript compiler
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **Nodemon**: Development server with auto-reload

## 🛠️ Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://mongodb:27017/taskmanager
   ```
4. Start the development environment:
   ```bash
   docker compose up
   ```

## 📝 Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon
- `npm run build`: Build the frontend assets for production
- `npm run watch`: Watch for frontend changes during development
- `npm test`: Run all tests
- `npm run test:watch`: Run tests in watch mode
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix ESLint issues
- `npm run format`: Format code with Prettier

## 🧪 Testing

The project uses Jest for testing. Tests are organized in the `src/js/__tests__` directory:

- `taskManager.test.js`: Tests for utility functions
- `taskRenderer.test.js`: Tests for UI rendering
- `taskApi.test.js`: Tests for API interactions

Run tests with:
```bash
npm test
```

## 📦 Project Structure

```
task-manager/
├── src/
│   ├── js/
│   │   ├── __tests__/
│   │   │   ├── taskManager.test.js
│   │   │   ├── taskRenderer.test.js
│   │   │   └── taskApi.test.js
│   │   └── app.js
│   └── css/
│       └── styles.css
├── public/
│   └── index.html
├── server.js
├── package.json
├── webpack.config.js
├── .eslintrc.js
├── .prettierrc
├── .env
└── docker-compose.yml
```

## 🔧 Configuration Files

- `webpack.config.js`: Webpack configuration for frontend bundling
- `.eslintrc.js`: ESLint configuration for code linting
- `.prettierrc`: Prettier configuration for code formatting
- `docker-compose.yml`: Docker Compose configuration for container orchestration

## 📚 Dependencies

### Production Dependencies
- express: ^4.18.2
- mongoose: ^7.5.0
- cors: ^2.8.5
- dotenv: ^16.3.1

### Development Dependencies
- @babel/core: ^7.22.15
- @babel/preset-env: ^7.27.2
- babel-jest: ^30.0.0
- babel-loader: ^9.1.3
- css-loader: ^6.8.1
- eslint: ^8.47.0
- eslint-config-prettier: ^9.0.0
- eslint-plugin-prettier: ^5.0.0
- jest: ^30.0.0
- mini-css-extract-plugin: ^2.7.6
- nodemon: ^3.0.1
- prettier: ^3.0.2
- style-loader: ^3.3.3
- webpack: ^5.88.2
- webpack-cli: ^5.1.4

## 🔐 Environment Variables

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string

## 🐳 Docker

The application uses Docker for containerization:

- **app**: Node.js application container
- **mongodb**: MongoDB database container
- **mongo-express**: Web-based MongoDB admin interface

## 📄 License

This project is licensed under the MIT License. 