from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    full_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    role = db.Column(db.String(20), default='customer')  # admin, customer
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    orders = db.relationship('Order', backref='user', lazy=True)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'phone': self.phone,
            'address': self.address,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    name_persian = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    products = db.relationship('Product', backref='category', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'name_persian': self.name_persian,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    name_persian = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    description_persian = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    stock_quantity = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(500))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Product specific fields
    brand = db.Column(db.String(100))
    weight = db.Column(db.String(50))  # e.g., "500g", "1kg"
    serving_size = db.Column(db.String(50))
    servings_per_container = db.Column(db.Integer)
    ingredients = db.Column(db.Text)
    usage_instructions = db.Column(db.Text)
    warnings = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'name_persian': self.name_persian,
            'description': self.description,
            'description_persian': self.description_persian,
            'price': self.price,
            'stock_quantity': self.stock_quantity,
            'image_url': self.image_url,
            'category_id': self.category_id,
            'category': self.category.to_dict() if self.category else None,
            'is_active': self.is_active,
            'brand': self.brand,
            'weight': self.weight,
            'serving_size': self.serving_size,
            'servings_per_container': self.servings_per_container,
            'ingredients': self.ingredients,
            'usage_instructions': self.usage_instructions,
            'warnings': self.warnings,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, confirmed, shipped, delivered, cancelled
    shipping_address = db.Column(db.Text)
    phone = db.Column(db.String(20))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    order_items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total_amount': self.total_amount,
            'status': self.status,
            'shipping_address': self.shipping_address,
            'phone': self.phone,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'order_items': [item.to_dict() for item in self.order_items]
        }

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)  # Price at time of order
    
    # Relationships
    product = db.relationship('Product', backref='order_items')
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'product': self.product.to_dict() if self.product else None,
            'quantity': self.quantity,
            'price': self.price
        }

class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    title_persian = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    content_persian = db.Column(db.Text, nullable=False)
    excerpt = db.Column(db.Text)
    excerpt_persian = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    is_published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # SEO fields
    meta_title = db.Column(db.String(60))
    meta_description = db.Column(db.String(160))
    slug = db.Column(db.String(200), unique=True)
    
    # Relationships
    author = db.relationship('User', backref='blog_posts')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'title_persian': self.title_persian,
            'content': self.content,
            'content_persian': self.content_persian,
            'excerpt': self.excerpt,
            'excerpt_persian': self.excerpt_persian,
            'image_url': self.image_url,
            'author_id': self.author_id,
            'author': self.author.to_dict() if self.author else None,
            'is_published': self.is_published,
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'slug': self.slug,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Newsletter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
