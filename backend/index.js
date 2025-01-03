// Import the required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const prisma = require('./database.js');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import database connection

// Routes
// Root route
app.get('/', (req, res) => {
    res.send({ message: 'Welcome to the Express Backend Server!' });
});

// Example API route
app.get('/api/data', async (req, res) => {
    try {
        const data = await prisma.example.findMany();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Post route example
app.post('/api/data', async (req, res) => {
    try {
        const newItem = await prisma.example.create({
            data: req.body
        });
        res.status(201).json({ message: 'Item created successfully!', item: newItem });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create item' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
