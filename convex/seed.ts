import { mutation } from './_generated/server'

/**
 * Seed function to populate the database with initial mock data.
 * Idempotent — checks if data already exists before inserting.
 * Run once from the Convex dashboard or via a temporary UI button.
 */
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingProjects = await ctx.db.query('projects').first()
    if (existingProjects) {
      return { status: 'already_seeded' }
    }

    // --- Projects ---
    await ctx.db.insert('projects', {
      name: 'Oat Milk Barista Blend',
      version: '3.1',
      status: 'Testing',
      updatedAt: '2 hours ago',
      lead: 'S. Chen',
      progress: 65,
      description: 'High stability foam formulation for coffee applications.',
      category: 'Dairy Alternatives',
      processingMethod: 'High-Shear Mixing / UHT',
      processingTemp: 135,
      processingTime: '4 sec (UHT)',
      targetTexture: 'Silky, Micro-foam capable',
      recentLabResults: [
        { parameter: 'Foam Stability', value: '4 mins', status: 'pass' },
        { parameter: 'pH', value: '7.2', status: 'pass' },
        { parameter: 'Separation', value: 'None observed', status: 'pass' }
      ],
      ingredients: [
        { id: 'i1', name: 'Water', weight: 850, costPerKg: 0.05 },
        { id: 'i2', name: 'Rolled Oats', weight: 120, costPerKg: 1.2 },
        { id: 'i3', name: 'Rapeseed Oil', weight: 25, costPerKg: 2.5 },
        {
          id: 'i4',
          name: 'Dipotassium Phosphate',
          weight: 3.5,
          costPerKg: 15.0
        },
        {
          id: 'i5',
          name: 'Calcium Carbonate',
          weight: 1.5,
          costPerKg: 8.0
        }
      ],
      previousVersionIngredients: [
        { id: 'i1', name: 'Water', weight: 860 },
        { id: 'i2', name: 'Rolled Oats', weight: 110 },
        { id: 'i3', name: 'Rapeseed Oil', weight: 25 },
        { id: 'i4', name: 'Dipotassium Phosphate', weight: 3.0 },
        { id: 'i5', name: 'Calcium Carbonate', weight: 2.0 }
      ]
    })

    await ctx.db.insert('projects', {
      name: 'Spicy Sriracha Alt-Meat',
      version: '1.0',
      status: 'Prototype',
      updatedAt: '1 day ago',
      lead: 'M. Rossi',
      progress: 25,
      description: 'Spicy texturized vegetable protein patty.',
      category: 'Alternative Proteins',
      processingMethod: 'Extrusion',
      processingTemp: 160,
      processingTime: '45 mins',
      targetTexture: 'Fibrous, chewy bite',
      recentLabResults: [
        {
          parameter: 'Texture Profile Analysis',
          value: 'Too soft',
          status: 'fail'
        },
        { parameter: 'Moisture', value: '62%', status: 'pass' }
      ],
      ingredients: [
        { id: 'i1', name: 'TVP (Soy)', weight: 400 },
        { id: 'i2', name: 'Water', weight: 500 },
        { id: 'i3', name: 'Methylcellulose', weight: 15 },
        { id: 'i4', name: 'Sriracha Powder', weight: 20 }
      ]
    })

    await ctx.db.insert('projects', {
      name: 'Gluten-Free Brioche',
      version: '5.2',
      status: 'Approved',
      updatedAt: '3 days ago',
      lead: 'J. Doe',
      progress: 100,
      description: 'Rice flour based brioche with xanthan gum.',
      category: 'Bakery',
      processingMethod: 'Baking',
      processingTemp: 190,
      processingTime: '25 mins',
      targetTexture: 'Airy, soft crumb',
      recentLabResults: [
        { parameter: 'Specific Volume', value: '4.5 mL/g', status: 'pass' },
        { parameter: 'Crumb Firmness', value: 'Soft', status: 'pass' }
      ],
      ingredients: [
        { id: 'i1', name: 'Rice Flour', weight: 500 },
        { id: 'i2', name: 'Potato Starch', weight: 150 },
        { id: 'i3', name: 'Eggs', weight: 200 },
        { id: 'i4', name: 'Butter', weight: 150 }
      ]
    })

    await ctx.db.insert('projects', {
      name: 'Low-Sugar Granola',
      version: '2.0',
      status: 'Testing',
      updatedAt: '4 days ago',
      lead: 'K. Larson',
      progress: 80,
      description: 'Keto-friendly granola with monkfruit sweetener.',
      category: 'Snack Innovation',
      processingMethod: 'Baking / Dehydration',
      processingTemp: 150,
      processingTime: '30 mins',
      targetTexture: 'Crunchy, non-sticky',
      recentLabResults: [
        { parameter: 'Water Activity', value: '0.3 aw', status: 'pass' },
        { parameter: 'Sugar Content', value: '2g/100g', status: 'pass' }
      ],
      ingredients: [
        { id: 'i1', name: 'Almonds', weight: 300 },
        { id: 'i2', name: 'Coconut Flakes', weight: 200 },
        { id: 'i3', name: 'Pumpkin Seeds', weight: 150 },
        { id: 'i4', name: 'Monkfruit Extract', weight: 5 }
      ]
    })

    await ctx.db.insert('projects', {
      name: 'Plant-Based Yogurt',
      version: '2.4',
      status: 'Review',
      updatedAt: '5 days ago',
      lead: 'S. Chen',
      progress: 90,
      description: 'Coconut based yogurt with probiotic culture.',
      category: 'Dairy Alternatives',
      processingMethod: 'Fermentation',
      processingTemp: 42,
      processingTime: '8 hours',
      targetTexture: 'Smooth, viscous gel',
      recentLabResults: [
        { parameter: 'Viscosity', value: '2100 cP', status: 'pass' },
        { parameter: 'Acidity', value: 'pH 4.3', status: 'pass' }
      ],
      ingredients: [
        { id: 'i1', name: 'Coconut Milk', weight: 950 },
        { id: 'i2', name: 'Tapioca Starch', weight: 30 },
        { id: 'i3', name: 'Agar Agar', weight: 5 },
        { id: 'i4', name: 'Probiotic Culture', weight: 15 }
      ]
    })

    // --- Inventory Items ---
    await ctx.db.insert('inventoryItems', {
      name: 'Xanthan Gum',
      description: 'Standard Mesh 200',
      category: 'Stabilizers',
      batchId: 'XG-2023-001',
      stock: 4.5,
      unit: 'kg',
      stockStatus: 'ok',
      expiryDate: 'Dec 01, 2024',
      expiryStatus: 'ok',
      usedIn: [{ id: '1', name: 'Oat Milk v2' }]
    })

    await ctx.db.insert('inventoryItems', {
      name: 'Stevia Extract',
      description: 'Reb-A 98%',
      category: 'Sweeteners',
      batchId: 'ST-998-A',
      stock: 0.2,
      unit: 'kg',
      stockStatus: 'low',
      expiryDate: 'Jan 15, 2025',
      expiryStatus: 'ok',
      usedIn: [{ id: '5', name: 'Plant-based Yogurt' }]
    })

    await ctx.db.insert('inventoryItems', {
      name: 'Almond Base',
      description: 'Organic Raw',
      category: 'Bases',
      batchId: 'AL-ORG-55',
      stock: 12.0,
      unit: 'L',
      stockStatus: 'ok',
      expiryDate: 'Oct 30, 2023',
      expiryStatus: 'expiring',
      expiryDays: 3,
      usedIn: [
        { id: '6', name: 'Keto Ice Cream' },
        { id: '7', name: 'Almond Milk' }
      ]
    })

    await ctx.db.insert('inventoryItems', {
      name: 'L. Acidophilus',
      description: 'Freeze Dried',
      category: 'Cultures',
      batchId: 'LA-FD-004',
      stock: 0.8,
      unit: 'kg',
      stockStatus: 'ok',
      expiryDate: 'Mar 12, 2025',
      expiryStatus: 'ok',
      usedIn: [{ id: '8', name: 'Probiotic Shot' }]
    })

    // --- Lab Reports ---
    await ctx.db.insert('labReports', {
      projectId: '5',
      projectName: 'Plant-Based Yogurt v2.0',
      version: '2.0',
      lotNumber: '892-A',
      date: 'Oct 24, 2023',
      status: 'Approved',
      leadChemist: 'Dr. Sarah Chen',
      sampleType: 'Finished Product',
      hash: '8f9a...2b1c',
      results: [
        {
          parameter: 'pH Level',
          method: 'AOAC 981.12',
          targetRange: '4.2 - 4.4',
          min: 4.2,
          max: 4.4,
          actualValue: 4.32,
          unit: ''
        },
        {
          parameter: 'Brix (Sugar)',
          method: 'Refractometry',
          targetRange: '12.0 - 14.0',
          min: 12.0,
          max: 14.0,
          actualValue: 13.5,
          unit: ''
        },
        {
          parameter: 'Viscosity',
          method: 'Brookfield',
          targetRange: '1900 - 2100',
          min: 1900,
          max: 2100,
          actualValue: 1950,
          unit: 'cP'
        }
      ]
    })

    await ctx.db.insert('labReports', {
      projectId: '1',
      projectName: 'Oat Milk Barista Blend',
      version: '3.1',
      lotNumber: '891-C',
      date: 'Oct 23, 2023',
      status: 'Approved',
      leadChemist: 'S. Chen',
      sampleType: 'Finished Product',
      hash: '7e2b...9x2d',
      results: [
        {
          parameter: 'pH Level',
          method: 'AOAC 981.12',
          targetRange: '7.0 - 7.5',
          min: 7.0,
          max: 7.5,
          actualValue: 7.2,
          unit: ''
        },
        {
          parameter: 'Protein',
          method: 'Kjeldahl',
          targetRange: '2.5 - 3.0',
          min: 2.5,
          max: 3.0,
          actualValue: 2.8,
          unit: 'g/100ml'
        }
      ]
    })

    await ctx.db.insert('labReports', {
      projectId: '6',
      projectName: 'Almond Protein Shake',
      version: '1.2',
      lotNumber: '888-B',
      date: 'Oct 22, 2023',
      status: 'Pending',
      leadChemist: 'M. Rossi',
      sampleType: 'Prototype',
      hash: '1a5c...4r9e',
      results: [
        {
          parameter: 'Micro-Bio',
          method: 'Plate Count',
          targetRange: '< 100',
          min: 0,
          max: 100,
          actualValue: 45,
          unit: 'CFU/g'
        }
      ]
    })

    await ctx.db.insert('labReports', {
      projectId: '7',
      projectName: 'Soy Isolate Powder',
      version: '4.0',
      lotNumber: '885-X',
      date: 'Oct 21, 2023',
      status: 'Failed',
      leadChemist: 'J. Doe',
      sampleType: 'Raw Material',
      hash: '9k3p...5m1q',
      results: [
        {
          parameter: 'Moisture',
          method: 'Oven Dry',
          targetRange: '0.0 - 5.0',
          min: 0,
          max: 5.0,
          actualValue: 6.2,
          unit: '%'
        },
        {
          parameter: 'Texture',
          method: 'Particle Size',
          targetRange: '80 - 100',
          min: 80,
          max: 100,
          actualValue: 85,
          unit: 'mesh'
        }
      ]
    })

    // --- Equipment ---
    await ctx.db.insert('equipment', {
      name: 'pH Meter 01',
      status: 'Available',
      meta: 'Last calibrated: Today 8am',
      type: 'ph'
    })
    await ctx.db.insert('equipment', {
      name: 'High-Shear Mixer B',
      status: 'In Use',
      meta: 'Lab 4',
      user: 'John D.',
      type: 'mixer'
    })
    await ctx.db.insert('equipment', {
      name: 'Incubator 3',
      status: 'Reserved',
      meta: 'Reserved for 2:00 PM',
      type: 'incubator'
    })
    await ctx.db.insert('equipment', {
      name: 'Viscometer',
      status: 'Available',
      meta: 'Available all day',
      type: 'viscometer'
    })

    // --- Calendar Events ---
    await ctx.db.insert('calendarEvents', {
      title: 'pH Monitoring',
      subTitle: 'Oat Milk v3.1',
      day: 'Tue',
      startHour: 9,
      duration: 2,
      type: 'monitoring',
      projectId: '1'
    })
    await ctx.db.insert('calendarEvents', {
      title: 'Check-in',
      day: 'Thu',
      startHour: 9,
      duration: 1,
      type: 'general'
    })
    await ctx.db.insert('calendarEvents', {
      title: 'Sensory Panel',
      subTitle: 'Plant-Based Yogurt',
      day: 'Tue',
      startHour: 11.5,
      duration: 1.5,
      type: 'panel',
      projectId: '5'
    })
    await ctx.db.insert('calendarEvents', {
      title: 'Team Lunch',
      day: 'Fri',
      startHour: 12,
      duration: 1,
      type: 'general'
    })
    await ctx.db.insert('calendarEvents', {
      title: 'Shelf-life Testing',
      subTitle: 'Batch #402',
      day: 'Wed',
      startHour: 14,
      duration: 2,
      type: 'testing',
      projectId: '2'
    })

    // --- Agenda Tasks ---
    await ctx.db.insert('agendaTasks', {
      time: '08:00 AM',
      title: 'Calibrate pH Sensor',
      status: 'done'
    })
    await ctx.db.insert('agendaTasks', {
      time: '09:45 AM',
      title: 'Review Oat Milk v3.1 Data',
      location: 'Lab 4 - Workstation 2',
      status: 'now'
    })
    await ctx.db.insert('agendaTasks', {
      time: '11:30 AM',
      title: 'Prepare Sensory Booths',
      location: 'Room 102',
      status: 'upcoming'
    })
    await ctx.db.insert('agendaTasks', {
      time: '04:00 PM',
      title: 'Submit Lab Safety Report',
      status: 'upcoming',
      attachment: 'Template.pdf'
    })

    return { status: 'seeded' }
  }
})
