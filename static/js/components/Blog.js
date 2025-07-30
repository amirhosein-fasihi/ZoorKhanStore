// Blog component for Zoorkhan store
class Blog {
    constructor() {
        this.currentPost = null;
        this.posts = [];
        this.currentPage = 1;
        this.totalPages = 1;
    }

    render() {
        return `
            <div class="container mx-auto px-4 py-8">
                <div class="text-center mb-12">
                    <h1 class="text-4xl font-bold mb-4">بلاگ زورخان</h1>
                    <p class="text-xl text-gray-600">آخرین مطالب و نکات تغذیه‌ای و ورزشی</p>
                </div>
                
                <!-- Featured Post -->
                <div id="featured-post" class="mb-12">
                    <!-- Featured post will be loaded here -->
                </div>
                
                <!-- Blog Categories -->
                <div class="flex flex-wrap justify-center gap-4 mb-8">
                    <button onclick="blog.filterByCategory('')" class="blog-category-btn active">
                        همه مطالب
                    </button>
                    <button onclick="blog.filterByCategory('nutrition')" class="blog-category-btn">
                        تغذیه ورزشی
                    </button>
                    <button onclick="blog.filterByCategory('training')" class="blog-category-btn">
                        تمرینات
                    </button>
                    <button onclick="blog.filterByCategory('supplements')" class="blog-category-btn">
                        راهنمای مکمل‌ها
                    </button>
                    <button onclick="blog.filterByCategory('health')" class="blog-category-btn">
                        سلامت و تناسب اندام
                    </button>
                </div>
                
                <!-- Blog Posts Grid -->
                <div id="blog-posts" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    <div class="text-center py-8 col-span-full">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-2">در حال بارگذاری مطالب...</p>
                    </div>
                </div>
                
                <!-- Pagination -->
                <div id="blog-pagination" class="flex justify-center">
                    <!-- Pagination will be loaded here -->
                </div>
            </div>
            
            <style>
                .blog-category-btn {
                    padding: 8px 16px;
                    border: 2px solid #e5e7eb;
                    border-radius: 25px;
                    background: white;
                    color: #374151;
                    transition: all 0.2s;
                    font-size: 14px;
                }
                
                .blog-category-btn:hover {
                    border-color: #1f2937;
                    color: #1f2937;
                }
                
                .blog-category-btn.active {
                    background: #1f2937;
                    color: white;
                    border-color: #1f2937;
                }
            </style>
        `;
    }

    renderPost() {
        return `
            <div class="container mx-auto px-4 py-8">
                <div id="blog-post-content">
                    <div class="text-center py-12">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-4">در حال بارگذاری مطلب...</p>
                    </div>
                </div>
                
                <!-- Related Posts -->
                <div class="mt-16">
                    <h2 class="text-2xl font-bold mb-8">مطالب مرتبط</h2>
                    <div id="related-posts" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <!-- Related posts will be loaded here -->
                    </div>
                </div>
                
                <!-- Back to Blog -->
                <div class="mt-12 text-center">
                    <button onclick="app.showBlog()" class="btn-outline">
                        <i class="fas fa-arrow-right ml-2"></i>
                        بازگشت به بلاگ
                    </button>
                </div>
            </div>
        `;
    }

    async loadBlogPosts(page = 1, category = '') {
        try {
            const params = { page, per_page: 9 };
            if (category) params.category = category;

            const response = await window.api.getBlogPosts(params);
            this.posts = response.posts;
            this.currentPage = response.current_page;
            this.totalPages = response.pages;
            
            this.renderBlogPosts();
            this.renderPagination();
            
            // Load featured post if on first page
            if (page === 1) {
                this.loadFeaturedPost();
            }
            
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.renderError();
        }
    }

