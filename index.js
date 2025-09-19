const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// In-memory data store (no database)
let posts = [
    {
        id: 1,
        title: "How to Do Great Work",
        author: "Admin",
        date: "2025-09-15",
        content: "If you collected lists of techniques for doing great work in a lot of different fields, what would the intersection look like? I decided to find out by making it.\n\nPartly my goal was to create a guide that could be used by someone working in any field. But I was also curious about the shape of the intersection. And one thing that delighted me was how big it turned out to be. This isn't just a few tricks. There are an enormous number of techniques for doing great work, and the intersection is substantial."
    },
    {
        id: 2,
        title: "The Art of Writing",
        author: "Admin", 
        date: "2025-09-17",
        content: "Writing is one of the most important skills you can develop. It's not just about putting words on paper – writing is thinking. When you write, you're forced to clarify your thoughts and organize them logically.\n\nGood writing starts with good thinking. Before you write, you need to understand what you want to say. The best writing is simple and direct. Use short sentences and simple words. Cut unnecessary words. Writing is rewriting. Your first draft will never be your best work."
    },
    {
        id: 3,
        title: "How to Stay Productive When Working Remotely",
        author: "Admin", 
        date: "2025-09-18",
        content: "Remote work has become a defining aspect of modern professional life, but staying productive outside of a structured office environment isn’t always easy. \n\nOne of the key strategies is to establish a consistent daily routine, including set working hours, regular breaks, and a dedicated workspace away from distractions. \n\nStart each day by identifying your top priorities and listing critical tasks to accomplish; this focus can prevent overwhelm and boost motivation.Communication is also vital. Regular check-ins with colleagues—whether by chat, video call, or email—help create accountability and keep projects moving forward. Don't forget to embrace tools and techniques that simplify workflow, such as project management apps or time-blocking calendars. \n\nFinally, remember that flexibility is a benefit, not a license for procrastination. Take advantage of opportunities to refresh—like brief walks or mindfulness sessions—to recharge your mind. These habits will help sustain productivity and work-life balance, ensuring long-term satisfaction and success in a remote setting."
    },
];
let currentId = 4;

// --- Routes ---

// GET / - Home page, list all posts
app.get('/', (req, res) => {
    res.render('index', { posts: posts });
});

// GET /new - Display form to create a new post
app.get('/new', (req, res) => {
    res.render('new');
});

// POST /new - Create a new post
app.post('/new', (req, res) => {
    const { title, author, content } = req.body;
    const newPost = {
        id: currentId++,
        title: title,
        author: author,
        content: content,
        date: new Date().toISOString().split('T')[0]
    };
    posts.unshift(newPost); // Add to the beginning of the array
    res.redirect('/');
});

// GET /post/:id - View a single post
app.get('/post/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (post) {
        res.render('show', { post });
    } else {
        res.status(404).send('Post not found');
    }
});

// GET /post/:id/edit - Display form to edit a post
app.get('/post/:id/edit', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (post) {
        res.render('edit', { post });
    } else {
        res.status(404).send('Post not found');
    }
});

// POST /post/:id/edit - Update a post
app.post('/post/:id/edit', (req, res) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (postIndex !== -1) {
        posts[postIndex].title = req.body.title;
        posts[postIndex].author = req.body.author;
        posts[postIndex].content = req.body.content;
        res.redirect(`/post/${req.params.id}`);
    } else {
        res.status(404).send('Post not found');
    }
});

// POST /post/:id/delete - Delete a post
app.post('/post/:id/delete', (req, res) => {
    posts = posts.filter(p => p.id !== parseInt(req.params.id));
    res.redirect('/');
});


app.listen(port, () => {
    console.log(`Blog app listening at http://localhost:${port}`);
});
