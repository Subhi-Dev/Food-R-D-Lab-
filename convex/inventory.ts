import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('inventoryItems').collect()
  }
})

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.string(),
    batchId: v.string(),
    stock: v.number(),
    unit: v.string(),
    stockStatus: v.union(v.literal('ok'), v.literal('low')),
    expiryDate: v.string(),
    expiryStatus: v.union(v.literal('ok'), v.literal('expiring')),
    expiryDays: v.optional(v.number()),
    usedIn: v.array(v.object({ id: v.string(), name: v.string() }))
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('inventoryItems', args)
  }
})

export const update = mutation({
  args: {
    id: v.id('inventoryItems'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    batchId: v.optional(v.string()),
    stock: v.optional(v.number()),
    unit: v.optional(v.string()),
    stockStatus: v.optional(v.union(v.literal('ok'), v.literal('low'))),
    expiryDate: v.optional(v.string()),
    expiryStatus: v.optional(v.union(v.literal('ok'), v.literal('expiring'))),
    expiryDays: v.optional(v.number()),
    usedIn: v.optional(v.array(v.object({ id: v.string(), name: v.string() })))
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