    async loadFeaturedPost() {
        try {
            const featuredContainer = document.getElementById('featured-post');
            if (!featuredContainer) return;

            // Get the latest post as featured
            if (this.posts.length > 0) {
                const featured = this.posts[0];
                featuredContainer.innerHTML = `
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div class="md:flex">
                            <div class="md:w-1/2">
                                <img 
                                    src="${featured.image_url || 'https://pixabay.com/get/g1f42a35755d4622786186b44402e6ce4a53f5d78c80374f9243707568543a9718ddcacd4ecd48e57c08063fa49f393122d61374e358834c1366b49dea6b5f352_1280.jpg'}" 
                                    alt="${featured.title_persian}"
                                    class="w-full h-64 md:h-full object-cover"
                                >
                            </div>
                            <div class="md:w-1/2 p-8">
                                <span class="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm mb-4">
                                    مطلب ویژه
                                </span>
                                <h2 class="text-2xl md:text-3xl font-bold mb-4">${featured.title_persian}</h2>
                                <p class="text-gray-600 mb-6 line-clamp-3">${featured.excerpt_persian || featured.content_persian.substring(0, 150) + '...'}</p>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center text-sm text-gray-500">
                                        <i class="fas fa-calendar ml-2"></i>
                                        <span>${new Date(featured.created_at).toLocaleDateString('fa-IR')}</span>
                                        ${featured.author ? `
                                            <i class="fas fa-user mr-4 ml-2"></i>
                                            <span>${featured.author.full_name}</span>
                                        ` : ''}
                                    </div>
                                    <button onclick="app.showBlogPost(${featured.id})" class="btn-primary">
                                        ادامه مطلب
                                        <i class="fas fa-arrow-left mr-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading featured post:', error);
        }
    }

    renderBlogPosts() {
        const container = document.getElementById('blog-posts');
        if (!container) return;

        if (this.posts.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 col-span-full">
                    <i class="fas fa-newspaper text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">مطلبی یافت نشد</p>
                </div>
            `;
            return;
        }

        // Skip first post if it's featured (on first page)
        const postsToShow = this.currentPage === 1 ? this.posts.slice(1) : this.posts;

        container.innerHTML = postsToShow.map(post => this.renderBlogCard(post)).join('');
    }

    renderBlogCard(post) {
        return `
            <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div class="relative">
                    <img 
                        src="${post.image_url || this.getRandomHealthImage()}" 
                        alt="${post.title_persian}"
                        class="w-full h-48 object-cover"
                    >
                    <div class="absolute top-4 right-4">
                        <span class="bg-primary text-white px-3 py-1 rounded-full text-xs">
                            ${this.getCategoryName(post.category)}
                        </span>
                    </div>
                </div>
                
                <div class="p-6">
                    <h3 class="font-bold text-lg mb-3 line-clamp-2">${post.title_persian}</h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                        ${post.excerpt_persian || post.content_persian.substring(0, 120) + '...'}
                    </p>
                    
                    <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div class="flex items-center">
                            <i class="fas fa-calendar ml-2"></i>
                            <span>${new Date(post.created_at).toLocaleDateString('fa-IR')}</span>
                        </div>
                        ${post.author ? `
                            <div class="flex items-center">
                                <i class="fas fa-user ml-2"></i>
                                <span>${post.author.full_name}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <button onclick="app.showBlogPost(${post.id})" class="btn-primary w-full">
                        مطالعه مطلب
                        <i class="fas fa-arrow-left mr-2"></i>
                    </button>
                </div>
            </article>
        `;
    }

    async loadBlogPost(postId) {
        try {
            const container = document.getElementById('blog-post-content');
            if (!container) return;

            const response = await window.api.getBlogPost(postId);
            const post = response.post;
            this.currentPost = post;

            container.innerHTML = `
                <article class="max-w-4xl mx-auto">
                    <!-- Post Header -->
                    <header class="text-center mb-12">
                        <div class="mb-6">
                            <span class="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm">
                                ${this.getCategoryName(post.category)}
                            </span>
                        </div>
                        <h1 class="text-4xl font-bold mb-6">${post.title_persian}</h1>
                        
                        <div class="flex items-center justify-center space-x-reverse space-x-6 text-gray-600 mb-8">
                            <div class="flex items-center">
                                <i class="fas fa-calendar ml-2"></i>
                                <span>${new Date(post.created_at).toLocaleDateString('fa-IR')}</span>
                            </div>
                            ${post.author ? `
                                <div class="flex items-center">
                                    <i class="fas fa-user ml-2"></i>
                                    <span>${post.author.full_name}</span>
                                </div>
                            ` : ''}
                            <div class="flex items-center">
                                <i class="fas fa-eye ml-2"></i>
                                <span>۱۲۳ بازدید</span>
                            </div>
                        </div>
                        
                        ${post.image_url ? `
                            <div class="mb-8">
                                <img 
                                    src="${post.image_url}" 
                                    alt="${post.title_persian}"
                                    class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                                >
                            </div>
                        ` : ''}
                    </header>
                    
                    <!-- Post Content -->
                    <div class="bg-white rounded-lg shadow-md p-8 mb-8">
                        <div class="prose prose-lg max-w-none">
                            ${this.formatContent(post.content_persian)}
                        </div>
                    </div>
                    
                    <!-- Post Footer -->
                    <footer class="bg-gray-50 rounded-lg p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="font-semibold mb-2">این مطلب را با دوستان خود به اشتراک بگذارید</h4>
                                <div class="flex space-x-reverse space-x-3">
                                    <button class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600">
                                        <i class="fab fa-telegram"></i>
                                    </button>
                                    <button class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600">
                                        <i class="fab fa-whatsapp"></i>
                                    </button>
                                    <button class="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white hover:bg-gray-600">
                                        <i class="fas fa-link"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="text-center">
                                <button onclick="blog.toggleBookmark(${post.id})" class="flex items-center space-x-reverse space-x-2 text-gray-600 hover:text-primary">
                                    <i class="far fa-bookmark"></i>
                                    <span>ذخیره مطلب</span>
                                </button>
                            </div>
                        </div>
                    </footer>
                </article>
            `;

            // Load related posts
            this.loadRelatedPosts(post.category, post.id);

        } catch (error) {
            console.error('Error loading blog post:', error);
            const container = document.getElementById('blog-post-content');
            if (container) {
                container.innerHTML = `
                    <div class="text-center py-12 text-red-500">
                        <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                        <p>خطا در بارگذاری مطلب</p>
                        <button onclick="app.showBlog()" class="btn-primary mt-4">
                            بازگشت به بلاگ
                        </button>
                    </div>
                `;
            }
        }
    }

    async loadRelatedPosts(category, excludeId) {
        try {
            const container = document.getElementById('related-posts');
            if (!container) return;

            const response = await window.api.getBlogPosts({ 
                category, 
                per_page: 3 
            });
            
            const relatedPosts = response.posts.filter(p => p.id !== excludeId);
            
            if (relatedPosts.length > 0) {
                container.innerHTML = relatedPosts.map(post => this.renderBlogCard(post)).join('');
            } else {
                container.innerHTML = `
                    <div class="col-span-full text-center py-8">
                        <p class="text-gray-500">مطلب مرتبطی یافت نشد</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading related posts:', error);
        }
    }

