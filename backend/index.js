// Import the required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Express Backend Server!');
});

// Example API route
app.get('/api/data', (req, res) => {
    const data = [
        { id: 1, name: 'Item 1', description: 'Description for Item 1' },
        { id: 2, name: 'Item 2', description: 'Description for Item 2' },
        { id: 3, name: 'Item 3', description: 'Description for Item 3' },
    ];
    res.json(data);
});

// Post route example
app.post('/api/data', (req, res) => {
    const newItem = req.body;
    console.log('Received new item:', newItem);
    res.status(201).json({ message: 'Item created successfully!', item: newItem });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
