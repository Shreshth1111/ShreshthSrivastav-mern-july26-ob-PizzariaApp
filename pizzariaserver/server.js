const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

/* Allow React (port 3000) to communicate with this server (port 5000) */
app.use(cors());

/* Parse incoming JSON request bodies automatically */
app.use(express.json());

/* Mount all route files */
app.use('/api/pizzas',      require('./routes/pizzaRoutes'));
app.use('/api/ingredients', require('./routes/ingredientRoutes'));
app.use('/api/cart',        require('./routes/cartRoutes'));
app.use('/api/auth',        require('./routes/authRoutes'));

/* Connect to MongoDB then start listening */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected to PIZZARIADB');
    app.listen(process.env.PORT, () => {
      console.log('Server running on http://localhost:' + process.env.PORT);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
