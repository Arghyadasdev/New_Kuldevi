import { NextResponse } from 'next/server'
import { supabaseForRequest, requireCustomer } from '@/lib/supabaseServer'

// Delete a review (Customer can delete their own, Admin can delete any - simplified for now)
export async function DELETE(request, { params }) {
  try {
    const { user, error: authError } = await requireCustomer(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const { id } = await params
    const supabase = supabaseForRequest(request)

    const { data: review, error: findError } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (findError) throw findError
    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 })
    }
    if (review.customer_id !== user.id) {
      return NextResponse.json({ message: 'Not authorized to delete this review' }, { status: 403 })
    }

    const productId = review.product_id
    const { error: deleteError } = await supabase.from('reviews').delete().eq('id', id)
    if (deleteError) throw deleteError

    // Update Product average rating and num reviews
    const { data: remaining, error: remainingError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)
    if (remainingError) throw remainingError
    const numReviews = remaining.length
    const averageRating = numReviews > 0 ? remaining.reduce((acc, r) => acc + r.rating, 0) / numReviews : 0

    await supabase
      .from('products')
      .update({ average_rating: parseFloat(averageRating.toFixed(1)), num_reviews: numReviews })
      .eq('id', productId)

    return NextResponse.json({ message: 'Review deleted' })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
