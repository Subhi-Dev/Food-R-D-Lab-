import { query } from './_generated/server'

export const listEvents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('calendarEvents').collect()
  }
})

export const listAgenda = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('agendaTasks').collect()
  }
})
