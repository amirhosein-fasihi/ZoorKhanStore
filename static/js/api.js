// API client for Zoorkhan store
class API {
    constructor() {
        this.baseURL = '/api';
        this.token = localStorage.getItem('token');
    }

    // Helper method to make authenticated requests
    async request(endpoint, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, config);
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Network error occurred' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // Authentication methods
    async login(username, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        if (response.token) {
            this.token = response.token;
            localStorage.setItem('token', this.token);
        }
        
        return response;
    }

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async logout() {
        this.token = null;
        localStorage.removeItem('token');
        window.dispatchEvent(new CustomEvent('authStateChange', { detail: null }));
    }

    async getCurrentUser() {
        if (!this.token) return null;
        try {
            return await this.request('/auth/user');
        } catch (error) {
            if (error.message.includes('401')) {
                this.logout();
            }
            throw error;
        }
    }

    // Product methods
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/products?${queryString}` : '/products';
        return this.request(endpoint);
    }

    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    async createProduct(productData) {
        return this.request('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    }

    async updateProduct(id, productData) {
        return this.request(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    }

    async deleteProduct(id) {
        return this.request(`/products/${id}`, {
            method: 'DELETE'
        });
    }

    // Category methods
    async getCategories() {
        return this.request('/categories');
    }

    async createCategory(categoryData) {
        return this.request('/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData)
        });
    }

    async updateCategory(id, categoryData) {
        return this.request(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData)
        });
    }

    async deleteCategory(id) {
        return this.request(`/categories/${id}`, {
            method: 'DELETE'
        });
    }

    // Order methods
    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async getOrders() {
        return this.request('/orders');
    }

    async getOrder(id) {
        return this.request(`/orders/${id}`);
    }

    async updateOrderStatus(id, status) {
        return this.request(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    // Blog methods
    async getBlogPosts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/blog?${queryString}` : '/blog';
        return this.request(endpoint);
    }

    async getBlogPost(id) {
        return this.request(`/blog/${id}`);
    }

    async createBlogPost(postData) {
        return this.request('/blog', {
            method: 'POST',
            body: JSON.stringify(postData)
        });
    }

    async updateBlogPost(id, postData) {
        return this.request(`/blog/${id}`, {
            method: 'PUT',
            body: JSON.stringify(postData)
        });
    }

    async deleteBlogPost(id) {
        return this.request(`/blog/${id}`, {
            method: 'DELETE'
        });
    }

    // Newsletter methods
    async subscribeNewsletter(email) {
        return this.request('/newsletter/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    // Statistics methods (for admin)
    async getStats() {
        return this.request('/admin/stats');
    }
}

// Initialize API client
window.api = new API();