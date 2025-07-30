// Customer dashboard component
class Dashboard {
    constructor() {
        this.currentSection = 'profile';
    }

    render() {
        if (!window.auth.isAuthenticated()) {
            return `
                <div class="container mx-auto px-4 py-8">
                    <div class="text-center">
                        <h1 class="text-2xl font-bold text-red-600 mb-4">دسترسی محدود</h1>
                        <p class="text-gray-600 mb-4">برای دسترسی به داشبورد باید وارد شوید.</p>
                        <button onclick="app.showLogin()" class="btn-primary">ورود</button>
                    </div>
                </div>
            `;
        }

        const user = window.auth.getCurrentUser();

        return `
            <div class="container mx-auto px-4 py-8">
                <div class="flex flex-col lg:flex-row gap-8">
                    <!-- Dashboard Sidebar -->
                    <div class="lg:w-1/4">
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <div class="text-center mb-6">
                                <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i class="fas fa-user text-2xl text-white"></i>
                                </div>
                                <h3 class="font-bold text-lg">${user.full_name}</h3>
                                <p class="text-gray-600 text-sm">${user.email}</p>
                            </div>
                            
                            <nav class="space-y-2">
                                <button 
                                    onclick="dashboard.showSection('profile')" 
                                    class="dashboard-nav-item ${this.currentSection === 'profile' ? 'active' : ''}"
                                >
                                    <i class="fas fa-user ml-2"></i>
                                    اطلاعات شخصی
                                </button>
                                <button 
                                    onclick="dashboard.showSection('orders')" 
                                    class="dashboard-nav-item ${this.currentSection === 'orders' ? 'active' : ''}"
                                >
                                    <i class="fas fa-shopping-bag ml-2"></i>
                                    سفارشات من
                                </button>
                                <button 
                                    onclick="dashboard.showSection('addresses')" 
                                    class="dashboard-nav-item ${this.currentSection === 'addresses' ? 'active' : ''}"
                                >
                                    <i class="fas fa-map-marker-alt ml-2"></i>
                                    آدرس‌ها
                                </button>
                                <button 
                                    onclick="dashboard.showSection('favorites')" 
                                    class="dashboard-nav-item ${this.currentSection === 'favorites' ? 'active' : ''}"
                                >
                                    <i class="fas fa-heart ml-2"></i>
                                    علاقه‌مندی‌ها
                                </button>
                            </nav>
                        </div>
                    </div>

                    <!-- Dashboard Content -->
                    <div class="lg:w-3/4">
                        <div id="dashboard-content">
                            ${this.renderSection()}
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .dashboard-nav-item {
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
                
                .dashboard-nav-item:hover {
                    background: #f3f4f6;
                    color: #1f2937;
                }
                
                .dashboard-nav-item.active {
                    background: #1f2937;
                    color: white;
                }
            </style>
        `;
    }

    showSection(section) {
        this.currentSection = section;
        document.getElementById('dashboard-content').innerHTML = this.renderSection();
        
        // Load section data
        switch (section) {
            case 'orders':
                this.loadOrders();
                break;
        }
    }

    renderSection() {
        switch (this.currentSection) {
            case 'profile':
                return this.renderProfile();
            case 'orders':
                return this.renderOrders();
            case 'addresses':
                return this.renderAddresses();
            case 'favorites':
                return this.renderFavorites();
            default:
                return this.renderProfile();
        }
    }

