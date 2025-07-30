# Zoorkhan - Persian Sports Supplements E-commerce Store

## Overview

Zoorkhan is a Persian (Farsi) e-commerce web application for sports supplements and nutrition products. The application features a Flask backend API with a vanilla JavaScript frontend, supporting user authentication, product management, shopping cart functionality, and an admin panel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Database**: SQLite with SQLAlchemy ORM (configurable to PostgreSQL via DATABASE_URL)
- **Authentication**: JWT-based authentication using Flask-JWT-Extended
- **API Design**: RESTful API structure with JSON responses
- **Template Engine**: Jinja2 for serving the main HTML template

### Frontend Architecture
- **Framework**: Vanilla JavaScript (no framework dependencies)
- **UI Library**: Tailwind CSS for styling
- **Component Architecture**: Class-based components with manual DOM manipulation
- **State Management**: Local storage for cart and auth state
- **Language**: Persian/Farsi with RTL support

### Key Design Decisions
- **Monolithic Structure**: Single Flask application serving both API and frontend
- **JWT Authentication**: Stateless authentication with no token expiration for simplicity
- **Component-based Frontend**: Modular JavaScript classes despite no framework
- **Persian-first Design**: All UI text and database fields support Persian language

## Key Components

### Backend Components

1. **Flask Application (`app.py`)**
   - Application factory pattern
   - CORS configuration for frontend communication
   - Database initialization and configuration
   - JWT setup for authentication

2. **Database Models (`models.py`)**
   - User model with role-based access (customer/admin)
   - Product model with Persian name support
   - Category model with bilingual names
   - Order and OrderItem models for e-commerce functionality
   - BlogPost and Newsletter models for content management

3. **Authentication System (`auth.py`)**
   - JWT-based authentication decorators
   - Role-based access control (admin_required, login_required)
   - User session management utilities

4. **API Routes (`api_routes.py`)**
   - RESTful endpoints for all business logic
   - User registration and authentication
   - Product and category management
   - Order processing functionality

### Frontend Components

1. **Main Application (`static/js/app.js`)**
   - Single-page application router
   - State management for current page and data
   - Component orchestration

2. **UI Components**
   - Header: Navigation and user menu
   - ProductCard: Reusable product display component
   - Cart: Shopping cart functionality with local storage
   - Dashboard: Customer account management
   - Admin: Administrative panel for content management
   - Blog: Content management system

3. **Utility Classes**
   - API: HTTP client for backend communication
   - Auth: Authentication state management
   - Various helper functions for UI interactions

## Data Flow

### Authentication Flow
1. User submits credentials via frontend form
2. Frontend sends POST request to `/api/auth/login`
3. Backend validates credentials and generates JWT token
4. Token stored in localStorage and added to API headers
5. Protected routes validate JWT on each request

### Product Display Flow
1. Frontend requests product data from `/api/products`
2. Backend queries database with filters/pagination
3. Products returned with category and availability info
4. Frontend renders product cards with Persian names and pricing

### Order Processing Flow
1. User adds products to cart (stored locally)
2. Checkout process sends cart data to `/api/orders`
3. Backend validates products and creates order records
4. Order confirmation returned to frontend

## External Dependencies

### Backend Dependencies
- **Flask**: Web framework
- **SQLAlchemy**: Database ORM
- **Flask-JWT-Extended**: JWT authentication
- **Flask-CORS**: Cross-origin resource sharing
- **Werkzeug**: Password hashing utilities

### Frontend Dependencies
- **Tailwind CSS**: Utility-first CSS framework (CDN)
- **Font Awesome**: Icon library (CDN)
- **Vazirmatn Font**: Persian font family (Google Fonts)
- **Axios**: HTTP client library (implied by API utility usage)

### Notable Integrations
- No external payment gateways currently integrated
- No third-party analytics or tracking
- No external image hosting (local/relative paths)

## Deployment Strategy

### Current Configuration
- **Development Server**: Flask development server on port 8000
- **Static Files**: Served directly by Flask
- **Database**: SQLite for development, configurable to PostgreSQL
- **Environment Variables**: 
  - `DATABASE_URL`: Database connection string
  - `SESSION_SECRET`: JWT secret key

### Production Considerations
- Application designed to run behind a reverse proxy (ProxyFix middleware)
- CORS configured for localhost development
- Database connection pooling configured for production use
- No specific deployment automation or containerization setup

### Scaling Limitations
- Single-threaded Flask development server
- Local file storage for static assets
- No caching layer implemented
- No CDN integration for static assets

The application follows a traditional MVC pattern with clear separation between API logic and frontend presentation, making it suitable for small to medium-scale e-commerce operations with Persian language requirements.