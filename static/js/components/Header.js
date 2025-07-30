// Header component for navigation and user menu
class Header {
    constructor() {
        this.cartItemCount = 0;
        this.isMenuOpen = false;
        this.render();
        this.bindEvents();
        this.updateCartCount();
        
        // Listen for auth state changes
        window.addEventListener('authStateChange', () => {
            this.render();
        });
        
        // Listen for cart updates
        window.addEventListener('cartUpdated', (e) => {
            this.updateCartCount();
        });
    }

    render() {
        const user = window.auth.getCurrentUser();
        const isAuthenticated = window.auth.isAuthenticated();
        const isAdmin = window.auth.isAdmin();

        const headerHTML = `
            <header class="bg-white shadow-lg sticky top-0 z-30">
                <div class="container mx-auto px-4">
                    <div class="flex items-center justify-between h-16">
                        <!-- Logo -->
                        <div class="flex items-center cursor-pointer" onclick="app.showHome()">
                            <img src="/static/assets/logo.svg" alt="زورخان" class="h-10 w-10 ml-2">
                            <span class="text-xl font-bold text-primary">زورخان</span>
                        </div>

                        <!-- Desktop Navigation -->
                        <nav class="hidden md:flex items-center space-x-reverse space-x-8">
                            <a href="#" onclick="app.showHome()" class="text-gray-700 hover:text-primary transition-colors">خانه</a>
                            <a href="#" onclick="app.showProducts()" class="text-gray-700 hover:text-primary transition-colors">محصولات</a>
                            <a href="#" onclick="app.showBlog()" class="text-gray-700 hover:text-primary transition-colors">بلاگ</a>
                            <a href="#" onclick="app.showAbout()" class="text-gray-700 hover:text-primary transition-colors">درباره ما</a>
                            <a href="#" onclick="app.showContact()" class="text-gray-700 hover:text-primary transition-colors">تماس با ما</a>
                        </nav>

                        <!-- User Actions -->
                        <div class="flex items-center space-x-reverse space-x-4">
                            <!-- Search -->
                            <div class="hidden lg:flex relative">
                                <input 
                                    type="text" 
                                    id="search-input"
                                    placeholder="جستجو محصولات..." 
                                    class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                >
                                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            </div>

                            <!-- Cart -->
                            <button 
                                onclick="window.cart.toggle()" 
                                class="relative p-2 text-gray-700 hover:text-primary transition-colors"
                            >
                                <i class="fas fa-shopping-cart text-xl"></i>
                                <span id="cart-count" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    ${this.cartItemCount}
                                </span>
                            </button>

                            <!-- User Menu -->
                            ${isAuthenticated ? `
                                <div class="relative">
                                    <button 
                                        onclick="this.nextElementSibling.classList.toggle('hidden')"
                                        class="flex items-center space-x-reverse space-x-2 text-gray-700 hover:text-primary transition-colors"
                                    >
                                        <i class="fas fa-user-circle text-xl"></i>
                                        <span class="hidden md:inline">${user.full_name}</span>
                                        <i class="fas fa-chevron-down"></i>
                                    </button>
                                    <div class="hidden absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2">
                                        <a href="#" onclick="app.showDashboard()" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <i class="fas fa-tachometer-alt ml-2"></i>
                                            داشبورد
                                        </a>
                                        ${isAdmin ? `
                                            <a href="#" onclick="app.showAdmin()" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <i class="fas fa-cog ml-2"></i>
                                                مدیریت
                                            </a>
                                        ` : ''}
                                        <hr class="my-2">
                                        <a href="#" onclick="window.auth.logout(); app.showHome()" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                            <i class="fas fa-sign-out-alt ml-2"></i>
                                            خروج
                                        </a>
                                    </div>
                                </div>
                            ` : `
                                <button 
                                    onclick="app.showLogin()" 
                                    class="btn-outline text-sm px-4 py-2"
                                >
                                    ورود / ثبت نام
                                </button>
                            `}

                            <!-- Mobile Menu Toggle -->
                            <button 
                                onclick="this.parentElement.parentElement.parentElement.querySelector('#mobile-menu').classList.toggle('hidden')"
                                class="md:hidden p-2 text-gray-700 hover:text-primary"
                            >
                                <i class="fas fa-bars text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Mobile Menu -->
                    <div id="mobile-menu" class="hidden md:hidden py-4 border-t">
                        <div class="flex flex-col space-y-2">
                            <!-- Mobile Search -->
                            <div class="relative mb-4">
                                <input 
                                    type="text" 
                                    placeholder="جستجو محصولات..." 
                                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            </div>
                            
                            <a href="#" onclick="app.showHome()" class="py-2 text-gray-700 hover:text-primary transition-colors">خانه</a>
                            <a href="#" onclick="app.showProducts()" class="py-2 text-gray-700 hover:text-primary transition-colors">محصولات</a>
                            <a href="#" onclick="app.showBlog()" class="py-2 text-gray-700 hover:text-primary transition-colors">بلاگ</a>
                            <a href="#" onclick="app.showAbout()" class="py-2 text-gray-700 hover:text-primary transition-colors">درباره ما</a>
                            <a href="#" onclick="app.showContact()" class="py-2 text-gray-700 hover:text-primary transition-colors">تماس با ما</a>
                        </div>
                    </div>
                </div>
            </header>
        `;

        // Update header if it exists, otherwise create it
        let headerElement = document.querySelector('header');
        if (headerElement) {
            headerElement.outerHTML = headerHTML;
        } else {
            document.getElementById('app').insertAdjacentHTML('afterbegin', headerHTML);
        }
    }

    bindEvents() {
        // Search functionality
        document.addEventListener('input', (e) => {
            if (e.target.id === 'search-input' || e.target.placeholder === 'جستجو محصولات...') {
                this.handleSearch(e.target.value);
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.relative')) {
                document.querySelectorAll('.relative .hidden').forEach(el => {
                    if (!el.classList.contains('hidden')) {
                        el.classList.add('hidden');
                    }
                });
            }
        });
    }

    handleSearch(query) {
        if (query.length >= 2) {
            // Debounce search
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                app.showProducts({ search: query });
            }, 500);
        }
    }

    updateCartCount() {
        const count = window.cart ? window.cart.getItemCount() : 0;
        this.cartItemCount = count;
        
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
            cartCountElement.style.display = count > 0 ? 'flex' : 'none';
        }
    }
}

// Initialize header when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.header = new Header();
});
