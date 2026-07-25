import { ClaimRecord } from '../types';

/**
 * Parse CSV line handling quoted fields that may contain commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current.trim());
  return result;
}

/**
 * Load and parse CSV file into ClaimRecord array
 */
export async function loadCSVData(): Promise<ClaimRecord[]> {
  try {
    // Fetch the CSV file
    const response = await fetch('/Dataset_Public.csv');
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    // Skip header row
    const dataLines = lines.slice(1);
    
    const records: ClaimRecord[] = dataLines
      .map((line, index) => {
        const columns = parseCSVLine(line);
        
        // Ensure we have at least 3 columns
        if (columns.length < 3) {
          return null;
        }
        
        return {
          id: `csv-${index + 1}`,
          description: columns[0] || '',
          coverageCode: columns[1] || '',
          accidentSource: columns[2] || ''
        };
      })
      .filter((record): record is ClaimRecord => record !== null);
    
    return records;
  } catch (error) {
    console.error('Error loading CSV data:', error);
    throw error;
  }
}

/**
 * Calculate dataset statistics from ClaimRecord array
 */
export function calculateDatasetStats(data: ClaimRecord[]) {
  const coverageCounts: Record<string, number> = {};
  
  data.forEach(record => {
    const code = record.coverageCode;
    if (code) {
      coverageCounts[code] = (coverageCounts[code] || 0) + 1;
    }
  });
  
  const total = data.length;
  const schema = Object.entries(coverageCounts)
    .map(([code, count]) => ({
      code,
      count,
      percentage: (count / total) * 100
    }))
    .sort((a, b) => b.count - a.count);
  
  return {
    total,
    validationSplit: "20%",
    modelName: "Gemini 2.5-Flash",
    schema
  };
}

