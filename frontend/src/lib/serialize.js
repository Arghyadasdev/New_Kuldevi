// Converts Supabase/Postgres rows (id, snake_case columns) into the shape
// the frontend already expects from the old Mongoose API (_id, camelCase),
// so no frontend code needs to change.

function snakeToCamel(key) {
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

export function toCamel(row) {
  if (row == null) return row
  const { id, ...rest } = row
  const out = id !== undefined ? { _id: id } : {}
  for (const [key, value] of Object.entries(rest)) {
    out[snakeToCamel(key)] = value
  }
  return out
}

export function toCamelList(rows) {
  return (rows || []).map(toCamel)
}
