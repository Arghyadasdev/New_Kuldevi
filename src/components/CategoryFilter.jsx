import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

function CategoryFilter({ categories }) {
  const [searchParams] = useSearchParams()
  const currentCategory = searchParams.get('category')

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-display font-semibold mb-4 text-primary-900">Categories</h3>
      <ul className="space-y-2">
        <li>
          <Link
            to="/products"
            className={`block py-2.5 px-4 rounded-lg transition-all duration-300 ${
              !currentCategory 
                ? 'bg-gold-500 text-primary-950 font-medium' 
                : 'text-primary-600 hover:bg-primary-50'
            }`}
          >
            All Products
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category._id || category.name}>
            <Link
              to={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className={`block py-2.5 px-4 rounded-lg transition-all duration-300 ${
                currentCategory === category.name.toLowerCase().replace(/\s+/g, '-')
                  ? 'bg-gold-500 text-primary-950 font-medium' 
                  : 'text-primary-600 hover:bg-primary-50'
              }`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CategoryFilter