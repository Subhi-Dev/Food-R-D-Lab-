import { query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('labReports').collect()
  }
})

export const getByProject = query({
  args: { projectId: v.string() },
  handler: async (ctx, args) => {
    const reports = await ctx.db.query('labReports').collect()
    return reports.filter((r) => r.projectId === args.projectId)
  }
})
