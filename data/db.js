const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/commentApp';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const commentSchema = new mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    imagePath: String,
    comments: [commentSchema],
    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

async function getPosts() {
    return await Post.find().sort({ createdAt: -1 });
}

async function addPost(title, content, imagePath) {
    const newPost = new Post({ title, content, imagePath });
    return await newPost.save();
}

async function addComment(postId, text) {
    const post = await Post.findById(postId);
    if (post) {
        post.comments.push({ text });
        await post.save();
        return post;
    }
    return null;
}

module.exports = { getPosts, addPost, addComment };
