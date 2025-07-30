// Authentication utilities
class Auth {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        
        // Set token in API if exists
        if (this.token) {
            window.api.setAuthToken(this.token);
        }
    }

    // Login user
    login(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        window.api.setAuthToken(token);
        
        // Trigger auth state change event
        window.dispatchEvent(new CustomEvent('authStateChange', { 
            detail: { isAuthenticated: true, user } 
        }));
    }

    // Logout user
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.api.setAuthToken(null);
        
        // Clear cart
        if (window.cart) {
            window.cart.clear();
        }
        
        // Trigger auth state change event
        window.dispatchEvent(new CustomEvent('authStateChange', { 
            detail: { isAuthenticated: false, user: null } 
        }));
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    // Check if user is admin
    isAdmin() {
        return this.isAuthenticated() && this.user.role === 'admin';
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Get token
    getToken() {
        return this.token;
    }

    // Update user data
    updateUser(userData) {
        this.user = { ...this.user, ...userData };
        localStorage.setItem('user', JSON.stringify(this.user));
        
        // Trigger auth state change event
        window.dispatchEvent(new CustomEvent('authStateChange', { 
            detail: { isAuthenticated: true, user: this.user } 
        }));
    }
}

// Create global auth instance
window.auth = new Auth();