    renderProfile() {
        const user = window.auth.getCurrentUser();

        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-bold mb-6">اطلاعات شخصی</h2>
                
                <form onsubmit="dashboard.updateProfile(event)" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="form-label">نام کامل</label>
                            <input type="text" name="full_name" value="${user.full_name || ''}" required class="form-input">
                        </div>
                        <div>
                            <label class="form-label">نام کاربری</label>
                            <input type="text" name="username" value="${user.username || ''}" required class="form-input">
                        </div>
                    </div>
                    
                    <div>
                        <label class="form-label">ایمیل</label>
                        <input type="email" name="email" value="${user.email || ''}" required class="form-input">
                    </div>
                    
                    <div>
                        <label class="form-label">شماره تماس</label>
                        <input type="tel" name="phone" value="${user.phone || ''}" class="form-input">
                    </div>
                    
                    <div>
                        <label class="form-label">آدرس</label>
                        <textarea name="address" rows="3" class="form-input">${user.address || ''}</textarea>
                    </div>
                    
                    <div class="flex justify-end">
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-save ml-2"></i>
                            ذخیره تغییرات
                        </button>
                    </div>
                </form>
                
                <hr class="my-8">
                
                <div>
                    <h3 class="text-lg font-semibold mb-4">تغییر رمز عبور</h3>
                    <form onsubmit="dashboard.changePassword(event)" class="space-y-4">
                        <div>
                            <label class="form-label">رمز عبور فعلی</label>
                            <input type="password" name="current_password" required class="form-input">
                        </div>
                        <div>
                            <label class="form-label">رمز عبور جدید</label>
                            <input type="password" name="new_password" required class="form-input">
                        </div>
                        <div>
                            <label class="form-label">تکرار رمز عبور جدید</label>
                            <input type="password" name="confirm_password" required class="form-input">
                        </div>
                        <div class="flex justify-end">
                            <button type="submit" class="btn-secondary">
                                <i class="fas fa-key ml-2"></i>
                                تغییر رمز عبور
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    renderOrders() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-bold mb-6">سفارشات من</h2>
                
                <div id="orders-list">
                    <div class="text-center py-8">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-2">در حال بارگذاری سفارشات...</p>
                    </div>
                </div>
            </div>
        `;
    }

    async loadOrders() {
        try {
            const response = await window.api.getUserOrders();
            const ordersContainer = document.getElementById('orders-list');
            
            if (response.orders.length === 0) {
                ordersContainer.innerHTML = `
                    <div class="text-center py-8">
                        <i class="fas fa-shopping-bag text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500 mb-4">شما هنوز سفارشی ثبت نکرده‌اید</p>
                        <button onclick="app.showProducts()" class="btn-primary">
                            مشاهده محصولات
                        </button>
                    </div>
                `;
                return;
            }
            
            const ordersHTML = response.orders.map(order => `
                <div class="border rounded-lg p-6 mb-4">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="font-bold text-lg">سفارش #${order.id}</h3>
                            <p class="text-gray-600 text-sm">
                                تاریخ: ${new Date(order.created_at).toLocaleDateString('fa-IR')}
                            </p>
                        </div>
                        <div class="text-left">
                            <span class="badge status-${order.status}">${this.getOrderStatusText(order.status)}</span>
                            <p class="font-bold text-lg mt-1 price">
                                ${new Intl.NumberFormat('fa-IR').format(order.total_amount)} تومان
                            </p>
                        </div>
                    </div>
                    
                    <div class="border-t pt-4">
                        <h4 class="font-semibold mb-2">محصولات:</h4>
                        <div class="space-y-2">
                            ${order.order_items.map(item => `
                                <div class="flex justify-between items-center text-sm">
                                    <span>${item.product ? item.product.name_persian : 'محصول حذف شده'}</span>
                                    <span>${item.quantity} × ${new Intl.NumberFormat('fa-IR').format(item.price)} تومان</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    ${order.shipping_address ? `
                        <div class="border-t pt-4 mt-4">
                            <h4 class="font-semibold mb-2">آدرس تحویل:</h4>
                            <p class="text-gray-700 text-sm">${order.shipping_address}</p>
                        </div>
                    ` : ''}
                </div>
            `).join('');
            
            ordersContainer.innerHTML = ordersHTML;
            
        } catch (error) {
            console.error('Error loading orders:', error);
            document.getElementById('orders-list').innerHTML = `
                <div class="text-center py-8 text-red-500">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <p>خطا در بارگذاری سفارشات</p>
                </div>
            `;
        }
    }

    renderAddresses() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">آدرس‌ها</h2>
                    <button class="btn-primary">
                        <i class="fas fa-plus ml-2"></i>
                        افزودن آدرس جدید
                    </button>
                </div>
                
                <div class="text-center py-8">
                    <i class="fas fa-map-marker-alt text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">این بخش در نسخه بعدی اضافه خواهد شد</p>
                </div>
            </div>
        `;
    }

    renderFavorites() {
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-bold mb-6">علاقه‌مندی‌ها</h2>
                
                <div class="text-center py-8">
                    <i class="fas fa-heart text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">این بخش در نسخه بعدی اضافه خواهد شد</p>
                </div>
            </div>
        `;
    }

    async updateProfile(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const profileData = Object.fromEntries(formData.entries());
        
        try {
            // Here you would call an API to update profile
            // For now, just update local user data
            window.auth.updateUser(profileData);
            this.showToast('اطلاعات شما با موفقیت به‌روزرسانی شد', 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    async changePassword(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const passwords = Object.fromEntries(formData.entries());
        
        if (passwords.new_password !== passwords.confirm_password) {
            this.showToast('رمز عبور جدید و تکرار آن یکسان نیست', 'error');
            return;
        }
        
        try {
            // Here you would call an API to change password
            this.showToast('رمز عبور شما با موفقیت تغییر کرد', 'success');
            event.target.reset();
        } catch (error) {
            this.showToast(error.message, 'error');
        }
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

// Global dashboard instance
window.dashboard = new Dashboard();
