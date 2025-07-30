// ProductCard component for displaying products
class ProductCard {
    static render(product) {
        const discountPercent = product.original_price ? 
            Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;

        return `
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div class="relative">
                    <img 
                        src="${product.image_url || '/static/images/product-placeholder.svg'}" 
                        alt="${product.name_persian}"
                        class="w-full h-48 object-cover"
                        onerror="this.src='/static/images/product-placeholder.svg'"
                    >
                    ${discountPercent > 0 ? `
                        <div class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                            ${discountPercent}%
                        </div>
                    ` : ''}
                    ${product.stock_quantity === 0 ? `
                        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span class="text-white font-bold">ناموجود</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2 text-gray-800">${product.name_persian}</h3>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description_persian || product.description || ''}</p>
                    
                    <div class="flex items-center justify-between mb-3">
                        <div class="text-sm text-gray-500">
                            <i class="fas fa-tag ml-1"></i>
                            ${product.brand || 'متنوع'}
                        </div>
                        ${product.weight ? `
                            <div class="text-sm text-gray-500">
                                <i class="fas fa-weight-hanging ml-1"></i>
                                ${product.weight}
                            </div>
                        ` : ''}
                    </div>

                    <div class="flex items-center justify-between mb-4">
                        <div>
                            ${product.original_price && product.original_price > product.price ? `
                                <span class="text-sm text-gray-500 line-through">${this.formatPrice(product.original_price)}</span>
                                <div class="text-lg font-bold text-primary">${this.formatPrice(product.price)}</div>
                            ` : `
                                <div class="text-lg font-bold text-primary">${this.formatPrice(product.price)}</div>
                            `}
                        </div>
                        
                        ${product.stock_quantity > 0 ? `
                            <div class="text-sm text-green-600">
                                <i class="fas fa-check-circle ml-1"></i>
                                موجود
                            </div>
                        ` : `
                            <div class="text-sm text-red-600">
                                <i class="fas fa-times-circle ml-1"></i>
                                ناموجود
                            </div>
                        `}
                    </div>

                    <div class="flex gap-2">
                        <button 
                            onclick="app.showProductDetail(${product.id})" 
                            class="flex-1 btn-outline text-sm py-2"
                        >
                            جزئیات
                        </button>
                        ${product.stock_quantity > 0 ? `
                            <button 
                                onclick="window.cart.addItem(${product.id}, '${product.name_persian}', ${product.price}, '${product.image_url || ''}')" 
                                class="flex-1 btn-primary text-sm py-2"
                            >
                                <i class="fas fa-cart-plus ml-1"></i>
                                افزودن
                            </button>
                        ` : `
                            <button disabled class="flex-1 bg-gray-300 text-gray-500 px-4 py-2 rounded text-sm cursor-not-allowed">
                                ناموجود
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    static renderDetailed(product) {
        if (!product) {
            return `
                <div class="container mx-auto px-4 py-8">
                    <div class="text-center py-12">
                        <i class="fas fa-exclamation-triangle text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500">محصول یافت نشد</p>
                        <button onclick="app.showProducts()" class="btn-primary mt-4">بازگشت به محصولات</button>
                    </div>
                </div>
            `;
        }

        const discountPercent = product.original_price ? 
            Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;

        return `
            <div class="container mx-auto px-4 py-8">
                <!-- Breadcrumb -->
                <nav class="text-sm text-gray-600 mb-6">
                    <a href="#" onclick="app.showHome()" class="hover:text-primary">خانه</a>
                    <span class="mx-2">/</span>
                    <a href="#" onclick="app.showProducts()" class="hover:text-primary">محصولات</a>
                    <span class="mx-2">/</span>
                    <span class="text-gray-800">${product.name_persian}</span>
                </nav>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <!-- Product Image -->
                    <div class="relative">
                        <img 
                            src="${product.image_url || '/static/images/product-placeholder.svg'}" 
                            alt="${product.name_persian}"
                            class="w-full rounded-lg shadow-lg"
                            onerror="this.src='/static/images/product-placeholder.svg'"
                        >
                        ${discountPercent > 0 ? `
                            <div class="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-full font-bold">
                                ${discountPercent}% تخفیف
                            </div>
                        ` : ''}
                    </div>

                    <!-- Product Info -->
                    <div>
                        <div class="mb-4">
                            <h1 class="text-3xl font-bold text-gray-800 mb-2">${product.name_persian}</h1>
                            <p class="text-lg text-gray-600">${product.name}</p>
                        </div>

                        <!-- Brand and Category -->
                        <div class="flex items-center gap-4 mb-6">
                            ${product.brand ? `
                                <div class="flex items-center text-gray-600">
                                    <i class="fas fa-tag ml-2"></i>
                                    <span>برند: ${product.brand}</span>
                                </div>
                            ` : ''}
                            ${product.weight ? `
                                <div class="flex items-center text-gray-600">
                                    <i class="fas fa-weight-hanging ml-2"></i>
                                    <span>وزن: ${product.weight}</span>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Price -->
                        <div class="mb-6">
                            ${product.original_price && product.original_price > product.price ? `
                                <div class="text-xl text-gray-500 line-through mb-1">${this.formatPrice(product.original_price)}</div>
                                <div class="text-3xl font-bold text-primary">${this.formatPrice(product.price)}</div>
                                <div class="text-green-600 font-medium">شما ${this.formatPrice(product.original_price - product.price)} صرفه‌جویی می‌کنید</div>
                            ` : `
                                <div class="text-3xl font-bold text-primary">${this.formatPrice(product.price)}</div>
                            `}
                        </div>

                        <!-- Stock Status -->
                        <div class="mb-6">
                            ${product.stock_quantity > 0 ? `
                                <div class="flex items-center text-green-600 mb-2">
                                    <i class="fas fa-check-circle ml-2"></i>
                                    <span class="font-medium">موجود در انبار</span>
                                </div>
                                <div class="text-sm text-gray-600">${product.stock_quantity} عدد در انبار</div>
                            ` : `
                                <div class="flex items-center text-red-600">
                                    <i class="fas fa-times-circle ml-2"></i>
                                    <span class="font-medium">ناموجود</span>
                                </div>
                            `}
                        </div>

                        <!-- Add to Cart -->
                        <div class="mb-8">
                            ${product.stock_quantity > 0 ? `
                                <div class="flex items-center gap-4 mb-4">
                                    <label class="text-gray-700">تعداد:</label>
                                    <div class="flex items-center border rounded-lg">
                                        <button onclick="this.nextElementSibling.stepDown()" class="px-3 py-2 hover:bg-gray-100">-</button>
                                        <input type="number" id="quantity" value="1" min="1" max="${product.stock_quantity}" class="w-16 text-center border-0 focus:ring-0">
                                        <button onclick="this.previousElementSibling.stepUp()" class="px-3 py-2 hover:bg-gray-100">+</button>
                                    </div>
                                </div>
                                <button 
                                    onclick="window.cart.addItem(${product.id}, '${product.name_persian}', ${product.price}, '${product.image_url || ''}', parseInt(document.getElementById('quantity').value))" 
                                    class="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                                >
                                    <i class="fas fa-cart-plus ml-2"></i>
                                    افزودن به سبد خرید
                                </button>
                            ` : `
                                <button disabled class="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium cursor-not-allowed">
                                    ناموجود
                                </button>
                            `}
                        </div>

                        <!-- Product Details -->
                        <div class="space-y-6">
                            ${product.description_persian ? `
                                <div>
                                    <h3 class="text-xl font-bold mb-3">توضیحات محصول</h3>
                                    <p class="text-gray-700 leading-relaxed">${product.description_persian}</p>
                                </div>
                            ` : ''}

                            ${product.serving_size || product.servings_per_container ? `
                                <div>
                                    <h3 class="text-xl font-bold mb-3">اطلاعات تغذیه‌ای</h3>
                                    <div class="bg-gray-50 p-4 rounded-lg">
                                        ${product.serving_size ? `<div class="mb-2"><strong>اندازه هر وعده:</strong> ${product.serving_size}</div>` : ''}
                                        ${product.servings_per_container ? `<div class="mb-2"><strong>تعداد وعده در بسته:</strong> ${product.servings_per_container}</div>` : ''}
                                    </div>
                                </div>
                            ` : ''}

                            ${product.ingredients ? `
                                <div>
                                    <h3 class="text-xl font-bold mb-3">ترکیبات</h3>
                                    <p class="text-gray-700">${product.ingredients}</p>
                                </div>
                            ` : ''}

                            ${product.usage_instructions ? `
                                <div>
                                    <h3 class="text-xl font-bold mb-3">نحوه مصرف</h3>
                                    <p class="text-gray-700">${product.usage_instructions}</p>
                                </div>
                            ` : ''}

                            ${product.warnings ? `
                                <div>
                                    <h3 class="text-xl font-bold mb-3">هشدارها</h3>
                                    <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                        <p class="text-yellow-800">${product.warnings}</p>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static formatPrice(price) {
        return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
    }
}

// Make it available globally
window.ProductCard = ProductCard;