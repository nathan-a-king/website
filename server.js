const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing - serve index.html for non-asset requests
app.get('*', (req, res) => {
  // Check if the request is for a file that should exist
  const filePath = path.join(__dirname, 'build', req.path);
  
  // If it's a request for a static asset and it doesn't exist, return 404
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    return res.status(404).send('File not found');
  }
  
  // Otherwise, serve the React app
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
