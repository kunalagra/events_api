const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${config.port}`);
});