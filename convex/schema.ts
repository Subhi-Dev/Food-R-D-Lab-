import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// Reusable validators
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

const testResultValidator = v.object({
  parameter: v.string(),
  method: v.string(),
  targetRange: v.string(),
  min: v.number(),
  max: v.number(),
  actualValue: v.number(),
  unit: v.string()
})

export default defineSchema({
  projects: defineTable({
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
  }),

  inventoryItems: defineTable({
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
    usedIn: v.array(
      v.object({
        id: v.string(),
        name: v.string()
      })
    )
  }),

  labReports: defineTable({
    projectId: v.string(),
    projectName: v.string(),
    version: v.string(),
    lotNumber: v.string(),
    date: v.string(),
    status: v.union(
      v.literal('Approved'),
      v.literal('Pending'),
      v.literal('Failed')
    ),
    leadChemist: v.string(),
    sampleType: v.string(),
    hash: v.string(),
    results: v.array(testResultValidator)
  }),

  equipment: defineTable({
    name: v.string(),
    status: v.union(
      v.literal('Available'),
      v.literal('In Use'),
      v.literal('Reserved')
    ),
    meta: v.string(),
    user: v.optional(v.string()),
    type: v.union(
      v.literal('ph'),
      v.literal('mixer'),
      v.literal('incubator'),
      v.literal('viscometer')
    )
  }),

  calendarEvents: defineTable({
    title: v.string(),
    subTitle: v.optional(v.string()),
    day: v.string(),
    startHour: v.number(),
    duration: v.number(),
    type: v.union(
      v.literal('monitoring'),
      v.literal('panel'),
      v.literal('testing'),
      v.literal('general'),
      v.literal('mixing')
    ),
    projectId: v.optional(v.string())
  }),

  agendaTasks: defineTable({
    time: v.string(),
    title: v.string(),
    location: v.optional(v.string()),
    status: v.union(v.literal('done'), v.literal('now'), v.literal('upcoming')),
    attachment: v.optional(v.string())
  })
})
