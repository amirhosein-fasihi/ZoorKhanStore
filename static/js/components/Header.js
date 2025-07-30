// Header component for Zoorkhan store
class Header {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        // Listen for auth state changes
        window.addEventListener('authStateChange', (e) => {
            this.user = e.detail;
            this.render();
        });

        // Initialize with current user if available
        if (window.auth && window.auth.isAuthenticated()) {
            this.user = window.auth.getCurrentUser();
        }

        this.render();
    }

    render() {
        const header = document.querySelector('header');
        if (!header) return;

        header.innerHTML = `
            <nav class="bg-white shadow-md sticky top-0 z-20">
                <div class="container mx-auto px-4">
                    <div class="flex justify-between items-center py-4">
                        <!-- Logo and Brand -->
                        <div class="flex items-center space-x-reverse space-x-4 cursor-pointer" onclick="app.showHome()">
                            <img src="/static/assets/logo.svg" alt="زورخان" class="h-10 w-10">
                            <h1 class="text-2xl font-bold text-primary">زورخان</h1>
                        </div>

                        <!-- Desktop Navigation -->
                        <div class="hidden md:flex items-center space-x-reverse space-x-8">
                            <a href="#" onclick="app.showHome()" class="nav-link">خانه</a>
                            <a href="#" onclick="app.showProducts()" class="nav-link">محصولات</a>
                            <a href="#" onclick="app.showBlog()" class="nav-link">مقالات</a>
                            <a href="#" onclick="app.showAbout()" class="nav-link">درباره ما</a>
                            <a href="#" onclick="app.showContact()" class="nav-link">تماس</a>
                        </div>

                        <!-- User Actions -->
                        <div class="flex items-center space-x-reverse space-x-4">
                            <!-- Cart -->
                            <button onclick="window.cart.toggle()" class="relative p-2 text-gray-600 hover:text-primary transition-colors">
                                <i class="fas fa-shopping-cart text-xl"></i>
                                <span id="cart-count" class="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center hidden">0</span>
                            </button>

                            ${this.renderUserMenu()}

                            <!-- Mobile Menu Button -->
                            <button id="mobile-menu-btn" class="md:hidden p-2 text-gray-600 hover:text-primary transition-colors">
                                <i class="fas fa-bars text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Mobile Navigation -->
                    <div id="mobile-menu" class="md:hidden border-t border-gray-200 py-4 hidden">
                        <div class="flex flex-col space-y-4">
                            <a href="#" onclick="app.showHome()" class="nav-link">خانه</a>
                            <a href="#" onclick="app.showProducts()" class="nav-link">محصولات</a>
                            <a href="#" onclick="app.showBlog()" class="nav-link">مقالات</a>
                            <a href="#" onclick="app.showAbout()" class="nav-link">درباره ما</a>
                            <a href="#" onclick="app.showContact()" class="nav-link">تماس</a>
                            ${this.renderMobileUserMenu()}
                        </div>
                    </div>
                </div>
            </nav>
        `;

        // Add mobile menu toggle functionality
        this.setupMobileMenu();
    }

    renderUserMenu() {
        if (!this.user) {
            return `
                <div class="hidden md:flex items-center space-x-reverse space-x-2">
                    <button onclick="app.showLogin()" class="btn-outline text-sm px-4 py-2">ورود</button>
                    <button onclick="app.showRegister()" class="btn-primary text-sm px-4 py-2">ثبت نام</button>
                </div>
            `;
        }

        return `
            <div class="relative group hidden md:block">
                <button class="flex items-center space-x-reverse space-x-2 text-gray-700 hover:text-primary transition-colors">
                    <i class="fas fa-user"></i>
                    <span>${this.user.full_name || this.user.username}</span>
                    <i class="fas fa-chevron-down text-xs"></i>
                </button>
                <div class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 invisible group-hover:visible transition-all">
                    <a href="#" onclick="app.showDashboard()" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">پنل کاربری</a>
                    ${this.user.role === 'admin' ? '<a href="#" onclick="app.showAdmin()" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">مدیریت</a>' : ''}
                    <a href="#" onclick="window.auth.logout(); app.showHome()" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">خروج</a>
                </div>
            </div>
        `;
    }

    renderMobileUserMenu() {
        if (!this.user) {
            return `
                <div class="border-t border-gray-200 pt-4 mt-4">
                    <button onclick="app.showLogin()" class="block w-full text-right text-gray-700 hover:text-primary py-2">ورود</button>
                    <button onclick="app.showRegister()" class="block w-full text-right text-gray-700 hover:text-primary py-2">ثبت نام</button>
                </div>
            `;
        }

        return `
            <div class="border-t border-gray-200 pt-4 mt-4">
                <div class="text-sm text-gray-600 mb-2">${this.user.full_name || this.user.username}</div>
                <a href="#" onclick="app.showDashboard()" class="block text-gray-700 hover:text-primary py-2">پنل کاربری</a>
                ${this.user.role === 'admin' ? '<a href="#" onclick="app.showAdmin()" class="block text-gray-700 hover:text-primary py-2">مدیریت</a>' : ''}
                <a href="#" onclick="window.auth.logout(); app.showHome()" class="block text-gray-700 hover:text-primary py-2">خروج</a>
            </div>
        `;
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    updateCartCount(count) {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            if (count > 0) {
                cartCountElement.textContent = count;
                cartCountElement.classList.remove('hidden');
            } else {
                cartCountElement.classList.add('hidden');
            }
        }
    }
}

// Initialize header
window.header = new Header();