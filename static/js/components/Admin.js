// Admin component for Zoorkhan store
class Admin {
    constructor() {
        this.currentTab = 'products';
    }

    render() {
        if (!window.auth || !window.auth.isAdmin()) {
            return `
                <div class="container mx-auto px-4 py-8">
                    <div class="text-center py-12">
                        <i class="fas fa-lock text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500">دسترسی محدود - فقط ادمین</p>
                        <button onclick="app.showHome()" class="btn-primary mt-4">بازگشت به خانه</button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="container mx-auto px-4 py-8">
                <h1 class="text-3xl font-bold mb-8">پنل مدیریت</h1>
                
                <!-- Admin Tabs -->
                <div class="flex space-x-reverse space-x-4 mb-8 border-b">
                    <button onclick="window.admin.switchTab('products')" class="px-4 py-2 ${this.currentTab === 'products' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}">
                        مدیریت محصولات
                    </button>
                    <button onclick="window.admin.switchTab('categories')" class="px-4 py-2 ${this.currentTab === 'categories' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}">
                        دسته‌بندی‌ها
                    </button>
                    <button onclick="window.admin.switchTab('orders')" class="px-4 py-2 ${this.currentTab === 'orders' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}">
                        سفارش‌ها
                    </button>
                    <button onclick="window.admin.switchTab('blog')" class="px-4 py-2 ${this.currentTab === 'blog' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}">
                        مقالات
                    </button>
                </div>

                <div id="admin-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;
    }

    renderTabContent() {
        switch (this.currentTab) {
            case 'products':
                return this.renderProductsTab();
            case 'categories':
                return this.renderCategoriesTab();
            case 'orders':
                return this.renderOrdersTab();
            case 'blog':
                return this.renderBlogTab();
            default:
                return '<div>برگه یافت نشد</div>';
        }
    }

    renderProductsTab() {
        return `
            <div>
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">مدیریت محصولات</h2>
                    <button onclick="window.admin.showAddProductForm()" class="btn-primary">
                        <i class="fas fa-plus ml-2"></i>
                        افزودن محصول
                    </button>
                </div>
                <div id="admin-products-list">
                    <div class="text-center py-8">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-2">در حال بارگذاری...</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderCategoriesTab() {
        return `
            <div>
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h2>
                    <button onclick="window.admin.showAddCategoryForm()" class="btn-primary">
                        <i class="fas fa-plus ml-2"></i>
                        افزودن دسته‌بندی
                    </button>
                </div>
                <div id="admin-categories-list">
                    <div class="text-center py-8">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-2">در حال بارگذاری...</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderOrdersTab() {
        return `
            <div>
                <h2 class="text-2xl font-bold mb-6">مدیریت سفارش‌ها</h2>
                <div id="admin-orders-list">
                    <div class="text-center py-8">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-2">در حال بارگذاری...</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderBlogTab() {
        return `
            <div>
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">مدیریت مقالات</h2>
                    <button onclick="window.admin.showAddBlogForm()" class="btn-primary">
                        <i class="fas fa-plus ml-2"></i>
                        افزودن مقاله
                    </button>
                </div>
                <div id="admin-blog-list">
                    <div class="text-center py-8">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-2">در حال بارگذاری...</p>
                    </div>
                </div>
            </div>
        `;
    }

    switchTab(tab) {
        this.currentTab = tab;
        const content = document.getElementById('admin-content');
        if (content) {
            content.innerHTML = this.renderTabContent();
            this.loadTabData();
        }
    }

    async loadTabData() {
        switch (this.currentTab) {
            case 'products':
                await this.loadProducts();
                break;
            case 'categories':
                await this.loadCategories();
                break;
            case 'orders':
                await this.loadOrders();
                break;
            case 'blog':
                await this.loadBlogPosts();
                break;
        }
    }

    async loadProducts() {
        try {
            const response = await window.api.getProducts();
            const container = document.getElementById('admin-products-list');
            if (container && response.products) {
                if (response.products.length === 0) {
                    container.innerHTML = '<p class="text-center text-gray-500 py-8">محصولی یافت نشد</p>';
                    return;
                }

                container.innerHTML = `
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white rounded-lg shadow">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تصویر</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">قیمت</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">موجودی</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${response.products.map(product => `
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <img src="${product.image_url || '/static/images/product-placeholder.jpg'}" 
                                                 alt="${product.name_persian}" class="h-12 w-12 object-cover rounded">
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="font-medium">${product.name_persian}</div>
                                            <div class="text-sm text-gray-500">${product.name}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">${ProductCard.formatPrice(product.price)}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}">${product.stock_quantity}</span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                                            <button onclick="window.admin.editProduct(${product.id})" class="text-blue-600 hover:text-blue-900 ml-3">ویرایش</button>
                                            <button onclick="window.admin.deleteProduct(${product.id})" class="text-red-600 hover:text-red-900">حذف</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    async loadCategories() {
        // Similar implementation for categories
        const container = document.getElementById('admin-categories-list');
        if (container) {
            container.innerHTML = '<p class="text-center text-gray-500 py-8">قابلیت مدیریت دسته‌بندی در حال توسعه</p>';
        }
    }

    async loadOrders() {
        // Similar implementation for orders
        const container = document.getElementById('admin-orders-list');
        if (container) {
            container.innerHTML = '<p class="text-center text-gray-500 py-8">قابلیت مدیریت سفارش‌ها در حال توسعه</p>';
        }
    }

    async loadBlogPosts() {
        // Similar implementation for blog posts
        const container = document.getElementById('admin-blog-list');
        if (container) {
            container.innerHTML = '<p class="text-center text-gray-500 py-8">قابلیت مدیریت مقالات در حال توسعه</p>';
        }
    }

    showAddProductForm() {
        // Show add product modal/form
        if (window.app) {
            window.app.showToast('قابلیت افزودن محصول در حال توسعه', 'info');
        }
    }

    showAddCategoryForm() {
        if (window.app) {
            window.app.showToast('قابلیت افزودن دسته‌بندی در حال توسعه', 'info');
        }
    }

    showAddBlogForm() {
        if (window.app) {
            window.app.showToast('قابلیت افزودن مقاله در حال توسعه', 'info');
        }
    }

    editProduct(id) {
        if (window.app) {
            window.app.showToast('قابلیت ویرایش محصول در حال توسعه', 'info');
        }
    }

    deleteProduct(id) {
        if (confirm('آیا مطمئن هستید؟')) {
            if (window.app) {
                window.app.showToast('قابلیت حذف محصول در حال توسعه', 'info');
            }
        }
    }
}

// Initialize admin
window.admin = new Admin();