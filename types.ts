import React from 'react';

export interface Ingredient {
  id: string;
  name: string;
  weight: number; // in grams
  percentage?: number; // Calculated on the fly
  costPerKg?: number;
}

export enum ProjectStatus {
  TESTING = 'Testing',
  PROTOTYPE = 'Prototype',
  APPROVED = 'Approved',
  REVIEW = 'Review',
  ON_HOLD = 'On Hold'
}

export interface LabTestResult {
  parameter: string;
  value: string;
  status: 'pass' | 'fail' | 'pending';
}

// --- New Types for Formulation Engine ---
export type StepType = 'weighing' | 'timer' | 'process';
export type PhaseColor = 'blue' | 'green' | 'orange' | 'purple' | 'rose' | 'slate';

export interface RecipeStep {
  id: string;
  type: StepType;
  label: string; // e.g., "Add Water" or "Mix"
  notes?: string;
  isCompleted: boolean;
  
  // Weighing Specific
  ingredientId?: string;
  expectedWeight?: number;
  actualWeight?: number;
  tolerance?: number; // +/- %

  // Timer Specific
  durationSeconds?: number;
  
  // Process Specific
  processTemp?: number;
  processSpeed?: string;
}

export interface RecipePhase {
  id: string;
  name: string;
  color: PhaseColor;
  steps: RecipeStep[];
}
// ----------------------------------------

export interface Project {
  id: string;
  name: string;
  version: string;
  status: ProjectStatus;
  updatedAt: string;
  lead: string;
  progress: number;
  description: string;
  ingredients: Ingredient[];
  previousVersionIngredients?: Ingredient[]; // For version comparison
  // New fields for the Create Modal
  category?: string;
  processingMethod?: string;
  targetOutcome?: string;
  nutritionalGoal?: string;
  testingRequirements?: string[];
  
  // Specific R&D Specs for Details View
  processingTemp?: number; // Celsius
  processingTime?: string; 
  targetTexture?: string;
  recentLabResults?: LabTestResult[];

  // New Formulation Engine Data
  phases?: RecipePhase[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  ph?: number;
  temperature?: number;
  notes?: string;
}

export interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  alert?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  batchId: string;
  stock: number;
  unit: string;
  stockStatus: 'ok' | 'low';
  expiryDate: string;
  expiryStatus: 'ok' | 'expiring';
  expiryDays?: number;
  usedIn: { id: string; name: string }[];
}

export interface TestResult {
  parameter: string;
  method: string;
  targetRange: string;
  min: number;
  max: number;
  actualValue: number;
  unit: string;
}

export interface LabReport {
  id: string;
  projectId: string;
  projectName: string;
  version: string;
  lotNumber: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Failed';
  leadChemist: string;
  sampleType: string;
  hash: string;
  results: TestResult[];
}

export type EquipmentStatus = 'Available' | 'In Use' | 'Reserved';

export interface Equipment {
  id: string;
  name: string;
  status: EquipmentStatus;
  meta: string;
  user?: string;
  type: 'ph' | 'mixer' | 'incubator' | 'viscometer';
}

export interface CalendarEvent {
  id: string;
  title: string;
  subTitle?: string;
  day: string; // 'Mon', 'Tue', etc.
  startHour: number; // 24h format, e.g. 9.5 for 9:30
  duration: number; // hours
  type: 'monitoring' | 'panel' | 'testing' | 'general' | 'mixing';
  projectId?: string;
}

export interface AgendaTask {
  id: string;
  time: string;
  title: string;
  location?: string;
  status: 'done' | 'now' | 'upcoming';
  attachment?: string;
}