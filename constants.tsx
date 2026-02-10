import { Project, ProjectStatus, InventoryItem, LabReport, Equipment, CalendarEvent, AgendaTask } from './types';
import { Beaker, Users, Activity, AlertTriangle } from 'lucide-react';

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Oat Milk Barista Blend',
    version: '3.1',
    status: ProjectStatus.TESTING,
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
      { id: 'i2', name: 'Rolled Oats', weight: 120, costPerKg: 1.20 },
      { id: 'i3', name: 'Rapeseed Oil', weight: 25, costPerKg: 2.50 },
      { id: 'i4', name: 'Dipotassium Phosphate', weight: 3.5, costPerKg: 15.00 },
      { id: 'i5', name: 'Calcium Carbonate', weight: 1.5, costPerKg: 8.00 },
    ],
    previousVersionIngredients: [
      { id: 'i1', name: 'Water', weight: 860 },
      { id: 'i2', name: 'Rolled Oats', weight: 110 },
      { id: 'i3', name: 'Rapeseed Oil', weight: 25 },
      { id: 'i4', name: 'Dipotassium Phosphate', weight: 3.0 },
      { id: 'i5', name: 'Calcium Carbonate', weight: 2.0 },
    ]
  },
  {
    id: '2',
    name: 'Spicy Sriracha Alt-Meat',
    version: '1.0',
    status: ProjectStatus.PROTOTYPE,
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
        { parameter: 'Texture Profile Analysis', value: 'Too soft', status: 'fail' },
        { parameter: 'Moisture', value: '62%', status: 'pass' }
    ],
    ingredients: [
      { id: 'i1', name: 'TVP (Soy)', weight: 400 },
      { id: 'i2', name: 'Water', weight: 500 },
      { id: 'i3', name: 'Methylcellulose', weight: 15 },
      { id: 'i4', name: 'Sriracha Powder', weight: 20 },
    ]
  },
  {
    id: '3',
    name: 'Gluten-Free Brioche',
    version: '5.2',
    status: ProjectStatus.APPROVED,
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
      { id: 'i4', name: 'Butter', weight: 150 },
    ]
  },
  {
    id: '4',
    name: 'Low-Sugar Granola',
    version: '2.0',
    status: ProjectStatus.TESTING,
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
      { id: 'i4', name: 'Monkfruit Extract', weight: 5 },
    ]
  },
    {
    id: '5',
    name: 'Plant-Based Yogurt',
    version: '2.4',
    status: ProjectStatus.REVIEW,
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
      { id: 'i4', name: 'Probiotic Culture', weight: 15 },
    ]
  },
];

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  [ProjectStatus.TESTING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [ProjectStatus.PROTOTYPE]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ProjectStatus.APPROVED]: 'bg-green-100 text-green-800 border-green-200',
  [ProjectStatus.REVIEW]: 'bg-purple-100 text-purple-800 border-purple-200',
  [ProjectStatus.ON_HOLD]: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const MOCK_STATS = [
  { label: 'Active Projects', value: '12', subValue: 'vs 10 last month', trend: 'up' as const, icon: <Beaker size={20} /> },
  { label: 'Lab Capacity', value: '78%', alert: true, icon: <Activity size={20} /> },
  { label: 'Pending Approvals', value: '4', subValue: 'Needs review', icon: <AlertTriangle size={20} /> },
  { label: 'Next Milestone', value: 'Vegan Cheese v4.2', subValue: 'Due Tomorrow', icon: <Users size={20} /> },
];

export const MOCK_INVENTORY_STATS = [
  { label: 'Total Raw Materials', value: '1,240', unit: 'items', color: 'blue' },
  { label: 'Low Stock Alerts', value: '12', unit: 'items', color: 'orange' },
  { label: 'Expiring Soon', value: '5', unit: 'batches', color: 'red' },
];

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'inv-1',
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
  },
  {
    id: 'inv-2',
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
  },
  {
    id: 'inv-3',
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
    usedIn: [{ id: '6', name: 'Keto Ice Cream' }, { id: '7', name: 'Almond Milk' }]
  },
  {
    id: 'inv-4',
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
  }
];

