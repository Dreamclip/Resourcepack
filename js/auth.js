let currentUser = null;

// Проверка авторизации
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Пользователь вошел
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (userDoc.exists && userDoc.data().username) {
            // У пользователя есть ник
            currentUser = {
                uid: user.uid,
                username: userDoc.data().username
            };
            showForumInterface();
        } else {
            // Нужно выбрать ник
            showUsernameModal();
        }
    } else {
        // Анонимный вход
        const anonymousUser = await auth.signInAnonymously();
        currentUser = { uid: anonymousUser.user.uid };
        showUsernameModal();
    }
});

function showUsernameModal() {
    document.getElementById('usernameModal').classList.remove('hidden');
}

function showForumInterface() {
    document.getElementById('usernameModal').classList.add('hidden');
    document.getElementById('userInfo').classList.remove('hidden');
    document.getElementById('createPostForm').classList.remove('hidden');
    document.getElementById('usernameDisplay').textContent = currentUser.username;
    loadPosts();
}

async function setUsername() {
    const username = document.getElementById('usernameInput').value.trim();
    const errorElement = document.getElementById('usernameError');
    
    if (username.length < 3) {
        errorElement.textContent = 'Username must be at least 3 characters';
        errorElement.classList.remove('hidden');
        return;
    }

    // Проверка уникальности ника
    const usernameSnapshot = await db.collection('users')
        .where('username', '==', username)
        .get();

    if (!usernameSnapshot.empty) {
        errorElement.textContent = 'Username already taken';
        errorElement.classList.remove('hidden');
        return;
    }

    // Сохранение ника
    await db.collection('users').doc(currentUser.uid).set({
        username: username,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        postsCount: 0
    });

    currentUser.username = username;
    showForumInterface();
}

function logout() {
    auth.signOut();
    window.location.reload();
}