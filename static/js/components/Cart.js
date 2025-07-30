// Shopping cart component
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart_items') || '[]');
        this.isOpen = false;
        this.render();
        this.bindEvents();
    }

    addItem(productId, quantity = 1) {
        // Find product in items
        const existingItem = this.items.find(item => item.product_id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                product_id: productId,
                quantity: quantity
            });
        }
        
        this.saveToStorage();
        this.render();
        this.showToast('محصول به سبد خرید اضافه شد', 'success');
        
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.product_id !== productId);
        this.saveToStorage();
        this.render();
        this.showToast('محصول از سبد خرید حذف شد', 'info');
        
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.product_id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
                this.render();
                
                // Trigger cart update event
                window.dispatchEvent(new CustomEvent('cartUpdated'));
            }
        }
    }

    clear() {
        this.items = [];
        this.saveToStorage();
        this.render();
        
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    async getTotal() {
        let total = 0;
        for (const item of this.items) {
            try {
                const response = await window.api.getProduct(item.product_id);
                total += response.product.price * item.quantity;
            } catch (error) {
                console.error('Error fetching product price:', error);
            }
        }
        return total;
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        
        if (this.isOpen) {
            sidebar.classList.remove('translate-x-full');
            overlay.classList.remove('hidden');
            this.loadCartItems();
        } else {
            sidebar.classList.add('translate-x-full');
            overlay.classList.add('hidden');
        }
    }

    close() {
        this.isOpen = false;
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        
        sidebar.classList.add('translate-x-full');
        overlay.classList.add('hidden');
    }

    async loadCartItems() {
        const cartContent = document.getElementById('cart-content');
        
        if (this.items.length === 0) {
            cartContent.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">سبد خرید شما خالی است</p>
                    <button onclick="window.cart.close(); app.showProducts()" class="btn-primary mt-4">
                        مشاهده محصولات
                    </button>
                </div>
            `;
            return;
        }

        cartContent.innerHTML = `
            <div class="flex items-center justify-between border-b pb-4 mb-4">
                <h2 class="text-xl font-bold">سبد خرید</h2>
                <button onclick="window.cart.close()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div id="cart-items" class="space-y-4 mb-6">
                <div class="text-center py-4">
                    <div class="loading-spinner mx-auto"></div>
                    <p class="text-gray-500 mt-2">در حال بارگذاری...</p>
                </div>
            </div>
        `;

        try {
            let cartItemsHTML = '';
            let totalPrice = 0;

            for (const item of this.items) {
                const response = await window.api.getProduct(item.product_id);
                const product = response.product;
                const itemTotal = product.price * item.quantity;
                totalPrice += itemTotal;

                cartItemsHTML += `
                    <div class="cart-item flex items-center space-x-reverse space-x-4 p-4 border rounded-lg">
                        <img 
                            src="${product.image_url || 'https://via.placeholder.com/80x80'}" 
                            alt="${product.name_persian}"
                            class="w-16 h-16 object-cover rounded"
                        >
                        <div class="flex-1">
                            <h4 class="font-medium text-sm">${product.name_persian}</h4>
                            <p class="text-primary font-bold text-sm price">
                                ${new Intl.NumberFormat('fa-IR').format(product.price)} تومان
                            </p>
                        </div>
                        <div class="flex items-center space-x-reverse space-x-2">
                            <button 
                                onclick="window.cart.updateQuantity(${product.id}, ${item.quantity - 1})"
                                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                                <i class="fas fa-minus text-xs"></i>
                            </button>
                            <span class="w-8 text-center text-sm">${item.quantity}</span>
                            <button 
                                onclick="window.cart.updateQuantity(${product.id}, ${item.quantity + 1})"
                                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                                <i class="fas fa-plus text-xs"></i>
                            </button>
                        </div>
                        <button 
                            onclick="window.cart.removeItem(${product.id})"
                            class="text-red-500 hover:text-red-700"
                        >
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    </div>
                `;
            }

            document.getElementById('cart-items').innerHTML = cartItemsHTML;

            // Add total and checkout button
            cartContent.innerHTML += `
                <div class="border-t pt-4">
                    <div class="flex justify-between items-center mb-4">
                        <span class="font-bold text-lg">مجموع:</span>
                        <span class="font-bold text-xl text-primary price">
                            ${new Intl.NumberFormat('fa-IR').format(totalPrice)} تومان
                        </span>
                    </div>
                    
                    ${window.auth.isAuthenticated() ? `
                        <button onclick="window.cart.checkout()" class="btn-primary w-full mb-2">
                            <i class="fas fa-credit-card ml-2"></i>
                            تسویه حساب
                        </button>
                    ` : `
                        <button onclick="window.cart.close(); app.showLogin()" class="btn-primary w-full mb-2">
                            ورود برای تسویه حساب
                        </button>
                    `}
                    
                    <button onclick="window.cart.clear()" class="btn-outline w-full text-sm">
                        پاک کردن سبد خرید
                    </button>
                </div>
            `;

        } catch (error) {
            console.error('Error loading cart items:', error);
            document.getElementById('cart-items').innerHTML = `
                <div class="text-center py-4 text-red-500">
                    <p>خطا در بارگذاری محصولات</p>
                </div>
            `;
        }
    }

    async checkout() {
        if (!window.auth.isAuthenticated()) {
            this.close();
            app.showLogin();
            return;
        }

        if (this.items.length === 0) {
            this.showToast('سبد خرید شما خالی است', 'error');
            return;
        }

        // Show checkout form
        app.showCheckout();
        this.close();
    }

    render() {
        // Cart sidebar is already in the HTML, we just need to update its content when opened
    }

    bindEvents() {
        // Close cart when clicking overlay
        document.getElementById('cart-overlay').addEventListener('click', () => {
            this.close();
        });

        // Close cart with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    saveToStorage() {
        localStorage.setItem('cart_items', JSON.stringify(this.items));
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

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
});
