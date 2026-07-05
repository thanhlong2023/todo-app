const express = require('express');
const cors = require('cors');

const todoRoutes = require('./routes/todo.routes');
const notFoundMiddleware = require('./middlewares/notFound.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Todo List API is running'
  });
});

app.use('/api/todos', todoRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;