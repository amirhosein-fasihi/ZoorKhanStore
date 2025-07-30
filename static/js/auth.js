// Authentication manager for Zoorkhan store
class Auth {
    constructor() {
        this.user = null;
        this.token = localStorage.getItem('token');
        this.init();
    }

    async init() {
        if (this.token) {
            try {
                await this.loadCurrentUser();
            } catch (error) {
                console.error('Failed to load user:', error);
                this.logout();
            }
        }
    }

    async loadCurrentUser() {
        if (!this.token) return null;
        
        try {
            const response = await window.api.getCurrentUser();
            this.user = response.user;
            this.dispatchAuthStateChange();
            return this.user;
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    async login(username, password) {
        try {
            const response = await window.api.login(username, password);
            this.token = response.token;
            this.user = response.user;
            localStorage.setItem('token', this.token);
            this.dispatchAuthStateChange();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await window.api.register(userData);
            if (response.token) {
                this.token = response.token;
                this.user = response.user;
                localStorage.setItem('token', this.token);
                this.dispatchAuthStateChange();
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        this.dispatchAuthStateChange();
    }

    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    isAdmin() {
        return this.isAuthenticated() && this.user.role === 'admin';
    }

    isCustomer() {
        return this.isAuthenticated() && this.user.role === 'customer';
    }

    getCurrentUser() {
        return this.user;
    }

    getToken() {
        return this.token;
    }

    dispatchAuthStateChange() {
        window.dispatchEvent(new CustomEvent('authStateChange', { 
            detail: this.user 
        }));
    }

    // Check if user can access admin features
    requireAdmin() {
        if (!this.isAdmin()) {
            throw new Error('دسترسی محدود - فقط ادمین');
        }
        return true;
    }

    // Check if user is logged in
    requireAuth() {
        if (!this.isAuthenticated()) {
            throw new Error('لطفا ابتدا وارد شوید');
        }
        return true;
    }
}

// Initialize auth manager
window.auth = new Auth();