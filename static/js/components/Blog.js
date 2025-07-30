// Blog component for Zoorkhan store
class Blog {
    render() {
        return `
            <div class="container mx-auto px-4 py-8">
                <h1 class="text-3xl font-bold mb-8">مقالات و اخبار</h1>
                <div id="blog-posts" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="text-center py-8 col-span-full">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-2">در حال بارگذاری...</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderPost() {
        return `
            <div class="container mx-auto px-4 py-8">
                <div id="blog-post-content">
                    <div class="text-center py-8">
                        <div class="loading-spinner mx-auto"></div>
                        <p class="text-gray-500 mt-2">در حال بارگذاری...</p>
                    </div>
                </div>
            </div>
        `;
    }

    async loadBlogPosts() {
        try {
            const response = await window.api.getBlogPosts();
            const container = document.getElementById('blog-posts');
            if (container && response.posts) {
                if (response.posts.length === 0) {
                    container.innerHTML = '<p class="text-center text-gray-500 py-8 col-span-full">مقاله‌ای یافت نشد</p>';
                    return;
                }

                container.innerHTML = response.posts.map(post => `
                    <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        ${post.image_url ? `
                            <img src="${post.image_url}" alt="${post.title_persian}" class="w-full h-48 object-cover">
                        ` : ''}
                        <div class="p-6">
                            <h2 class="text-xl font-bold mb-3 hover:text-primary cursor-pointer" onclick="app.showBlogPost(${post.id})">
                                ${post.title_persian}
                            </h2>
                            <p class="text-gray-600 mb-4 line-clamp-2">${post.excerpt_persian || post.excerpt || ''}</p>
                            <div class="flex items-center justify-between text-sm text-gray-500">
                                <span>نویسنده: ${post.author_name || 'تیم زورخان'}</span>
                                <span>${new Date(post.created_at).toLocaleDateString('fa-IR')}</span>
                            </div>
                            <button onclick="app.showBlogPost(${post.id})" class="btn-primary mt-4 w-full">
                                مطالعه کامل
                            </button>
                        </div>
                    </article>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading blog posts:', error);
            const container = document.getElementById('blog-posts');
            if (container) {
                container.innerHTML = '<p class="text-center text-red-500 py-8 col-span-full">خطا در بارگذاری مقالات</p>';
            }
        }
    }

    async loadBlogPost(postId) {
        try {
            const response = await window.api.getBlogPost(postId);
            const container = document.getElementById('blog-post-content');
            if (container && response.post) {
                const post = response.post;
                container.innerHTML = `
                    <article class="max-w-4xl mx-auto">
                        <!-- Breadcrumb -->
                        <nav class="text-sm text-gray-600 mb-6">
                            <a href="#" onclick="app.showHome()" class="hover:text-primary">خانه</a>
                            <span class="mx-2">/</span>
                            <a href="#" onclick="app.showBlog()" class="hover:text-primary">مقالات</a>
                            <span class="mx-2">/</span>
                            <span class="text-gray-800">${post.title_persian}</span>
                        </nav>

                        <header class="mb-8">
                            <h1 class="text-4xl font-bold mb-4">${post.title_persian}</h1>
                            <div class="flex items-center gap-4 text-gray-600 mb-6">
                                <div class="flex items-center">
                                    <i class="fas fa-user ml-2"></i>
                                    <span>نویسنده: ${post.author_name || 'تیم زورخان'}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-calendar ml-2"></i>
                                    <span>${new Date(post.created_at).toLocaleDateString('fa-IR')}</span>
                                </div>
                            </div>
                            ${post.image_url ? `
                                <img src="${post.image_url}" alt="${post.title_persian}" class="w-full rounded-lg shadow-lg mb-6">
                            ` : ''}
                        </header>

                        <div class="prose prose-lg max-w-none">
                            <div class="text-gray-700 leading-relaxed">
                                ${post.content_persian ? post.content_persian.replace(/\n/g, '<br>') : (post.content ? post.content.replace(/\n/g, '<br>') : '')}
                            </div>
                        </div>

                        <footer class="mt-12 pt-8 border-t border-gray-200">
                            <div class="flex items-center justify-between">
                                <button onclick="app.showBlog()" class="btn-outline">
                                    <i class="fas fa-arrow-right ml-2"></i>
                                    بازگشت به مقالات
                                </button>
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-600">اشتراک‌گذاری:</span>
                                    <button class="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                        <i class="fab fa-telegram"></i>
                                    </button>
                                    <button class="p-2 text-green-600 hover:bg-green-50 rounded">
                                        <i class="fab fa-whatsapp"></i>
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </article>
                `;
            }
        } catch (error) {
            console.error('Error loading blog post:', error);
            const container = document.getElementById('blog-post-content');
            if (container) {
                container.innerHTML = `
                    <div class="text-center py-12">
                        <i class="fas fa-exclamation-triangle text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500">مقاله یافت نشد</p>
                        <button onclick="app.showBlog()" class="btn-primary mt-4">بازگشت به مقالات</button>
                    </div>
                `;
            }
        }
    }
}

window.blog = new Blog();