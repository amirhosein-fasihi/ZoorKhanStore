// Dashboard component for customer panel
class Dashboard {
    render() {
        if (!window.auth || !window.auth.isAuthenticated()) {
            return `
                <div class="container mx-auto px-4 py-8">
                    <div class="text-center py-12">
                        <i class="fas fa-sign-in-alt text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500">لطفا ابتدا وارد شوید</p>
                        <button onclick="app.showLogin()" class="btn-primary mt-4">ورود</button>
                    </div>
                </div>
            `;
        }

        const user = window.auth.getCurrentUser();
        
        return `
            <div class="container mx-auto px-4 py-8">
                <h1 class="text-3xl font-bold mb-8">پنل کاربری</h1>
                
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- User Info -->
                    <div class="lg:col-span-1">
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <div class="text-center mb-6">
                                <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i class="fas fa-user text-2xl text-white"></i>
                                </div>
                                <h2 class="text-xl font-bold">${user.full_name || user.username}</h2>
                                <p class="text-gray-600">${user.email}</p>
                            </div>
                            
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">نقش:</span>
                                    <span class="font-medium">${user.role === 'admin' ? 'مدیر' : 'مشتری'}</span>
                                </div>
                                ${user.phone ? `
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">تلفن:</span>
                                        <span class="font-medium">${user.phone}</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Orders and Activity -->
                    <div class="lg:col-span-2">
                        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h3 class="text-xl font-bold mb-4">سفارش‌های اخیر</h3>
                            <div id="user-orders" class="text-center py-8 text-gray-500">
                                قابلیت مشاهده سفارش‌ها در حال توسعه
                            </div>
                        </div>

                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h3 class="text-xl font-bold mb-4">تنظیمات حساب</h3>
                            <div class="space-y-4">
                                <button class="w-full text-right p-3 hover:bg-gray-50 rounded-lg border">
                                    <i class="fas fa-edit text-primary ml-3"></i>
                                    ویرایش اطلاعات شخصی
                                </button>
                                <button class="w-full text-right p-3 hover:bg-gray-50 rounded-lg border">
                                    <i class="fas fa-key text-primary ml-3"></i>
                                    تغییر رمز عبور
                                </button>
                                <button class="w-full text-right p-3 hover:bg-gray-50 rounded-lg border">
                                    <i class="fas fa-map-marker-alt text-primary ml-3"></i>
                                    مدیریت آدرس‌ها
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

window.dashboard = new Dashboard();