export const MOCK_LAB_REPORTS: LabReport[] = [
  {
    id: 'LR-2023-892',
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
      { parameter: 'pH Level', method: 'AOAC 981.12', targetRange: '4.2 - 4.4', min: 4.2, max: 4.4, actualValue: 4.32, unit: '' },
      { parameter: 'Brix (Sugar)', method: 'Refractometry', targetRange: '12.0 - 14.0', min: 12.0, max: 14.0, actualValue: 13.5, unit: '' },
      { parameter: 'Viscosity', method: 'Brookfield', targetRange: '1900 - 2100', min: 1900, max: 2100, actualValue: 1950, unit: 'cP' },
    ]
  },
  {
    id: 'LR-2023-891',
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
      { parameter: 'pH Level', method: 'AOAC 981.12', targetRange: '7.0 - 7.5', min: 7.0, max: 7.5, actualValue: 7.2, unit: '' },
      { parameter: 'Protein', method: 'Kjeldahl', targetRange: '2.5 - 3.0', min: 2.5, max: 3.0, actualValue: 2.8, unit: 'g/100ml' },
    ]
  },
  {
    id: 'LR-2023-888',
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
      { parameter: 'Micro-Bio', method: 'Plate Count', targetRange: '< 100', min: 0, max: 100, actualValue: 45, unit: 'CFU/g' },
    ]
  },
  {
    id: 'LR-2023-885',
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
      { parameter: 'Moisture', method: 'Oven Dry', targetRange: '0.0 - 5.0', min: 0, max: 5.0, actualValue: 6.2, unit: '%' },
      { parameter: 'Texture', method: 'Particle Size', targetRange: '80 - 100', min: 80, max: 100, actualValue: 85, unit: 'mesh' },
    ]
  }
];

export const MOCK_REPORT_STATS = [
  { label: 'Total Tests Conducted', value: '1,248', sub: '+12% vs last month', icon: <Beaker size={20} className="text-blue-600"/> },
  { label: 'Pending Reviews', value: '3', sub: 'Action Required', alert: true, icon: <AlertTriangle size={20} className="text-orange-600"/> },
];

export const MOCK_EQUIPMENT: Equipment[] = [
  { id: 'eq1', name: 'pH Meter 01', status: 'Available', meta: 'Last calibrated: Today 8am', type: 'ph' },
  { id: 'eq2', name: 'High-Shear Mixer B', status: 'In Use', meta: 'Lab 4', user: 'John D.', type: 'mixer' },
  { id: 'eq3', name: 'Incubator 3', status: 'Reserved', meta: 'Reserved for 2:00 PM', type: 'incubator' },
  { id: 'eq4', name: 'Viscometer', status: 'Available', meta: 'Available all day', type: 'viscometer' },
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'ev1', title: 'pH Monitoring', subTitle: 'Oat Milk v3.1', day: 'Tue', startHour: 9, duration: 2, type: 'monitoring', projectId: '1' },
  { id: 'ev2', title: 'Check-in', day: 'Thu', startHour: 9, duration: 1, type: 'general' },
  { id: 'ev3', title: 'Sensory Panel', subTitle: 'Plant-Based Yogurt', day: 'Tue', startHour: 11.5, duration: 1.5, type: 'panel', projectId: '5' },
  { id: 'ev4', title: 'Team Lunch', day: 'Fri', startHour: 12, duration: 1, type: 'general' },
  { id: 'ev5', title: 'Shelf-life Testing', subTitle: 'Batch #402', day: 'Wed', startHour: 14, duration: 2, type: 'testing', projectId: '2' },
];

export const MOCK_AGENDA: AgendaTask[] = [
  { id: 'a1', time: '08:00 AM', title: 'Calibrate pH Sensor', status: 'done' },
  { id: 'a2', time: '09:45 AM', title: 'Review Oat Milk v3.1 Data', location: 'Lab 4 - Workstation 2', status: 'now' },
  { id: 'a3', time: '11:30 AM', title: 'Prepare Sensory Booths', location: 'Room 102', status: 'upcoming' },
  { id: 'a4', time: '04:00 PM', title: 'Submit Lab Safety Report', status: 'upcoming', attachment: 'Template.pdf' },
];