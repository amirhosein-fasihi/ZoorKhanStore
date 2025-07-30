from flask import request, jsonify, render_template
from flask_jwt_extended import create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash
from app import app, db
from models import User, Product, Category, Order, OrderItem, BlogPost, Newsletter
from auth import admin_required, login_required, get_current_user
import logging

# Serve the main React app
@app.route('/')
def index():
    return render_template('index.html')

# Authentication routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password', 'full_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} الزامی است'}), 400
        
        # Check if user exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'این ایمیل قبلا ثبت شده است'}), 400
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'این نام کاربری قبلا انتخاب شده است'}), 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            full_name=data['full_name'],
            phone=data.get('phone', ''),
            address=data.get('address', ''),
            role='customer'
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'ثبت نام با موفقیت انجام شد',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        logging.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'خطا در ثبت نام'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'ایمیل و رمز عبور الزامی است'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'ایمیل یا رمز عبور اشتباه است'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'حساب کاربری غیرفعال است'}), 401
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'ورود با موفقیت انجام شد',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        return jsonify({'error': 'خطا در ورود'}), 500

@app.route('/api/auth/profile', methods=['GET'])
@login_required
def get_profile():
    try:
        user = get_current_user()
        return jsonify({'user': user.to_dict()}), 200
    except Exception as e:
        logging.error(f"Profile error: {str(e)}")
        return jsonify({'error': 'خطا در دریافت اطلاعات کاربر'}), 500

# Product routes
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 12, type=int)
        category_id = request.args.get('category_id', type=int)
        search = request.args.get('search', '')
        
        query = Product.query.filter_by(is_active=True)
        
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        if search:
            query = query.filter(
                db.or_(
                    Product.name.contains(search),
                    Product.name_persian.contains(search),
                    Product.description.contains(search),
                    Product.description_persian.contains(search)
                )
            )
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        products = pagination.items
        
        return jsonify({
            'products': [product.to_dict() for product in products],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }), 200
        
    except Exception as e:
        logging.error(f"Get products error: {str(e)}")
        return jsonify({'error': 'خطا در دریافت محصولات'}), 500

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        if not product.is_active:
            return jsonify({'error': 'محصول یافت نشد'}), 404
        return jsonify({'product': product.to_dict()}), 200
    except Exception as e:
        logging.error(f"Get product error: {str(e)}")
        return jsonify({'error': 'خطا در دریافت محصول'}), 500

@app.route('/api/admin/products', methods=['POST'])
@admin_required
def create_product():
    try:
        data = request.get_json()
        
        required_fields = ['name', 'name_persian', 'price', 'category_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} الزامی است'}), 400
        
        product = Product(
            name=data['name'],
            name_persian=data['name_persian'],
            description=data.get('description', ''),
            description_persian=data.get('description_persian', ''),
            price=float(data['price']),
            stock_quantity=int(data.get('stock_quantity', 0)),
            image_url=data.get('image_url', ''),
            category_id=int(data['category_id']),
            brand=data.get('brand', ''),
            weight=data.get('weight', ''),
            serving_size=data.get('serving_size', ''),
            servings_per_container=data.get('servings_per_container', 0),
            ingredients=data.get('ingredients', ''),
            usage_instructions=data.get('usage_instructions', ''),
            warnings=data.get('warnings', '')
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'message': 'محصول با موفقیت ایجاد شد',
            'product': product.to_dict()
        }), 201
        
    except Exception as e:
        logging.error(f"Create product error: {str(e)}")
        return jsonify({'error': 'خطا در ایجاد محصول'}), 500

# Category routes
@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify({
            'categories': [category.to_dict() for category in categories]
        }), 200
    except Exception as e:
        logging.error(f"Get categories error: {str(e)}")
        return jsonify({'error': 'خطا در دریافت دسته‌بندی‌ها'}), 500

@app.route('/api/admin/categories', methods=['POST'])
@admin_required
def create_category():
    try:
        data = request.get_json()
        
        if not data.get('name') or not data.get('name_persian'):
            return jsonify({'error': 'نام و نام فارسی الزامی است'}), 400
        
        category = Category(
            name=data['name'],
            name_persian=data['name_persian'],
            description=data.get('description', '')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'message': 'دسته‌بندی با موفقیت ایجاد شد',
            'category': category.to_dict()
        }), 201
        
    except Exception as e:
        logging.error(f"Create category error: {str(e)}")
        return jsonify({'error': 'خطا در ایجاد دسته‌بندی'}), 500

