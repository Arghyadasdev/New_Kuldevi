import { NextResponse } from 'next/server'
import { supabaseForRequest, requireCustomer } from '@/lib/supabaseServer'
import { toCamel, toCamelList } from '@/lib/serialize'

// Get reviews for a product
export async function GET(request, { params }) {
  try {
    const { productId } = await params
    const supabase = supabaseForRequest(request)
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json(toCamelList(data))
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// Create a new review
export async function POST(request, { params }) {
  try {
    const { user, error: authError } = await requireCustomer(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const { productId } = await params
    const { rating, comment } = await request.json()
    const supabase = supabaseForRequest(request)

    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('customer_id', user.id)
      .maybeSingle()
    if (existingReview) {
      return NextResponse.json({ message: 'You have already reviewed this product' }, { status: 400 })
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        product_id: productId,
        customer_id: user.id,
        customer_name: user.user_metadata?.name || user.email,
        rating: Number(rating),
        comment,
      })
      .select()
      .single()
    if (error) throw error

    // Update Product average rating and num reviews
    const { data: allReviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)
    if (reviewsError) throw reviewsError
    const numReviews = allReviews.length
    const averageRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / numReviews

    await supabase
      .from('products')
      .update({ average_rating: parseFloat(averageRating.toFixed(1)), num_reviews: numReviews })
      .eq('id', productId)

    return NextResponse.json(toCamel(review), { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
