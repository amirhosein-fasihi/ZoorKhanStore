// Cart component for Zoorkhan store
class Cart {
    constructor() {
        this.items = [];
        this.isOpen = false;
        this.init();
    }

    init() {
        // Load cart from localStorage
        this.loadFromStorage();
        
        // Setup cart overlay click handler
        const overlay = document.getElementById('cart-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        // Setup ESC key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        this.updateCartCount();
    }

    addItem(productId, name, price, imageUrl = '', quantity = 1) {
        const existingItem = this.items.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                productId,
                name,
                price,
                imageUrl,
                quantity
            });
        }

        this.saveToStorage();
        this.updateCartCount();
        this.render();
        
        // Show success message
        if (window.app) {
            window.app.showToast(`${name} به سبد خرید اضافه شد`, 'success');
        }

        // Auto-open cart for better UX
        this.open();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
        this.saveToStorage();
        this.updateCartCount();
        this.render();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.productId === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
                this.updateCartCount();
                this.render();
            }
        }
    }

    clear() {
        this.items = [];
        this.saveToStorage();
        this.updateCartCount();
        this.render();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('translate-x-full');
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
        
        this.render();
    }

    close() {
        this.isOpen = false;
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.add('translate-x-full');
            overlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    render() {
        const container = document.getElementById('cart-content');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-600 mb-2">سبد خرید خالی است</h3>
                    <p class="text-gray-500 mb-4">هنوز محصولی به سبد خرید اضافه نکرده‌اید</p>
                    <button onclick="window.cart.close(); app.showProducts()" class="btn-primary">
                        مشاهده محصولات
                    </button>
                </div>
            `;
            return;
        }

        const total = this.getTotal();
        const itemCount = this.getItemCount();

        container.innerHTML = `
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold">سبد خرید</h2>
                <button onclick="window.cart.close()" class="p-2 hover:bg-gray-100 rounded-full">
                    <i class="fas fa-times text-gray-600"></i>
                </button>
            </div>

            <div class="space-y-4 mb-6 max-h-96 overflow-y-auto">
                ${this.items.map(item => `
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img 
                            src="${item.imageUrl || '/static/images/product-placeholder.jpg'}" 
                            alt="${item.name}"
                            class="w-16 h-16 object-cover rounded"
                            onerror="this.src='/static/images/product-placeholder.jpg'"
                        >
                        <div class="flex-1">
                            <h4 class="font-medium text-sm mb-1">${item.name}</h4>
                            <div class="text-primary font-bold text-sm">${this.formatPrice(item.price)}</div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button 
                                onclick="window.cart.updateQuantity(${item.productId}, ${item.quantity - 1})"
                                class="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-sm"
                            >
                                -
                            </button>
                            <span class="w-8 text-center text-sm">${item.quantity}</span>
                            <button 
                                onclick="window.cart.updateQuantity(${item.productId}, ${item.quantity + 1})"
                                class="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-sm"
                            >
                                +
                            </button>
                            <button 
                                onclick="window.cart.removeItem(${item.productId})"
                                class="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-full ml-2"
                            >
                                <i class="fas fa-trash text-xs"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="border-t pt-4 mb-6">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-gray-600">تعداد اقلام:</span>
                    <span class="font-medium">${itemCount} عدد</span>
                </div>
                <div class="flex justify-between items-center text-lg font-bold">
                    <span>مجموع:</span>
                    <span class="text-primary">${this.formatPrice(total)}</span>
                </div>
            </div>

            <div class="space-y-3">
                <button 
                    onclick="window.cart.close(); app.showCheckout()" 
                    class="w-full btn-primary py-3"
                    ${!window.auth || !window.auth.isAuthenticated() ? 'disabled' : ''}
                >
                    ${window.auth && window.auth.isAuthenticated() ? 'ادامه خرید' : 'ابتدا وارد شوید'}
                </button>
                ${this.items.length > 0 ? `
                    <button 
                        onclick="if(confirm('آیا مطمئن هستید؟')) window.cart.clear()" 
                        class="w-full btn-outline py-3"
                    >
                        پاک کردن سبد
                    </button>
                ` : ''}
            </div>
        `;
    }

    updateCartCount() {
        const count = this.getItemCount();
        if (window.header) {
            window.header.updateCartCount(count);
        }
    }

    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('cart');
            if (stored) {
                this.items = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            this.items = [];
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
    }

    // Get cart data for checkout
    getCartData() {
        return {
            items: this.items.map(item => ({
                product_id: item.productId,
                quantity: item.quantity
            })),
            total: this.getTotal()
        };
    }
}

// Initialize cart
window.cart = new Cart();