// Main application class for Zoorkhan store
class App {
    constructor() {
        this.currentPage = 'home';
        this.currentProduct = null;
        this.categories = [];
        this.products = [];
        this.blogPosts = [];
        this.init();
    }

    async init() {
        // Hide loading spinner after initialization
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
        }, 1000);

        // Load initial data
        await this.loadCategories();
        
        // Show home page by default
        this.showHome();
        
        // Listen for auth state changes
        window.addEventListener('authStateChange', (e) => {
            this.handleAuthStateChange(e.detail);
        });
    }

    async loadCategories() {
        try {
            const response = await window.api.getCategories();
            this.categories = response.categories;
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    showHome() {
        this.currentPage = 'home';
        this.render();
        this.loadHomePageData();
    }

    showProducts(params = {}) {
        this.currentPage = 'products';
        this.render();
        this.loadProducts(params);
    }

    showProductDetail(productId) {
        this.currentPage = 'product-detail';
        this.currentProduct = productId;
        this.render();
        this.loadProductDetail(productId);
    }

    showBlog() {
        this.currentPage = 'blog';
        this.render();
        window.blog.loadBlogPosts();
    }

    showBlogPost(postId) {
        this.currentPage = 'blog-post';
        this.render();
        window.blog.loadBlogPost(postId);
    }

    showLogin() {
        this.currentPage = 'login';
        this.render();
    }

    showRegister() {
        this.currentPage = 'register';
        this.render();
    }

    showDashboard() {
        this.currentPage = 'dashboard';
        this.render();
    }

    showAdmin() {
        this.currentPage = 'admin';
        this.render();
    }

    showCheckout() {
        this.currentPage = 'checkout';
        this.render();
    }

    showAbout() {
        this.currentPage = 'about';
        this.render();
    }

    showContact() {
        this.currentPage = 'contact';
        this.render();
    }

    render() {
        const mainContent = document.querySelector('#app main') || this.createMainElement();
        
        switch (this.currentPage) {
            case 'home':
                mainContent.innerHTML = this.renderHome();
                break;
            case 'products':
                mainContent.innerHTML = this.renderProducts();
                break;
            case 'product-detail':
                mainContent.innerHTML = this.renderProductDetail();
                break;
            case 'blog':
                mainContent.innerHTML = window.blog.render();
                break;
            case 'blog-post':
                mainContent.innerHTML = window.blog.renderPost();
                break;
            case 'login':
                mainContent.innerHTML = this.renderLogin();
                break;
            case 'register':
                mainContent.innerHTML = this.renderRegister();
                break;
            case 'dashboard':
                mainContent.innerHTML = window.dashboard.render();
                break;
            case 'admin':
                mainContent.innerHTML = window.admin.render();
                break;
            case 'checkout':
                mainContent.innerHTML = this.renderCheckout();
                break;
            case 'about':
                mainContent.innerHTML = this.renderAbout();
                break;
            case 'contact':
                mainContent.innerHTML = this.renderContact();
                break;
            default:
                mainContent.innerHTML = this.renderHome();
        }

        // Update header
        if (window.header) {
            window.header.render();
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }

    createMainElement() {
        const main = document.createElement('main');
        document.getElementById('app').appendChild(main);
        return main;
    }

    renderHome() {
        return `
            <!-- Hero Section -->
            <section class="hero-gradient text-white py-20">
                <div class="container mx-auto px-4 text-center">
                    <div class="flex justify-center mb-8">
                        <img src="/static/assets/logo.svg" alt="زورخان" class="h-24 w-24">
                    </div>
                    <h1 class="text-4xl md:text-6xl font-bold mb-6">زورخان</h1>
                    <p class="text-xl md:text-2xl mb-8 opacity-90">بهترین مکمل‌های ورزشی برای قهرمانان</p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onclick="app.showProducts()" class="btn-secondary text-lg px-8 py-4">
                            مشاهده محصولات
                            <i class="fas fa-arrow-left mr-2"></i>
                        </button>
                        <button onclick="app.showAbout()" class="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary">
                            درباره ما
                        </button>
                    </div>
                </div>
            </section>

            <!-- Categories Section -->
            <section class="py-16 bg-gray-50">
                <div class="container mx-auto px-4">
                    <h2 class="text-3xl font-bold text-center mb-12">دسته‌بندی محصولات</h2>
                    <div id="home-categories" class="category-grid">
                        <div class="text-center py-8">
                            <div class="loading-spinner mx-auto"></div>
                            <p class="text-gray-500 mt-2">در حال بارگذاری...</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Featured Products -->
            <section class="py-16">
                <div class="container mx-auto px-4">
                    <h2 class="text-3xl font-bold text-center mb-12">محصولات ویژه</h2>
                    <div id="featured-products" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div class="text-center py-8 col-span-full">
                            <div class="loading-spinner mx-auto"></div>
                            <p class="text-gray-500 mt-2">در حال بارگذاری...</p>
                        </div>
                    </div>
                    <div class="text-center mt-12">
                        <button onclick="app.showProducts()" class="btn-primary">
                            مشاهده همه محصولات
                            <i class="fas fa-arrow-left mr-2"></i>
                        </button>
                    </div>
                </div>
            </section>

            <!-- Why Choose Us -->
            <section class="py-16 bg-gray-50">
                <div class="container mx-auto px-4">
                    <h2 class="text-3xl font-bold text-center mb-12">چرا زورخانه؟</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="text-center">
                            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <i class="fas fa-medal text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-bold mb-4">کیفیت برتر</h3>
                            <p class="text-gray-600">تمام محصولات ما از بهترین برندهای دنیا و با بالاترین کیفیت</p>
                        </div>
                        <div class="text-center">
                            <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                <i class="fas fa-shipping-fast text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-bold mb-4">ارسال سریع</h3>
                            <p class="text-gray-600">ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان در سراسر کشور</p>
                        </div>
                        <div class="text-center">
                            <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                                <i class="fas fa-headset text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-bold mb-4">پشتیبانی ۲۴/۷</h3>
                            <p class="text-gray-600">تیم پشتیبانی ما همیشه آماده پاسخگویی به سوالات شماست</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Newsletter Section -->
            <section class="py-16 bg-primary text-white">
                <div class="container mx-auto px-4 text-center">
                    <h2 class="text-3xl font-bold mb-6">عضویت در خبرنامه</h2>
                    <p class="text-xl mb-8 opacity-90">از جدیدترین محصولات و تخفیف‌های ویژه باخبر شوید</p>
                    <form onsubmit="app.subscribeNewsletter(event)" class="max-w-md mx-auto flex gap-4">
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="ایمیل شما" 
                            required 
                            class="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                        <button type="submit" class="btn-secondary px-6 py-3">
                            عضویت
                        </button>
                    </form>
                </div>
            </section>
        `;
    }

    renderProducts() {
        return `
            <div class="container mx-auto px-4 py-8">
                <div class="flex flex-col lg:flex-row gap-8">
                    <!-- Filters Sidebar -->
                    <div class="lg:w-1/4">
                        <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h3 class="text-lg font-bold mb-6">فیلترها</h3>
                            
                            <!-- Search -->
                            <div class="mb-6">
                                <label class="form-label">جستجو</label>
                                <input 
                                    type="text" 
                                    id="product-search"
                                    placeholder="نام محصول..." 
                                    class="form-input"
                                    onchange="app.filterProducts()"
                                >
                            </div>
                            
                            <!-- Categories -->
                            <div class="mb-6">
                                <label class="form-label">دسته‌بندی</label>
                                <select id="category-filter" class="form-input" onchange="app.filterProducts()">
                                    <option value="">همه دسته‌بندی‌ها</option>
                                    ${this.categories.map(cat => 
                                        `<option value="${cat.id}">${cat.name_persian}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            
                            <!-- Price Range -->
                            <div class="mb-6">
                                <label class="form-label">محدوده قیمت</label>
                                <div class="flex gap-2">
                                    <input 
                                        type="number" 
                                        id="min-price"
                                        placeholder="از" 
                                        class="form-input"
                                        onchange="app.filterProducts()"
                                    >
                                    <input 
                                        type="number" 
                                        id="max-price"
                                        placeholder="تا" 
                                        class="form-input"
                                        onchange="app.filterProducts()"
                                    >
                                </div>
                            </div>
                            
                            <!-- Sort -->
                            <div class="mb-6">
                                <label class="form-label">مرتب‌سازی</label>
                                <select id="sort-filter" class="form-input" onchange="app.filterProducts()">
                                    <option value="">پیش‌فرض</option>
                                    <option value="price_asc">قیمت: کم به زیاد</option>
                                    <option value="price_desc">قیمت: زیاد به کم</option>
                                    <option value="name">نام محصول</option>
                                </select>
                            </div>
                            
                            <button onclick="app.clearFilters()" class="btn-outline w-full">
                                پاک کردن فیلترها
                            </button>
                        </div>
                    </div>

                    <!-- Products Grid -->
                    <div class="lg:w-3/4">
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-2xl font-bold">محصولات</h2>
                                <div class="flex items-center gap-4">
                                    <span id="products-count" class="text-gray-600"></span>
                                    <div class="flex gap-2">
                                        <button onclick="app.setProductView('grid')" class="p-2 rounded bg-gray-100 hover:bg-gray-200">
                                            <i class="fas fa-th"></i>
                                        </button>
                                        <button onclick="app.setProductView('list')" class="p-2 rounded bg-gray-100 hover:bg-gray-200">
                                            <i class="fas fa-list"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="products-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div class="text-center py-8 col-span-full">
                                    <div class="loading-spinner mx-auto"></div>
                                    <p class="text-gray-500 mt-2">در حال بارگذاری محصولات...</p>
                                </div>
                            </div>
                            
                            <!-- Pagination -->
                            <div id="products-pagination" class="mt-8 flex justify-center">
                                <!-- Pagination will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderProductDetail() {
        return `
            <div class="container mx-auto px-4 py-8">
                <div id="product-detail-content">
                    <div class="text-center py-12">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-4">در حال بارگذاری محصول...</p>
                    </div>
                </div>
                
                <!-- Related Products -->
                <div class="mt-16">
                    <h2 class="text-2xl font-bold mb-8">محصولات مشابه</h2>
                    <div id="related-products" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <!-- Related products will be loaded here -->
                    </div>
                </div>
            </div>
        `;
    }

    renderLogin() {
        return `
            <div class="container mx-auto px-4 py-8">
                <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
                    <div class="text-center mb-8">
                        <img src="/static/assets/logo.svg" alt="زورخانه" class="h-16 w-16 mx-auto mb-4">
                        <h2 class="text-2xl font-bold">ورود به زورخانه</h2>
                        <p class="text-gray-600 mt-2">به حساب کاربری خود وارد شوید</p>
                    </div>
                    
                    <form onsubmit="app.handleLogin(event)" class="space-y-6">
                        <div>
                            <label class="form-label">ایمیل</label>
                            <input type="email" name="email" required class="form-input">
                        </div>
                        
                        <div>
                            <label class="form-label">رمز عبور</label>
                            <input type="password" name="password" required class="form-input">
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <label class="flex items-center">
                                <input type="checkbox" class="custom-checkbox ml-2">
                                <span class="text-sm text-gray-600">مرا به خاطر بسپار</span>
                            </label>
                            <a href="#" class="text-sm text-primary hover:underline">فراموشی رمز عبور؟</a>
                        </div>
                        
                        <button type="submit" class="btn-primary w-full">
                            ورود
                            <i class="fas fa-sign-in-alt mr-2"></i>
                        </button>
                    </form>
                    
                    <div class="text-center mt-6">
                        <p class="text-gray-600">
                            حساب کاربری ندارید؟
                            <button onclick="app.showRegister()" class="text-primary hover:underline font-medium">
                                ثبت نام کنید
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    renderRegister() {
        return `
            <div class="container mx-auto px-4 py-8">
                <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
                    <div class="text-center mb-8">
                        <img src="/static/assets/logo.svg" alt="زورخانه" class="h-16 w-16 mx-auto mb-4">
                        <h2 class="text-2xl font-bold">ثبت نام در زورخانه</h2>
                        <p class="text-gray-600 mt-2">حساب کاربری جدید ایجاد کنید</p>
                    </div>
                    
                    <form onsubmit="app.handleRegister(event)" class="space-y-6">
                        <div>
                            <label class="form-label">نام کامل</label>
                            <input type="text" name="full_name" required class="form-input">
                        </div>
                        
                        <div>
                            <label class="form-label">نام کاربری</label>
                            <input type="text" name="username" required class="form-input">
                        </div>
                        
                        <div>
                            <label class="form-label">ایمیل</label>
                            <input type="email" name="email" required class="form-input">
                        </div>
                        
                        <div>
                            <label class="form-label">شماره تماس</label>
                            <input type="tel" name="phone" class="form-input">
                        </div>
                        
                        <div>
                            <label class="form-label">رمز عبور</label>
                            <input type="password" name="password" required class="form-input">
                        </div>
                        
                        <div>
                            <label class="form-label">تکرار رمز عبور</label>
                            <input type="password" name="confirm_password" required class="form-input">
                        </div>
                        
                        <div>
                            <label class="flex items-center">
                                <input type="checkbox" required class="custom-checkbox ml-2">
                                <span class="text-sm text-gray-600">
                                    قوانین و مقررات را مطالعه کرده و می‌پذیرم
                                </span>
                            </label>
                        </div>
                        
                        <button type="submit" class="btn-primary w-full">
                            ثبت نام
                            <i class="fas fa-user-plus mr-2"></i>
                        </button>
                    </form>
                    
                    <div class="text-center mt-6">
                        <p class="text-gray-600">
                            قبلا ثبت نام کرده‌اید؟
                            <button onclick="app.showLogin()" class="text-primary hover:underline font-medium">
                                وارد شوید
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    renderCheckout() {
        return `
            <div class="container mx-auto px-4 py-8">
                <h2 class="text-3xl font-bold mb-8">تسویه حساب</h2>
                
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Checkout Form -->
                    <div class="lg:col-span-2">
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h3 class="text-xl font-bold mb-6">اطلاعات تحویل</h3>
                            
                            <form onsubmit="app.handleCheckout(event)" class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="form-label">نام و نام خانوادگی</label>
                                        <input type="text" name="full_name" required class="form-input">
                                    </div>
                                    <div>
                                        <label class="form-label">شماره تماس</label>
                                        <input type="tel" name="phone" required class="form-input">
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="form-label">آدرس کامل</label>
                                    <textarea name="shipping_address" rows="3" required class="form-input"></textarea>
                                </div>
                                
                                <div>
                                    <label class="form-label">توضیحات اضافی (اختیاری)</label>
                                    <textarea name="notes" rows="2" class="form-input"></textarea>
                                </div>
                                
                                <div class="border-t pt-6">
                                    <h4 class="text-lg font-semibold mb-4">روش پرداخت</h4>
                                    <div class="space-y-3">
                                        <label class="flex items-center">
                                            <input type="radio" name="payment_method" value="online" checked class="ml-2">
                                            <span>پرداخت آنلاین</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="radio" name="payment_method" value="cod" class="ml-2">
                                            <span>پرداخت در محل (پس کرایه)</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <button type="submit" class="btn-primary w-full text-lg py-4">
                                    ثبت سفارش و پرداخت
                                    <i class="fas fa-credit-card mr-2"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                    
                    <!-- Order Summary -->
                    <div>
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h3 class="text-xl font-bold mb-6">خلاصه سفارش</h3>
                            <div id="checkout-summary">
                                <div class="text-center py-4">
                                    <div class="loading-spinner mx-auto"></div>
                                    <p class="text-gray-500 mt-2">در حال بارگذاری...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAbout() {
        return `
            <div class="container mx-auto px-4 py-8">
                <div class="max-w-4xl mx-auto">
                    <div class="text-center mb-12">
                        <img src="/static/assets/logo.svg" alt="زورخانه" class="h-20 w-20 mx-auto mb-6">
                        <h1 class="text-4xl font-bold mb-4">درباره زورخانه</h1>
                        <p class="text-xl text-gray-600">همراه شما در مسیر تناسب اندام و سلامتی</p>
                    </div>
                    
                    <div class="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 class="text-2xl font-bold mb-6">داستان ما</h2>
                        <p class="text-gray-700 leading-relaxed mb-6">
                            زورخانه با هدف ارائه بهترین و باکیفیت‌ترین مکمل‌های ورزشی و تغذیه‌ای در ایران آغاز به کار کرد. 
                            ما باور داریم که هر فردی حق دارد به بهترین محصولات برای رسیدن به اهداف ورزشی و سلامتی خود دسترسی داشته باشد.
                        </p>
                        <p class="text-gray-700 leading-relaxed mb-6">
                            تیم ما متشکل از متخصصان تغذیه، مربیان ورزشی و پزشکان است که با بررسی دقیق و علمی، 
                            بهترین محصولات را از برندهای معتبر جهان برای شما انتخاب می‌کنند.
                        </p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h3 class="text-xl font-bold mb-4 text-primary">ماموریت ما</h3>
                            <p class="text-gray-700">
                                ارائه محصولات باکیفیت، خدمات مطمئن و مشاوره تخصصی برای کمک به ورزشکاران 
                                و علاقه‌مندان به تناسب اندام در رسیدن به بهترین نتایج.
                            </p>
                        </div>
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h3 class="text-xl font-bold mb-4 text-secondary">چشم‌انداز ما</h3>
                            <p class="text-gray-700">
                                تبدیل شدن به مرجع اصلی و معتبرترین فروشگاه مکمل‌های ورزشی در ایران 
                                و منطقه با ارائه بهترین کیفیت و خدمات.
                            </p>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-lg shadow-md p-8">
                        <h2 class="text-2xl font-bold mb-6">مزایای خرید از زورخانه</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="flex items-start space-x-reverse space-x-4">
                                <i class="fas fa-check-circle text-2xl text-green-500 mt-1"></i>
                                <div>
                                    <h4 class="font-semibold mb-2">محصولات اورجینال</h4>
                                    <p class="text-gray-600 text-sm">تمام محصولات ما ۱۰۰٪ اصل و از نمایندگی‌های رسمی</p>
                                </div>
                            </div>
                            <div class="flex items-start space-x-reverse space-x-4">
                                <i class="fas fa-shipping-fast text-2xl text-blue-500 mt-1"></i>
                                <div>
                                    <h4 class="font-semibold mb-2">ارسال سریع</h4>
                                    <p class="text-gray-600 text-sm">ارسال در کمترین زمان ممکن به سراسر کشور</p>
                                </div>
                            </div>
                            <div class="flex items-start space-x-reverse space-x-4">
                                <i class="fas fa-headset text-2xl text-purple-500 mt-1"></i>
                                <div>
                                    <h4 class="font-semibold mb-2">پشتیبانی ۲۴/۷</h4>
                                    <p class="text-gray-600 text-sm">تیم پشتیبانی همیشه در خدمت شما</p>
                                </div>
                            </div>
                            <div class="flex items-start space-x-reverse space-x-4">
                                <i class="fas fa-medal text-2xl text-yellow-500 mt-1"></i>
                                <div>
                                    <h4 class="font-semibold mb-2">ضمانت کیفیت</h4>
                                    <p class="text-gray-600 text-sm">ضمانت بازگشت وجه در صورت عدم رضایت</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderContact() {
        return `
            <div class="container mx-auto px-4 py-8">
                <div class="max-w-4xl mx-auto">
                    <div class="text-center mb-12">
                        <h1 class="text-4xl font-bold mb-4">تماس با ما</h1>
                        <p class="text-xl text-gray-600">ما همیشه آماده پاسخگویی به سوالات شما هستیم</p>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Contact Form -->
                        <div class="bg-white rounded-lg shadow-md p-8">
                            <h2 class="text-2xl font-bold mb-6">ارسال پیام</h2>
                            <form onsubmit="app.handleContactForm(event)" class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="form-label">نام</label>
                                        <input type="text" name="name" required class="form-input">
                                    </div>
                                    <div>
                                        <label class="form-label">نام خانوادگی</label>
                                        <input type="text" name="lastname" required class="form-input">
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="form-label">ایمیل</label>
                                    <input type="email" name="email" required class="form-input">
                                </div>
                                
                                <div>
                                    <label class="form-label">شماره تماس</label>
                                    <input type="tel" name="phone" class="form-input">
                                </div>
                                
                                <div>
                                    <label class="form-label">موضوع</label>
                                    <select name="subject" required class="form-input">
                                        <option value="">انتخاب کنید</option>
                                        <option value="product">سوال درباره محصولات</option>
                                        <option value="order">پیگیری سفارش</option>
                                        <option value="support">پشتیبانی فنی</option>
                                        <option value="complaint">شکایت</option>
                                        <option value="suggestion">پیشنهاد</option>
                                        <option value="other">سایر</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="form-label">پیام</label>
                                    <textarea name="message" rows="5" required class="form-input"></textarea>
                                </div>
                                
                                <button type="submit" class="btn-primary w-full">
                                    ارسال پیام
                                    <i class="fas fa-paper-plane mr-2"></i>
                                </button>
                            </form>
                        </div>
                        
                        <!-- Contact Info -->
                        <div class="space-y-6">
                            <div class="bg-white rounded-lg shadow-md p-8">
                                <h3 class="text-xl font-bold mb-6">اطلاعات تماس</h3>
                                <div class="space-y-4">
                                    <div class="flex items-center space-x-reverse space-x-4">
                                        <i class="fas fa-map-marker-alt text-xl text-primary"></i>
                                        <div>
                                            <h4 class="font-semibold">آدرس</h4>
                                            <p class="text-gray-600">تهران، خیابان ولیعصر، پلاک ۱۲۳</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-reverse space-x-4">
                                        <i class="fas fa-phone text-xl text-secondary"></i>
                                        <div>
                                            <h4 class="font-semibold">تلفن</h4>
                                            <p class="text-gray-600" dir="ltr">021-12345678</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-reverse space-x-4">
                                        <i class="fas fa-envelope text-xl text-accent"></i>
                                        <div>
                                            <h4 class="font-semibold">ایمیل</h4>
                                            <p class="text-gray-600">info@zoorkhan.com</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-reverse space-x-4">
                                        <i class="fas fa-clock text-xl text-purple-500"></i>
                                        <div>
                                            <h4 class="font-semibold">ساعات کاری</h4>
                                            <p class="text-gray-600">شنبه تا پنج‌شنبه: ۸ صبح تا ۱۰ شب</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-white rounded-lg shadow-md p-8">
                                <h3 class="text-xl font-bold mb-6">شبکه‌های اجتماعی</h3>
                                <div class="flex space-x-reverse space-x-4">
                                    <a href="#" class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                                        <i class="fab fa-telegram"></i>
                                    </a>
                                    <a href="#" class="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition-colors">
                                        <i class="fab fa-instagram"></i>
                                    </a>
                                    <a href="#" class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors">
                                        <i class="fab fa-whatsapp"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Event handlers
    async handleLogin(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const credentials = Object.fromEntries(formData.entries());

        try {
            const response = await window.api.login(credentials);
            window.auth.login(response.access_token, response.user);
            this.showToast('خوش آمدید!', 'success');
            this.showHome();
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const userData = Object.fromEntries(formData.entries());

        if (userData.password !== userData.confirm_password) {
            this.showToast('رمز عبور و تکرار آن یکسان نیست', 'error');
            return;
        }

        try {
            const response = await window.api.register(userData);
            window.auth.login(response.access_token, response.user);
            this.showToast('ثبت نام با موفقیت انجام شد', 'success');
            this.showHome();
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    async handleCheckout(event) {
        event.preventDefault();
        
        if (!window.cart.items || window.cart.items.length === 0) {
            this.showToast('سبد خرید شما خالی است', 'error');
            return;
        }

        const formData = new FormData(event.target);
        const orderData = Object.fromEntries(formData.entries());
        orderData.items = window.cart.items;

        try {
            const response = await window.api.createOrder(orderData);
            window.cart.clear();
            this.showToast('سفارش شما با موفقیت ثبت شد', 'success');
            this.showDashboard();
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    async subscribeNewsletter(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');

        try {
            await window.api.subscribeNewsletter(email);
            this.showToast('عضویت در خبرنامه با موفقیت انجام شد', 'success');
            event.target.reset();
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    handleContactForm(event) {
        event.preventDefault();
        // For demo purposes, just show success message
        this.showToast('پیام شما با موفقیت ارسال شد', 'success');
        event.target.reset();
    }

    // Data loading methods
    async loadHomePageData() {
        this.loadHomepageCategories();
        this.loadFeaturedProducts();
    }

    async loadHomepageCategories() {
        try {
            const container = document.getElementById('home-categories');
            if (!container) return;

            if (this.categories.length > 0) {
                container.innerHTML = this.categories.map(category => `
                    <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onclick="app.showProducts({category_id: ${category.id}})">
                        <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-dumbbell text-2xl text-white"></i>
                        </div>
                        <h3 class="font-bold text-lg mb-2">${category.name_persian}</h3>
                        <p class="text-gray-600 text-sm">${category.description || 'مشاهده محصولات'}</p>
                    </div>
                `).join('');
            } else {
                container.innerHTML = `
                    <div class="col-span-full text-center py-8">
                        <p class="text-gray-500">دسته‌بندی‌ای یافت نشد</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading homepage categories:', error);
        }
    }

    async loadFeaturedProducts() {
        try {
            const container = document.getElementById('featured-products');
            if (!container) return;

            const response = await window.api.getProducts({ per_page: 4 });
            
            if (response.products.length > 0) {
                container.innerHTML = response.products.map(product => 
                    ProductCard.render(product)
                ).join('');
            } else {
                container.innerHTML = `
                    <div class="col-span-full text-center py-8">
                        <p class="text-gray-500">محصولی یافت نشد</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading featured products:', error);
            const container = document.getElementById('featured-products');
            if (container) {
                container.innerHTML = `
                    <div class="col-span-full text-center py-8 text-red-500">
                        <p>خطا در بارگذاری محصولات</p>
                    </div>
                `;
            }
        }
    }

    async loadProducts(params = {}) {
        try {
            const container = document.getElementById('products-grid');
            if (!container) return;

            const response = await window.api.getProducts(params);
            
            // Update products count
            const countElement = document.getElementById('products-count');
            if (countElement) {
                countElement.textContent = `${response.products.length} محصول از ${response.total}`;
            }

            if (response.products.length > 0) {
                container.innerHTML = response.products.map(product => 
                    ProductCard.render(product)
                ).join('');
            } else {
                container.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500">محصولی با این فیلترها یافت نشد</p>
                        <button onclick="app.clearFilters()" class="btn-primary mt-4">
                            پاک کردن فیلترها
                        </button>
                    </div>
                `;
            }

            // Handle pagination
            this.renderPagination(response);

        } catch (error) {
            console.error('Error loading products:', error);
            const container = document.getElementById('products-grid');
            if (container) {
                container.innerHTML = `
                    <div class="col-span-full text-center py-8 text-red-500">
                        <p>خطا در بارگذاری محصولات</p>
                    </div>
                `;
            }
        }
    }

    async loadProductDetail(productId) {
        try {
            const container = document.getElementById('product-detail-content');
            if (!container) return;

            const response = await window.api.getProduct(productId);
            container.innerHTML = ProductCard.renderDetailed(response.product);

            // Load related products
            this.loadRelatedProducts(response.product.category_id, productId);

        } catch (error) {
            console.error('Error loading product detail:', error);
            const container = document.getElementById('product-detail-content');
            if (container) {
                container.innerHTML = `
                    <div class="text-center py-12 text-red-500">
                        <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                        <p>خطا در بارگذاری محصول</p>
                        <button onclick="app.showProducts()" class="btn-primary mt-4">
                            بازگشت به محصولات
                        </button>
                    </div>
                `;
            }
        }
    }

    async loadRelatedProducts(categoryId, excludeId) {
        try {
            const container = document.getElementById('related-products');
            if (!container) return;

            const response = await window.api.getProducts({ 
                category_id: categoryId, 
                per_page: 4 
            });
            
            const relatedProducts = response.products.filter(p => p.id !== excludeId);
            
            if (relatedProducts.length > 0) {
                container.innerHTML = relatedProducts.map(product => 
                    ProductCard.render(product)
                ).join('');
            } else {
                container.innerHTML = `
                    <div class="col-span-full text-center py-8">
                        <p class="text-gray-500">محصول مشابهی یافت نشد</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading related products:', error);
        }
    }

    // Utility methods
    filterProducts() {
        const search = document.getElementById('product-search')?.value || '';
        const categoryId = document.getElementById('category-filter')?.value || '';
        const minPrice = document.getElementById('min-price')?.value || '';
        const maxPrice = document.getElementById('max-price')?.value || '';
        const sort = document.getElementById('sort-filter')?.value || '';

        const params = {};
        if (search) params.search = search;
        if (categoryId) params.category_id = categoryId;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (sort) params.sort = sort;

        this.loadProducts(params);
    }

    clearFilters() {
        const inputs = ['product-search', 'category-filter', 'min-price', 'max-price', 'sort-filter'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });
        this.loadProducts();
    }

    renderPagination(response) {
        const container = document.getElementById('products-pagination');
        if (!container) return;

        if (response.pages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="flex items-center space-x-reverse space-x-2">';

        // Previous button
        if (response.has_prev) {
            paginationHTML += `
                <button onclick="app.loadProducts({page: ${response.current_page - 1}})" 
                        class="px-3 py-2 border rounded hover:bg-gray-100">
                    قبلی
                </button>
            `;
        }

        // Page numbers
        for (let i = 1; i <= response.pages; i++) {
            if (i === response.current_page) {
                paginationHTML += `
                    <button class="px-3 py-2 bg-primary text-white rounded">
                        ${i}
                    </button>
                `;
            } else {
                paginationHTML += `
                    <button onclick="app.loadProducts({page: ${i}})" 
                            class="px-3 py-2 border rounded hover:bg-gray-100">
                        ${i}
                    </button>
                `;
            }
        }

        // Next button
        if (response.has_next) {
            paginationHTML += `
                <button onclick="app.loadProducts({page: ${response.current_page + 1}})" 
                        class="px-3 py-2 border rounded hover:bg-gray-100">
                    بعدی
                </button>
            `;
        }

        paginationHTML += '</div>';
        container.innerHTML = paginationHTML;
    }

    handleAuthStateChange(authData) {
        // Re-render current page when auth state changes
        this.render();
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type} fade-in`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} ml-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.getElementById('toast-container').appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
