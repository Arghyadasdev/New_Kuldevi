import { Suspense } from 'react'
import ProductsView from '../../products/ProductsView'

export default function CategoryProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsView />
    </Suspense>
  )
}
