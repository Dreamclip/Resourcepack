async function createPost() {
    if (!currentUser) return;

    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const category = document.getElementById('postCategory').value;

    if (!title || !content) {
        alert('Please fill all fields');
        return;
    }

    await db.collection('posts').add({
        title: title,
        content: content,
        author: currentUser.uid,
        authorName: currentUser.username,
        category: category,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        likes: 0,
        comments: []
    });

    // Очистка формы
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    
    // Обновление счетчика постов пользователя
    await db.collection('users').doc(currentUser.uid).update({
        postsCount: firebase.firestore.FieldValue.increment(1)
    });

    loadPosts();
}

async function loadPosts() {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    const postsSnapshot = await db.collection('posts')
        .orderBy('createdAt', 'desc')
        .get();

    postsSnapshot.forEach(doc => {
        const post = doc.data();
        const postElement = createPostElement(post, doc.id);
        postsContainer.appendChild(postElement);
    });
}

function createPostElement(post, postId) {
    const div = document.createElement('div');
    div.className = 'bg-gray-800 p-4 rounded-lg';
    div.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <h3 class="text-green-400 font-bold">${post.title}</h3>
            <span class="text-gray-400 text-xs">${getTimeAgo(post.createdAt)}</span>
        </div>
        <p class="text-white text-sm mb-3">${post.content}</p>
        <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <span class="text-gray-400 text-xs">by ${post.authorName}</span>
                <span class="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">${post.category}</span>
            </div>
            <button onclick="likePost('${postId}')" class="text-gray-400 hover:text-red-400 text-sm">
                ♥ ${post.likes || 0}
            </button>
        </div>
    `;
    return div;
}

async function likePost(postId) {
    if (!currentUser) return;
    
    await db.collection('posts').doc(postId).update({
        likes: firebase.firestore.FieldValue.increment(1)
    });
    
    loadPosts();
}

function getTimeAgo(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
}