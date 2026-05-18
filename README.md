# 🛍️ Stationery Catalog Web Application (React)

A modern and responsive React-based Stationery Catalog Web Application designed for showcasing, managing, and browsing stationery products online.

---

## 📌 Project Overview

The Stationery Catalog Application is built using React.js to create a fast, scalable, and interactive web platform for stationery businesses, office suppliers, schools, and online stores.

The system allows users to:

- Browse stationery products
- Search items instantly
- Filter products by category
- View detailed product information
- Manage inventory through admin panel

---

## 🚀 Features

### 👤 User Features

- Responsive modern UI
- Product catalog browsing
- Category-based filtering
- Real-time product search
- Product details page
- Image gallery support
- Mobile-friendly design
- Fast page rendering using React

### 🔐 Admin Features

- Add new products
- Edit product details
- Delete products
- Manage product categories
- Upload product images
- Inventory management dashboard

---

## 🛠️ Technologies Used

### Frontend
- React.js (v18.3.1)
- React Router DOM (v6.22.3)
- Axios (v1.6.8)
- Tailwind CSS (v3.4.3)
- HTML5
- CSS3
- JavaScript (ES6)

### Backend
- Node.js
- Express.js (v4.19.2)
- CORS (v2.8.5)

### Database
- MongoDB
- Mongoose (v8.3.2)

### Development Tools
- Vite (v5.2.0)
- Git & GitHub
- VS Code
- REST API
- npm

---

## 📂 Project Structure

```bash
stationery-catalog-react/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── Footer.jsx
│   │   └── CategoryFilter.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Categories.jsx
│   │   └── AdminDashboard.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── server/
│   ├── index.js
│   ├── models/
│   │   └── Product.js
│   ├── routes/
│   │   ├── products.js
│   │   └── categories.js
│   └── seed.js
│
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stationery-catalog-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017/stationery-catalog`
   - If using a different MongoDB instance, update the connection string in `server/index.js`

4. **Seed the database with sample data**
   ```bash
   node server/seed.js
   ```

### Running the Application

1. **Start the backend server** (in one terminal)
   ```bash
   npm run server
   ```
   The server will run on `http://localhost:5000`

2. **Start the frontend development server** (in another terminal)
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

---

## 📖 Usage

### User Features

1. **Browse Products**: Navigate to the Products page to view all available stationery items
2. **Search**: Use the search bar to find specific products by name or description
3. **Filter by Category**: Use the category filter in the sidebar to browse products by category
4. **View Details**: Click on any product to view detailed information including price, stock, and description
5. **Categories Page**: Visit the Categories page to browse all available product categories

### Admin Features

1. **Access Admin Dashboard**: Navigate to `/admin` to access the admin panel
2. **Add Product**: Click "Add New Product" to create a new product entry
3. **Edit Product**: Click "Edit" on any product to modify its details
4. **Delete Product**: Click "Delete" to remove a product from the catalog
5. **Manage Inventory**: View and update stock levels for all products

---

## 🔧 API Endpoints

### Products

- `GET /api/products` - Get all products (supports query params: `category`, `search`, `limit`)
- `GET /api/products/:id` - Get a single product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Categories

- `GET /api/categories` - Get all unique categories

### Health Check

- `GET /api/health` - Check server status

---

## 🎨 Customization

### Styling

The application uses Tailwind CSS for styling. To customize the design:

1. Edit `tailwind.config.js` to modify theme settings
2. Add custom styles in `src/index.css`
3. Modify component classes in individual JSX files

### Database Schema

The Product model is defined in `server/models/Product.js`. You can modify the schema to add additional fields:

```javascript
const productSchema = new mongoose.Schema({
  // Add your custom fields here
})
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

If you encounter MongoDB connection errors:

1. Ensure MongoDB is running: `mongod` (or use MongoDB Compass)
2. Check the connection string in `server/index.js`
3. Verify MongoDB is running on the default port (27017)

### Port Already in Use

If port 3000 or 5000 is already in use:

1. Change the port in `vite.config.js` (for frontend)
2. Change the port in `server/index.js` (for backend)

### CORS Errors

If you encounter CORS errors:

1. Ensure the backend server is running
2. Check the proxy configuration in `vite.config.js`
3. Verify CORS middleware is properly configured in `server/index.js`

---

## 📝 License

This project is open source and available for educational purposes.

---

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For support and questions, please open an issue in the repository.

---

## 🎯 Future Enhancements

- User authentication and authorization
- Shopping cart functionality
- Order management system
- Payment integration
- Product reviews and ratings
- Advanced search with filters
- Image upload functionality
- Export products to CSV/PDF
- Multi-language support
- Dark mode theme
