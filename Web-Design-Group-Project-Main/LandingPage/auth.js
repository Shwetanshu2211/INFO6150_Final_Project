// Function to check if user is logged in
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const signInBtn = document.querySelector('.sign-in-btn');
    const rightSection = document.querySelector('.right-section');

    if (token) {
        // User is logged in, replace sign in button with profile icon
        signInBtn.style.display = 'none';
        
        // Create profile icon if it doesn't exist
        if (!document.querySelector('.profile-icon')) {
            const profileIcon = document.createElement('a');
            profileIcon.href = 'account-settings.html';
            profileIcon.className = 'profile-icon';
            profileIcon.innerHTML = '<i class="fas fa-user"></i>';
            rightSection.insertBefore(profileIcon, signInBtn);
        }
    } else {
        // User is not logged in, show sign in button
        signInBtn.style.display = 'block';
        const profileIcon = document.querySelector('.profile-icon');
        if (profileIcon) {
            profileIcon.remove();
        }
    }
}

// Check auth status when page loads
document.addEventListener('DOMContentLoaded', checkAuthStatus);

// Add event listener for logout
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('logout-btn')) {
        localStorage.removeItem('token');
        checkAuthStatus();
        window.location.href = 'homepage.html';
    }
}); 