    renderPagination() {
        const container = document.getElementById('blog-pagination');
        if (!container) return;

        if (this.totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="flex items-center space-x-reverse space-x-2">';

        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `
                <button onclick="blog.loadBlogPosts(${this.currentPage - 1})" 
                        class="px-4 py-2 border rounded hover:bg-gray-100">
                    قبلی
                </button>
            `;
        }

        // Page numbers
        for (let i = 1; i <= this.totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `
                    <button class="px-4 py-2 bg-primary text-white rounded">
                        ${i}
                    </button>
                `;
            } else {
                paginationHTML += `
                    <button onclick="blog.loadBlogPosts(${i})" 
                            class="px-4 py-2 border rounded hover:bg-gray-100">
                        ${i}
                    </button>
                `;
            }
        }

        // Next button
        if (this.currentPage < this.totalPages) {
            paginationHTML += `
                <button onclick="blog.loadBlogPosts(${this.currentPage + 1})" 
                        class="px-4 py-2 border rounded hover:bg-gray-100">
                    بعدی
                </button>
            `;
        }

        paginationHTML += '</div>';
        container.innerHTML = paginationHTML;
    }

    renderError() {
        const container = document.getElementById('blog-posts');
        if (container) {
            container.innerHTML = `
                <div class="text-center py-12 col-span-full text-red-500">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <p>خطا در بارگذاری مطالب</p>
                    <button onclick="blog.loadBlogPosts()" class="btn-primary mt-4">
                        تلاش مجدد
                    </button>
                </div>
            `;
        }
    }

    filterByCategory(category) {
        // Update active category button
        document.querySelectorAll('.blog-category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // Load posts with category filter
        this.loadBlogPosts(1, category);
    }

    formatContent(content) {
        // Simple content formatting for Persian text
        return content
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');
    }

    getCategoryName(category) {
        const categories = {
            'nutrition': 'تغذیه ورزشی',
            'training': 'تمرینات',
            'supplements': 'راهنمای مکمل‌ها',
            'health': 'سلامت و تناسب اندام'
        };
        return categories[category] || 'عمومی';
    }

    getRandomHealthImage() {
        const healthImages = [
            'https://pixabay.com/get/g1f42a35755d4622786186b44402e6ce4a53f5d78c80374f9243707568543a9718ddcacd4ecd48e57c08063fa49f393122d61374e358834c1366b49dea6b5f352_1280.jpg',
            'https://pixabay.com/get/g00eaf2d2365df8b303aae34a1bacd1ac425f05503c7c6146e2724c8cc3a8f276ae0168e62dc63feb1ea4b8da5476bce6936dea52b3709c1764e041c016606ceb_1280.jpg',
            'https://pixabay.com/get/gc2067e372cbec2a49d424151203b4792a1b3c4bcacaa89f0fe49ca3770fd334296bb22f9e079e7a5bd5006839f866c57342052d9b9184cac1d8d68a528f6facd_1280.jpg',
            'https://pixabay.com/get/g8b845e64640a72ac4ee9d9a1817ff9a06bb6a27f0f41e089559fde0c9ddf3d40f7958289991efcc981a5cf5b57de2599ad65d50255b110ec3c41522ceaddd5ec_1280.jpg',
            'https://pixabay.com/get/g9206fa37c768299e2dc0e51cbccac6cd4c6af2d3accb52220622e77b036c1b152aa3ecf2da7364c78d881a37d4b9c89458577aa360cbaaafdc39224d82c8627b_1280.jpg',
            'https://pixabay.com/get/g9803c4128f9faa2592cbef6221145fe3bb974023a733e8237f2a74cb11deebc51f24114259e690ab77236812aa4d5e65f8bd642c5ef51d63fda946458aa781e9_1280.jpg'
        ];
        return healthImages[Math.floor(Math.random() * healthImages.length)];
    }

    toggleBookmark(postId) {
        // For demo purposes, just show a message
        app.showToast('مطلب در لیست علاقه‌مندی‌های شما ذخیره شد', 'success');
    }
}

// Initialize blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blog = new Blog();
});
