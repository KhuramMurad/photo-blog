async function fetchPosts() {
    const response = await fetch('/api/posts');
    const posts = await response.json();
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            ${post.imagePath ? `<img src="${post.imagePath}" alt="Post Image">` : ''}
            <p>${post.content}</p>
            <ul>
                ${post.comments.map(comment => `<li>${comment.text}</li>`).join('')}
            </ul>
            <form class="comment-form" data-post-id="${post._id}">
                <input type="text" placeholder="Add a comment" required>
                <button type="submit">Add Comment</button>
            </form>
        `;

        postsContainer.appendChild(postDiv);
    });
}

async function addPost(title, content, image) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData
    });

    if (response.ok) fetchPosts();
}

async function addComment(postId, text) {
    await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    fetchPosts();
}

document.getElementById('post-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const image = document.getElementById('post-image').files[0];
    addPost(title, content, image);
    e.target.reset();
});

document.getElementById('posts-container').addEventListener('submit', (e) => {
    if (e.target.classList.contains('comment-form')) {
        e.preventDefault();
        const postId = e.target.getAttribute('data-post-id');
        const text = e.target.querySelector('input').value;
        addComment(postId, text);
        e.target.reset();
    }
});

fetchPosts();
