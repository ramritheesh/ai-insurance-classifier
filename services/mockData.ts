import { ClaimRecord } from '../types';
import { loadCSVData, calculateDatasetStats } from './csvService';

// This will be populated when CSV loads
let cachedData: ClaimRecord[] | null = null;
let cachedStats: ReturnType<typeof calculateDatasetStats> | null = null;

/**
 * Load initial data from CSV file
 * Falls back to empty array if CSV fails to load
 */
export async function getInitialData(): Promise<ClaimRecord[]> {
  if (cachedData) {
    return cachedData;
  }
  
  try {
    cachedData = await loadCSVData();
    return cachedData;
  } catch (error) {
    console.error('Failed to load CSV data, using empty array:', error);
    return [];
  }
}

/**
 * Get dataset statistics from loaded CSV data
 */
export function getDatasetStats(data: ClaimRecord[]) {
  if (cachedStats && cachedData === data) {
    return cachedStats;
  }
  
  cachedStats = calculateDatasetStats(data);
  return cachedStats;
}

// For backward compatibility, export empty array initially
// This will be replaced when CSV loads
export const INITIAL_DATA: ClaimRecord[] = [];

export const COVERAGE_DESCRIPTIONS: Record<string, string> = {
  'AD': 'Auto Damage (Collision/Property)',
  'GB': 'General Liability / Bodily Injury',
  'PA': 'Product Liability / Personal Accident',
  'AB': 'Auto Bodily Injury',
  'AL': 'Auto Liability (Property Damage)',
  'RC': 'Residential/Commercial Property',
  'GD': 'General Damage / Environmental',
  'AN': 'Auto / Pedestrian Incident'
};

export interface SchemaDefinition {
  code: string;
  title: string;
  description: string;
  example: string;
  count: number;
  percentage: number;
}

// Coverage code titles and descriptions
const COVERAGE_TITLES: Record<string, string> = {
  'AD': 'Auto Damage',
  'GB': 'General Liability / Bodily Injury',
  'PA': 'Product Liability',
  'AB': 'Auto Bodily Injury',
  'AL': 'Auto Liability (Property)',
  'RC': 'Residential/Commercial',
  'GD': 'General Damage / Environmental',
  'AN': 'Auto Negligence / Pedestrian'
};

const COVERAGE_DESCRIPTIONS_DETAILED: Record<string, string> = {
  'AD': 'Vehicle-to-vehicle collisions, hitting fixed objects, rear-ending, or backing into things.',
  'GB': 'Accidents where a person gets hurt on a property (not in a car), such as slip and falls.',
  'PA': 'Injuries caused by a specific product or food item defect.',
  'AB': 'When a person inside a car gets hurt during a crash.',
  'AL': 'When a vehicle causes damage to property (not another car) or during loading/unloading.',
  'RC': 'Damage to a building or contents (not caused by a car), often appliance failure.',
  'GD': 'Damage caused by chemicals, fumes, or environmental factors.',
  'AN': 'Incidents specifically involving pedestrians or bicycles.'
};

const COVERAGE_EXAMPLES: Record<string, string> = {
  'AD': 'THE IV WAS MERGING INTO A CONSTRUCTION ZONE WHEN IT REAR ENDED THE OV.',
  'GB': 'CLAIMANT ALLEGES SHE SUFFERED INJURIES IN AN ELEVATOR.',
  'PA': 'CLAIMANT ALLEGES SHE WAS BURNED FROM HOT TEA SHE ORDERED AFTER THE LID POPPED OFF.',
  'AB': 'IV PASSENGER SUSTAINED INJURIES, OV AND IV COLLIDED CAUSING IV TO HIT ANOTHER OV.',
  'AL': 'IV DRIVER WAS LOADING THE COMPACTOR AND FORGOT TO DISCONNECT THE HYDRAULIC LINES.',
  'RC': 'THE COMPRESSOR ON THE REFRIGERATOR BROKE CAUSING FOOD SPOILAGE.',
  'GD': 'MOSQUITO APPLICATION CAUSED INTERIOR PROPERTY DAMAGE THAT REQUIRED COMPLETE CLEANUP.',
  'AN': 'THE IV WAS MAKING A LEFT TURN WHEN A PEDESTRIAN RAN INTO THE P/S OF IV.'
};

/**
 * Generate DATASET_STATS from actual data
 */
export function generateDatasetStats(data: ClaimRecord[]) {
  const stats = calculateDatasetStats(data);
  
  // Enhance schema with titles, descriptions, and examples
  const enhancedSchema = stats.schema.map(item => ({
    ...item,
    title: COVERAGE_TITLES[item.code] || item.code,
    description: COVERAGE_DESCRIPTIONS_DETAILED[item.code] || 'No description available',
    example: COVERAGE_EXAMPLES[item.code] || 'No example available'
  }));
  
  return {
    total: stats.total,
    validationSplit: "20%",
    modelName: "Gemini 2.5-Flash",
    schema: enhancedSchema
  };
}

// Default/fallback dataset stats (used before CSV loads)
export const DATASET_STATS = {
  total: 0,
  validationSplit: "20%",
  modelName: "Gemini 2.5-Flash",
  schema: [] as SchemaDefinition[]
};