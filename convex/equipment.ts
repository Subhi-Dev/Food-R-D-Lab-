import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('equipment').collect()
  }
})

export const updateStatus = mutation({
  args: {
    id: v.id('equipment'),
    status: v.union(
      v.literal('Available'),
      v.literal('In Use'),
      v.literal('Reserved')
    ),
    meta: v.optional(v.string()),
    user: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    const cleanUpdates: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value
      }
    }
    await ctx.db.patch(id, cleanUpdates)
    return id
  }
})
