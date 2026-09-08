'use client'

import axios from 'axios'
import { supabase } from '@/lib/supabaseClient'

async function getHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  return session ? { Authorization: `Bearer ${session.access_token}` } : {}
}

async function http(method, path, data) {
  const headers = await getHeaders()
  const r = await axios({ method, url: `/api${path}`, data, headers })
  return { data: r.data }
}

function buildPath(rawUrl) {
  const [path, qs] = rawUrl.split('?')
  const parts = path.replace(/^\//, '').split('/')
  return { parts, qs: qs ? `?${qs}` : '' }
}

const api = {
  get(url) {
    const { parts, qs } = buildPath(url)
    const [resource, id, sub] = parts

    // GET /reviews/:productId → /reviews/product/:productId
    if (resource === 'reviews' && id) {
      return http('get', `/reviews/product/${id}${qs}`)
    }

    if (id) return http('get', `/${resource}/${id}${sub ? '/' + sub : ''}${qs}`)
    return http('get', `/${resource}${qs}`)
  },

  post(url, body = {}) {
    const { parts } = buildPath(url)
    const [resource, sub, id] = parts

    // POST /reviews { productId } → /reviews/product/:productId
    if (resource === 'reviews') {
      return http('post', `/reviews/product/${body.productId}`, body)
    }

    // POST /customers/wishlist/:productId
    if (resource === 'customers' && sub === 'wishlist') {
      return http('post', `/customers/wishlist/${id}`, body)
    }

    return http('post', `/${parts.join('/')}`, body)
  },

  put(url, body = {}) {
    const { parts } = buildPath(url)
    const [resource, id] = parts

    // PUT /orders/:id → /orders/:id/status
    if (resource === 'orders' && id) {
      return http('put', `/orders/${id}/status`, body)
    }

    // PUT /coupons/:id → /coupons/:id/toggle
    if (resource === 'coupons' && id) {
      return http('put', `/coupons/${id}/toggle`, body)
    }

    return http('put', `/${resource}/${id}`, body)
  },

  patch(url, body = {}) {
    const { parts } = buildPath(url)
    return http('patch', `/${parts.join('/')}`, body)
  },

  delete(url) {
    const { parts } = buildPath(url)
    return http('delete', `/${parts.join('/')}`)
  },
}

export default api
