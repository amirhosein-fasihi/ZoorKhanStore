// Product card component
class ProductCard {
    static render(product) {
        const isOutOfStock = product.stock_quantity <= 0;
        const formattedPrice = new Intl.NumberFormat('fa-IR').format(product.price);
        
        return `
            <div class="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                <div class="relative">
                    <img 
                        src="${product.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                        alt="${product.name_persian}"
                        class="w-full h-48 object-cover"
                        onerror="this.src='https://via.placeholder.com/300x200?text=تصویر+موجود+نیست'"
                    >
                    
                    ${isOutOfStock ? `
                        <div class="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                            <span class="bg-red-500 text-white px-3 py-1 rounded-lg font-medium">ناموجود</span>
                        </div>
                    ` : ''}
                    
                    ${product.category ? `
                        <span class="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs">
                            ${product.category.name_persian}
                        </span>
                    ` : ''}
                </div>
                
                <div class="p-4">
                    <h3 class="font-semibold text-lg mb-2 line-clamp-2">${product.name_persian}</h3>
                    
                    ${product.brand ? `
                        <p class="text-gray-600 text-sm mb-2">برند: ${product.brand}</p>
                    ` : ''}
                    
                    ${product.description_persian ? `
                        <p class="text-gray-700 text-sm mb-3 line-clamp-3">${product.description_persian}</p>
                    ` : ''}
                    
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-2xl font-bold text-primary price">${formattedPrice} تومان</span>
                        ${product.weight ? `
                            <span class="text-gray-500 text-sm">${product.weight}</span>
                        ` : ''}
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <button 
                            onclick="app.showProductDetail(${product.id})" 
                            class="text-primary hover:text-gray-800 transition-colors"
                        >
                            مشاهده جزئیات
                            <i class="fas fa-arrow-left mr-1"></i>
                        </button>
                        
                        ${!isOutOfStock ? `
                            <button 
                                onclick="window.cart.addItem(${product.id})" 
                                class="btn-secondary text-sm px-4 py-2"
                            >
                                <i class="fas fa-cart-plus ml-1"></i>
                                افزودن به سبد
                            </button>
                        ` : `
                            <button 
                                disabled 
                                class="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm cursor-not-allowed"
                            >
                                ناموجود
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    static renderDetailed(product) {
        const isOutOfStock = product.stock_quantity <= 0;
        const formattedPrice = new Intl.NumberFormat('fa-IR').format(product.price);
        
        return `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="md:flex">
                    <div class="md:w-1/2">
                        <img 
                            src="${product.image_url || 'https://via.placeholder.com/500x400?text=No+Image'}" 
                            alt="${product.name_persian}"
                            class="w-full h-96 object-cover"
                            onerror="this.src='https://via.placeholder.com/500x400?text=تصویر+موجود+نیست'"
                        >
                    </div>
                    
                    <div class="md:w-1/2 p-8">
                        <div class="mb-4">
                            ${product.category ? `
                                <span class="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm mb-2">
                                    ${product.category.name_persian}
                                </span>
                            ` : ''}
                            
                            <h1 class="text-3xl font-bold text-gray-900 mb-2">${product.name_persian}</h1>
                            
                            ${product.brand ? `
                                <p class="text-gray-600 mb-2">برند: <span class="font-medium">${product.brand}</span></p>
                            ` : ''}
                        </div>
                        
                        <div class="mb-6">
                            <span class="text-3xl font-bold text-primary price">${formattedPrice} تومان</span>
                            ${product.weight ? `
                                <span class="text-gray-500 mr-4">وزن: ${product.weight}</span>
                            ` : ''}
                        </div>
                        
                        ${product.description_persian ? `
                            <div class="mb-6">
                                <h3 class="font-semibold text-lg mb-2">توضیحات</h3>
                                <p class="text-gray-700 leading-relaxed">${product.description_persian}</p>
                            </div>
                        ` : ''}
                        
                        ${product.serving_size || product.servings_per_container ? `
                            <div class="mb-6">
                                <h3 class="font-semibold text-lg mb-2">اطلاعات تغذیه‌ای</h3>
                                <div class="grid grid-cols-2 gap-4 text-sm">
                                    ${product.serving_size ? `
                                        <div>
                                            <span class="text-gray-600">اندازه وعده:</span>
                                            <span class="font-medium">${product.serving_size}</span>
                                        </div>
                                    ` : ''}
                                    ${product.servings_per_container ? `
                                        <div>
                                            <span class="text-gray-600">تعداد وعده:</span>
                                            <span class="font-medium">${product.servings_per_container}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${product.stock_quantity > 0 ? `
                            <div class="mb-6">
                                <p class="text-green-600 text-sm">
                                    <i class="fas fa-check-circle ml-1"></i>
                                    موجود در انبار (${product.stock_quantity} عدد)
                                </p>
                            </div>
                        ` : `
                            <div class="mb-6">
                                <p class="text-red-600 text-sm">
                                    <i class="fas fa-times-circle ml-1"></i>
                                    ناموجود
                                </p>
                            </div>
                        `}
                        
                        <div class="flex items-center space-x-reverse space-x-4">
                            ${!isOutOfStock ? `
                                <div class="flex items-center border border-gray-300 rounded-lg">
                                    <button 
                                        onclick="this.nextElementSibling.value = Math.max(1, parseInt(this.nextElementSibling.value) - 1)" 
                                        class="px-3 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input 
                                        type="number" 
                                        value="1" 
                                        min="1" 
                                        max="${product.stock_quantity}"
                                        id="quantity-input"
                                        class="w-16 text-center border-0 focus:ring-0"
                                    >
                                    <button 
                                        onclick="this.previousElementSibling.value = Math.min(${product.stock_quantity}, parseInt(this.previousElementSibling.value) + 1)" 
                                        class="px-3 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                                
                                <button 
                                    onclick="window.cart.addItem(${product.id}, parseInt(document.getElementById('quantity-input').value))" 
                                    class="btn-secondary flex-1"
                                >
                                    <i class="fas fa-cart-plus ml-2"></i>
                                    افزودن به سبد خرید
                                </button>
                            ` : `
                                <button 
                                    disabled 
                                    class="w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-medium cursor-not-allowed"
                                >
                                    ناموجود
                                </button>
                            `}
                        </div>
                        
                        ${product.usage_instructions ? `
                            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h4 class="font-semibold text-blue-900 mb-2">نحوه مصرف</h4>
                                <p class="text-blue-800 text-sm">${product.usage_instructions}</p>
                            </div>
                        ` : ''}
                        
                        ${product.warnings ? `
                            <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
                                <h4 class="font-semibold text-yellow-900 mb-2">هشدارها</h4>
                                <p class="text-yellow-800 text-sm">${product.warnings}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                ${product.ingredients ? `
                    <div class="border-t p-8">
                        <h3 class="font-semibold text-lg mb-4">ترکیبات</h3>
                        <p class="text-gray-700 leading-relaxed">${product.ingredients}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }
}
