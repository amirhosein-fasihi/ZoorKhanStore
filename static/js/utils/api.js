// API utilities for Zoorkhan store
class API {
    constructor() {
        this.baseURL = window.location.protocol + '//' + window.location.host + '/api';
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    // Set authorization header
    setAuthToken(token) {
        if (token) {
            this.defaultHeaders['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.defaultHeaders['Authorization'];
        }
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: { ...this.defaultHeaders, ...options.headers },
            ...options
        };

        try {
            const response = await axios(url, config);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'خطا در ارتباط با سرور');
            } else if (error.request) {
                throw new Error('عدم دسترسی به سرور');
            } else {
                throw new Error('خطای غیرمنتظره');
            }
        }
    }

    // Authentication methods
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            data: userData
        });
    }

    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            data: credentials
        });
    }

    async getProfile() {
        return this.request('/auth/profile');
    }

    // Product methods
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/products${queryString ? '?' + queryString : ''}`);
    }

    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    async createProduct(productData) {
        return this.request('/admin/products', {
            method: 'POST',
            data: productData
        });
    }

    // Category methods
    async getCategories() {
        return this.request('/categories');
    }

    async createCategory(categoryData) {
        return this.request('/admin/categories', {
            method: 'POST',
            data: categoryData
        });
    }

    // Order methods
    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            data: orderData
        });
    }

    async getUserOrders() {
        return this.request('/orders');
    }

    // Blog methods
    async getBlogPosts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/blog${queryString ? '?' + queryString : ''}`);
    }

    async getBlogPost(id) {
        return this.request(`/blog/${id}`);
    }

    async createBlogPost(postData) {
        return this.request('/admin/blog', {
            method: 'POST',
            data: postData
        });
    }

    // Newsletter method
    async subscribeNewsletter(email) {
        return this.request('/newsletter/subscribe', {
            method: 'POST',
            data: { email }
        });
    }

    // Admin dashboard
    async getAdminDashboard() {
        return this.request('/admin/dashboard');
    }
}

// Create global API instance
window.api = new API();