# Order routes
@app.route('/api/orders', methods=['POST'])
@login_required
def create_order():
    try:
        data = request.get_json()
        user = get_current_user()
        
        required_fields = ['items', 'shipping_address', 'phone']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} الزامی است'}), 400
        
        if not data['items'] or len(data['items']) == 0:
            return jsonify({'error': 'سبد خرید خالی است'}), 400
        
        # Calculate total and validate items
        total_amount = 0
        order_items = []
        
        for item in data['items']:
            product = Product.query.get(item.get('product_id'))
            if not product or not product.is_active:
                return jsonify({'error': f'محصول {item.get("product_id")} یافت نشد'}), 400
            
            quantity = int(item.get('quantity', 0))
            if quantity <= 0:
                return jsonify({'error': 'تعداد محصولات باید بیشتر از صفر باشد'}), 400
            
            if product.stock_quantity < quantity:
                return jsonify({'error': f'موجودی کافی برای محصول {product.name_persian} نیست'}), 400
            
            item_total = product.price * quantity
            total_amount += item_total
            
            order_items.append({
                'product': product,
                'quantity': quantity,
                'price': product.price
            })
        
        # Create order
        order = Order(
            user_id=user.id,
            total_amount=total_amount,
            shipping_address=data['shipping_address'],
            phone=data['phone'],
            notes=data.get('notes', '')
        )
        
        db.session.add(order)
        db.session.flush()  # Get order ID
        
        # Add order items and update stock
        for item_data in order_items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_data['product'].id,
                quantity=item_data['quantity'],
                price=item_data['price']
            )
            db.session.add(order_item)
            
            # Update stock
            item_data['product'].stock_quantity -= item_data['quantity']
        
        db.session.commit()
        
        return jsonify({
            'message': 'سفارش با موفقیت ثبت شد',
            'order': order.to_dict()
        }), 201
        
    except Exception as e:
        logging.error(f"Create order error: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'خطا در ثبت سفارش'}), 500

@app.route('/api/orders', methods=['GET'])
@login_required
def get_user_orders():
    try:
        user = get_current_user()
        orders = Order.query.filter_by(user_id=user.id).order_by(Order.created_at.desc()).all()
        
        return jsonify({
            'orders': [order.to_dict() for order in orders]
        }), 200
        
    except Exception as e:
        logging.error(f"Get orders error: {str(e)}")
        return jsonify({'error': 'خطا در دریافت سفارشات'}), 500

# Blog routes
@app.route('/api/blog', methods=['GET'])
def get_blog_posts():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 6, type=int)
        
        pagination = BlogPost.query.filter_by(is_published=True).order_by(
            BlogPost.created_at.desc()
        ).paginate(page=page, per_page=per_page, error_out=False)
        
        posts = pagination.items
        
        return jsonify({
            'posts': [post.to_dict() for post in posts],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }), 200
        
    except Exception as e:
        logging.error(f"Get blog posts error: {str(e)}")
        return jsonify({'error': 'خطا در دریافت مقالات'}), 500

@app.route('/api/blog/<int:post_id>', methods=['GET'])
def get_blog_post(post_id):
    try:
        post = BlogPost.query.get_or_404(post_id)
        if not post.is_published:
            return jsonify({'error': 'مقاله یافت نشد'}), 404
        return jsonify({'post': post.to_dict()}), 200
    except Exception as e:
        logging.error(f"Get blog post error: {str(e)}")
        return jsonify({'error': 'خطا در دریافت مقاله'}), 500

@app.route('/api/admin/blog', methods=['POST'])
@admin_required
def create_blog_post():
    try:
        data = request.get_json()
        user = get_current_user()
        
        required_fields = ['title', 'title_persian', 'content', 'content_persian']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} الزامی است'}), 400
        
        post = BlogPost(
            title=data['title'],
            title_persian=data['title_persian'],
            content=data['content'],
            content_persian=data['content_persian'],
            excerpt=data.get('excerpt', ''),
            excerpt_persian=data.get('excerpt_persian', ''),
            image_url=data.get('image_url', ''),
            author_id=user.id,
            meta_title=data.get('meta_title', ''),
            meta_description=data.get('meta_description', ''),
            slug=data.get('slug', ''),
            is_published=data.get('is_published', False)
        )
        
        db.session.add(post)
        db.session.commit()
        
        return jsonify({
            'message': 'مقاله با موفقیت ایجاد شد',
            'post': post.to_dict()
        }), 201
        
    except Exception as e:
        logging.error(f"Create blog post error: {str(e)}")
        return jsonify({'error': 'خطا در ایجاد مقاله'}), 500

# Newsletter subscription
@app.route('/api/newsletter/subscribe', methods=['POST'])
def subscribe_newsletter():
    try:
        data = request.get_json()
        
        if not data.get('email'):
            return jsonify({'error': 'ایمیل الزامی است'}), 400
        
        # Check if already subscribed
        existing = Newsletter.query.filter_by(email=data['email']).first()
        if existing:
            if existing.is_active:
                return jsonify({'message': 'شما قبلا در خبرنامه عضو شده‌اید'}), 200
            else:
                existing.is_active = True
                db.session.commit()
                return jsonify({'message': 'عضویت شما در خبرنامه فعال شد'}), 200
        
        newsletter = Newsletter(email=data['email'])
        db.session.add(newsletter)
        db.session.commit()
        
        return jsonify({'message': 'عضویت در خبرنامه با موفقیت انجام شد'}), 201
        
    except Exception as e:
        logging.error(f"Newsletter subscription error: {str(e)}")
        return jsonify({'error': 'خطا در عضویت خبرنامه'}), 500

# Admin dashboard routes
@app.route('/api/admin/dashboard', methods=['GET'])
@admin_required
def admin_dashboard():
    try:
        # Get dashboard statistics
        total_users = User.query.filter_by(role='customer').count()
        total_products = Product.query.filter_by(is_active=True).count()
        total_orders = Order.query.count()
        total_revenue = db.session.query(db.func.sum(Order.total_amount)).scalar() or 0
        
        # Recent orders
        recent_orders = Order.query.order_by(Order.created_at.desc()).limit(5).all()
        
        return jsonify({
            'stats': {
                'total_users': total_users,
                'total_products': total_products,
                'total_orders': total_orders,
                'total_revenue': total_revenue
            },
            'recent_orders': [order.to_dict() for order in recent_orders]
        }), 200
        
    except Exception as e:
        logging.error(f"Admin dashboard error: {str(e)}")
        return jsonify({'error': 'خطا در دریافت اطلاعات داشبورد'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
