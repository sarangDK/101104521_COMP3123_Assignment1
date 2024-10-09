require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
// const errorHandlerMiddleware = require('./middleware/errorHandlerMiddleware');
// const PORT = process.env.PORT || 3000;


const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Middleware
app.use(express.json());
// app.use(cors());

// Import routes and use
const userRoutes = require('../routes/userCollectionRoutes');
const employeeRoutes = require('../routes/employeeCollectionRoutes');


app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: "Welcome, This is Daekyung's API. " });
});

module.exports = app;

// Error handling middleware
// app.use(errorHandlerMiddleware);




// app.listen(PORT, () => {
//   console.log(`Server Started at ${PORT}`);
//   console.log(`http://localhost:${PORT}`);
// });