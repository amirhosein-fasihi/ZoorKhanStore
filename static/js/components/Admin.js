// Admin panel component
class Admin {
    constructor() {
        this.currentSection = 'dashboard';
    }

    render() {
        if (!window.auth.isAdmin()) {
            return `
                <div class="container mx-auto px-4 py-8">
                    <div class="text-center">
                        <h1 class="text-2xl font-bold text-red-600 mb-4">دسترسی محدود</h1>
                        <p class="text-gray-600">شما دسترسی به این بخش را ندارید.</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="container mx-auto px-4 py-8">
                <div class="flex flex-col lg:flex-row gap-8">
                    <!-- Admin Sidebar -->
                    <div class="lg:w-1/4">
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h2 class="text-xl font-bold mb-6">پنل مدیریت</h2>
                            <nav class="space-y-2">
                                <button 
                                    onclick="admin.showSection('dashboard')" 
                                    class="admin-nav-item ${this.currentSection === 'dashboard' ? 'active' : ''}"
                                >
                                    <i class="fas fa-tachometer-alt ml-2"></i>
                                    داشبورد
                                </button>
                                <button 
                                    onclick="admin.showSection('products')" 
                                    class="admin-nav-item ${this.currentSection === 'products' ? 'active' : ''}"
                                >
                                    <i class="fas fa-box ml-2"></i>
                                    مدیریت محصولات
                                </button>
                                <button 
                                    onclick="admin.showSection('categories')" 
                                    class="admin-nav-item ${this.currentSection === 'categories' ? 'active' : ''}"
                                >
                                    <i class="fas fa-tags ml-2"></i>
                                    مدیریت دسته‌بندی‌ها
                                </button>
                                <button 
                                    onclick="admin.showSection('orders')" 
                                    class="admin-nav-item ${this.currentSection === 'orders' ? 'active' : ''}"
                                >
                                    <i class="fas fa-shopping-bag ml-2"></i>
                                    مدیریت سفارشات
                                </button>
                                <button 
                                    onclick="admin.showSection('blog')" 
                                    class="admin-nav-item ${this.currentSection === 'blog' ? 'active' : ''}"
                                >
                                    <i class="fas fa-edit ml-2"></i>
                                    مدیریت بلاگ
                                </button>
                                <button 
                                    onclick="admin.showSection('users')" 
                                    class="admin-nav-item ${this.currentSection === 'users' ? 'active' : ''}"
                                >
                                    <i class="fas fa-users ml-2"></i>
                                    مدیریت کاربران
                                </button>
                            </nav>
                        </div>
                    </div>

                    <!-- Admin Content -->
                    <div class="lg:w-3/4">
                        <div id="admin-content">
                            ${this.renderSection()}
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .admin-nav-item {
                    display: block;
                    width: 100%;
                    text-align: right;
                    padding: 12px 16px;
                    border-radius: 8px;
                    transition: all 0.2s;
                    color: #374151;
                    background: transparent;
                    border: none;
                    font-size: 14px;
                }
                
                .admin-nav-item:hover {
                    background: #f3f4f6;
                    color: #1f2937;
                }
                
                .admin-nav-item.active {
                    background: #1f2937;
                    color: white;
                }
            </style>
        `;
    }

    showSection(section) {
        this.currentSection = section;
        document.getElementById('admin-content').innerHTML = this.renderSection();
    }

    renderSection() {
        switch (this.currentSection) {
            case 'dashboard':
                return this.renderDashboard();
            case 'products':
                return this.renderProducts();
            case 'categories':
                return this.renderCategories();
            case 'orders':
                return this.renderOrders();
            case 'blog':
                return this.renderBlog();
            case 'users':
                return this.renderUsers();
            default:
                return this.renderDashboard();
        }
    }

    renderDashboard() {
        // Load dashboard data
        this.loadDashboardData();
        
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-bold mb-6">داشبورد مدیریت</h2>
                
                <div id="dashboard-stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="text-center">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-2">در حال بارگذاری...</p>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4">آخرین سفارشات</h3>
                    <div id="recent-orders">
                        <div class="text-center py-4">
                            <div class="loading-spinner mx-auto"></div>
                            <p class="text-gray-500 mt-2">در حال بارگذاری...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadDashboardData() {
        try {
            const data = await window.api.getAdminDashboard();
            
            // Update stats
            document.getElementById('dashboard-stats').innerHTML = `
                <div class="bg-blue-50 p-6 rounded-lg text-center">
                    <i class="fas fa-users text-3xl text-blue-600 mb-2"></i>
                    <h3 class="text-2xl font-bold text-blue-900">${data.stats.total_users}</h3>
                    <p class="text-blue-700">کاربران</p>
                </div>
                <div class="bg-green-50 p-6 rounded-lg text-center">
                    <i class="fas fa-box text-3xl text-green-600 mb-2"></i>
                    <h3 class="text-2xl font-bold text-green-900">${data.stats.total_products}</h3>
                    <p class="text-green-700">محصولات</p>
                </div>
                <div class="bg-yellow-50 p-6 rounded-lg text-center">
                    <i class="fas fa-shopping-bag text-3xl text-yellow-600 mb-2"></i>
                    <h3 class="text-2xl font-bold text-yellow-900">${data.stats.total_orders}</h3>
                    <p class="text-yellow-700">سفارشات</p>
                </div>
                <div class="bg-purple-50 p-6 rounded-lg text-center">
                    <i class="fas fa-chart-line text-3xl text-purple-600 mb-2"></i>
                    <h3 class="text-2xl font-bold text-purple-900 price">
                        ${new Intl.NumberFormat('fa-IR').format(data.stats.total_revenue)}
                    </h3>
                    <p class="text-purple-700">درآمد (تومان)</p>
                </div>
            `;
            
            // Update recent orders
            if (data.recent_orders.length > 0) {
                const ordersHTML = data.recent_orders.map(order => `
                    <div class="border-b py-4 flex justify-between items-center">
                        <div>
                            <p class="font-medium">سفارش #${order.id}</p>
                            <p class="text-sm text-gray-600">${new Date(order.created_at).toLocaleDateString('fa-IR')}</p>
                        </div>
                        <div class="text-left">
                            <p class="font-bold price">${new Intl.NumberFormat('fa-IR').format(order.total_amount)} تومان</p>
                            <span class="badge status-${order.status}">${this.getOrderStatusText(order.status)}</span>
                        </div>
                    </div>
                `).join('');
                
                document.getElementById('recent-orders').innerHTML = ordersHTML;
            } else {
                document.getElementById('recent-orders').innerHTML = `
                    <p class="text-gray-500 text-center py-4">سفارشی یافت نشد</p>
                `;
            }
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            document.getElementById('dashboard-stats').innerHTML = `
                <div class="col-span-4 text-center text-red-500">
                    <p>خطا در بارگذاری داده‌ها</p>
                </div>
            `;
        }
    }

    renderProducts() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">مدیریت محصولات</h2>
                    <button onclick="admin.showProductForm()" class="btn-primary">
                        <i class="fas fa-plus ml-2"></i>
                        افزودن محصول جدید
                    </button>
                </div>
                
                <div id="products-list">
                    <div class="text-center py-8">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-2">در حال بارگذاری محصولات...</p>
                    </div>
                </div>
            </div>
            
            <!-- Product Form Modal -->
            <div id="product-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden">
                <div class="flex items-center justify-center min-h-screen p-4">
                    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
                        <div id="product-form-content">
                            <!-- Form content will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderCategories() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h2>
                    <button onclick="admin.showCategoryForm()" class="btn-primary">
                        <i class="fas fa-plus ml-2"></i>
                        افزودن دسته‌بندی جدید
                    </button>
                </div>
                
                <div id="categories-list">
                    <div class="text-center py-8">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-2">در حال بارگذاری دسته‌بندی‌ها...</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderOrders() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-bold mb-6">مدیریت سفارشات</h2>
                
                <div id="orders-list">
                    <div class="text-center py-8">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-2">در حال بارگذاری سفارشات...</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderBlog() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">مدیریت بلاگ</h2>
                    <button onclick="admin.showBlogForm()" class="btn-primary">
                        <i class="fas fa-plus ml-2"></i>
                        افزودن مقاله جدید
                    </button>
                </div>
                
                <div id="blog-list">
                    <div class="text-center py-8">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-2">در حال بارگذاری مقالات...</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderUsers() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-bold mb-6">مدیریت کاربران</h2>
                
                <div id="users-list">
                    <div class="text-center py-8">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-2">در حال بارگذاری کاربران...</p>
                    </div>
                </div>
            </div>
        `;
    }

    showProductForm() {
        document.getElementById('product-modal').classList.remove('hidden');
        document.getElementById('product-form-content').innerHTML = `
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold">افزودن محصول جدید</h3>
                    <button onclick="admin.closeProductModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form onsubmit="admin.submitProduct(event)" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="form-label">نام محصول (انگلیسی)</label>
                            <input type="text" name="name" required class="form-input">
                        </div>
                        <div>
                            <label class="form-label">نام محصول (فارسی)</label>
                            <input type="text" name="name_persian" required class="form-input">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="form-label">قیمت (تومان)</label>
                            <input type="number" name="price" required class="form-input">
                        </div>
                        <div>
                            <label class="form-label">موجودی</label>
                            <input type="number" name="stock_quantity" required class="form-input">
                        </div>
                    </div>
                    
                    <div>
                        <label class="form-label">دسته‌بندی</label>
                        <select name="category_id" required class="form-input" id="category-select">
                            <option value="">در حال بارگذاری...</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="form-label">توضیحات (انگلیسی)</label>
                        <textarea name="description" rows="3" class="form-input"></textarea>
                    </div>
                    
                    <div>
                        <label class="form-label">توضیحات (فارسی)</label>
                        <textarea name="description_persian" rows="3" class="form-input"></textarea>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="form-label">برند</label>
                            <input type="text" name="brand" class="form-input">
                        </div>
                        <div>
                            <label class="form-label">وزن</label>
                            <input type="text" name="weight" placeholder="مثل: 500g" class="form-input">
                        </div>
                    </div>
                    
                    <div>
                        <label class="form-label">آدرس تصویر</label>
                        <input type="url" name="image_url" class="form-input">
                    </div>
                    
                    <div class="flex justify-end space-x-reverse space-x-4 pt-4">
                        <button type="button" onclick="admin.closeProductModal()" class="btn-outline">
                            انصراف
                        </button>
                        <button type="submit" class="btn-primary">
                            ذخیره محصول
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        // Load categories for select
        this.loadCategoriesForSelect();
    }

    async loadCategoriesForSelect() {
        try {
            const response = await window.api.getCategories();
            const select = document.getElementById('category-select');
            
            select.innerHTML = '<option value="">انتخاب دسته‌بندی</option>';
            response.categories.forEach(category => {
                select.innerHTML += `<option value="${category.id}">${category.name_persian}</option>`;
            });
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    closeProductModal() {
        document.getElementById('product-modal').classList.add('hidden');
    }

    async submitProduct(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const productData = Object.fromEntries(formData.entries());
        
        try {
            await window.api.createProduct(productData);
            this.closeProductModal();
            this.showToast('محصول با موفقیت ایجاد شد', 'success');
            // Refresh products list
            this.showSection('products');
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    showCategoryForm() {
        // Similar implementation for category form
        this.showToast('فرم دسته‌بندی در نسخه بعدی اضافه خواهد شد', 'info');
    }

    showBlogForm() {
        // Similar implementation for blog form
        this.showToast('فرم مقاله در نسخه بعدی اضافه خواهد شد', 'info');
    }

    getOrderStatusText(status) {
        const statusTexts = {
            'pending': 'در انتظار تایید',
            'confirmed': 'تایید شده',
            'shipped': 'ارسال شده',
            'delivered': 'تحویل داده شده',
            'cancelled': 'لغو شده'
        };
        return statusTexts[status] || status;
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

// Global admin instance
window.admin = new Admin();
