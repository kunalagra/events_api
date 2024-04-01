const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
require('dotenv').config();
const db = require("./helpers/db");

const app = express();

app.use(cors());
app.use(express.json());

const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);


db();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});