import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// --- Queries ---

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('projects').collect()
  }
})

export const get = query({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  }
})

// --- Mutations ---

const ingredientValidator = v.object({
  id: v.string(),
  name: v.string(),
  weight: v.number(),
  percentage: v.optional(v.number()),
  costPerKg: v.optional(v.number())
})

const labTestResultValidator = v.object({
  parameter: v.string(),
  value: v.string(),
  status: v.union(v.literal('pass'), v.literal('fail'), v.literal('pending'))
})

const recipeStepValidator = v.object({
  id: v.string(),
  type: v.union(
    v.literal('weighing'),
    v.literal('timer'),
    v.literal('process')
  ),
  label: v.string(),
  notes: v.optional(v.string()),
  isCompleted: v.boolean(),
  ingredientId: v.optional(v.string()),
  expectedWeight: v.optional(v.number()),
  actualWeight: v.optional(v.number()),
  tolerance: v.optional(v.number()),
  durationSeconds: v.optional(v.number()),
  processTemp: v.optional(v.number()),
  processSpeed: v.optional(v.string())
})

const recipePhaseValidator = v.object({
  id: v.string(),
  name: v.string(),
  color: v.union(
    v.literal('blue'),
    v.literal('green'),
    v.literal('orange'),
    v.literal('purple'),
    v.literal('rose'),
    v.literal('slate')
  ),
  steps: v.array(recipeStepValidator)
})

export const create = mutation({
  args: {
    name: v.string(),
    version: v.string(),
    status: v.union(
      v.literal('Testing'),
      v.literal('Prototype'),
      v.literal('Approved'),
      v.literal('Review'),
      v.literal('On Hold')
    ),
    updatedAt: v.string(),
    lead: v.string(),
    progress: v.number(),
    description: v.string(),
    ingredients: v.array(ingredientValidator),
    previousVersionIngredients: v.optional(v.array(ingredientValidator)),
    category: v.optional(v.string()),
    processingMethod: v.optional(v.string()),
    targetOutcome: v.optional(v.string()),
    nutritionalGoal: v.optional(v.string()),
    testingRequirements: v.optional(v.array(v.string())),
    processingTemp: v.optional(v.number()),
    processingTime: v.optional(v.string()),
    targetTexture: v.optional(v.string()),
    recentLabResults: v.optional(v.array(labTestResultValidator)),
    phases: v.optional(v.array(recipePhaseValidator))
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('projects', args)
    return id
  }
})

export const update = mutation({
  args: {
    id: v.id('projects'),
    name: v.optional(v.string()),
    version: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal('Testing'),
        v.literal('Prototype'),
        v.literal('Approved'),
        v.literal('Review'),
        v.literal('On Hold')
      )
    ),
    updatedAt: v.optional(v.string()),
    lead: v.optional(v.string()),
    progress: v.optional(v.number()),
    description: v.optional(v.string()),
    ingredients: v.optional(v.array(ingredientValidator)),
    previousVersionIngredients: v.optional(v.array(ingredientValidator)),
    category: v.optional(v.string()),
    processingMethod: v.optional(v.string()),
    targetOutcome: v.optional(v.string()),
    nutritionalGoal: v.optional(v.string()),
    testingRequirements: v.optional(v.array(v.string())),
    processingTemp: v.optional(v.number()),
    processingTime: v.optional(v.string()),
    targetTexture: v.optional(v.string()),
    recentLabResults: v.optional(v.array(labTestResultValidator)),
    phases: v.optional(v.array(recipePhaseValidator))
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    // Filter out undefined values
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

export const remove = mutation({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  }
})
