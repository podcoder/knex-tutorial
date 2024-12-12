// Import express
const express = require('express');
const cors = require('cors')

// Create an express app
const app = express();
app.use(cors())

app.get('/', (req, res) => {
    res.send("HELLO and Welcome")
})
app.get('/html', (req, res) => {
    res.send("<h1>Hello World</h1>")
})
app.get('/hello', (req, res) => {
    res.json({ name: "Hello", age: 32, email: 'me@me.com' })
})

const usersRoutes = require('./routes/users_routes');
const postsRoutes = require('./routes/posts_routes');
app.use("/users", usersRoutes);
app.use("/posts", postsRoutes);

// Define the port the server will run on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
