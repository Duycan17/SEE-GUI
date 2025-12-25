/**
 * China Dataset Software Effort Estimation Model
 * Based on NASA/China datasets using function points and project metrics
 */

export interface ChinaAttributes {
  afp: number // Adjusted Function Points
  input: number // Number of inputs
  output: number // Number of outputs
  enquiry: number // Number of enquiries
  file: number // Number of files
  interface: number // Number of interfaces
  resource: number // Resource constraints
  duration: number // Project duration (months)
}

/**
 * Calculate effort in person-hours using China dataset model
 * Formula: Effort = base + Σ(coefficient_i * feature_i) * scale
 */
export function estimateEffortChina(attributes: ChinaAttributes): number {
  const baseEffort = 1200 // Base effort in person-hours

  // Coefficients based on China dataset regression model
  const contribution =
    attributes.afp * -1.041 +
    attributes.input * -2.293 +
    attributes.output * 0.674 +
    attributes.enquiry * -0.344 +
    attributes.file * 1.247 +
    attributes.interface * 2.156 +
    attributes.resource * 3.892 +
    attributes.duration * 8.467

  const totalEffort = baseEffort + contribution * 50 // Scale factor

  return Math.max(totalEffort, 100) // Minimum 100 hours
}

/**
 * Convert person-hours to person-months (160 hours = 1 month)
 */
export function hoursToMonths(hours: number): number {
  return Math.round((hours / 160) * 100) / 100
}

/**
 * Convert person-months to person-hours
 */
export function monthsToHours(months: number): number {
  return Math.round(months * 160 * 100) / 100
}

/**
 * Get a descriptive label for an attribute value
 */
export function getAttributeLabel(value: number, type: keyof ChinaAttributes): string {
  switch (type) {
    case "afp":
      if (value < 100) return "Very Small"
      if (value < 200) return "Small"
      if (value < 300) return "Medium"
      if (value < 500) return "Large"
      return "Very Large"
    
    case "input":
    case "output":
    case "enquiry":
      if (value < 10) return "Very Low"
      if (value < 30) return "Low"
      if (value < 50) return "Medium"
      if (value < 80) return "High"
      return "Very High"
    
    case "file":
    case "interface":
      if (value < 5) return "Very Low"
      if (value < 15) return "Low"
      if (value < 25) return "Medium"
      if (value < 40) return "High"
      return "Very High"
    
    case "resource":
      if (value <= 2) return "Very Low"
      if (value <= 4) return "Low"
      if (value <= 6) return "Medium"
      if (value <= 8) return "High"
      return "Very High"
    
    case "duration":
      if (value < 3) return "Very Short"
      if (value < 6) return "Short"
      if (value < 12) return "Medium"
      if (value < 24) return "Long"
      return "Very Long"
    
    default:
      return "Unknown"
  }
}

/**
 * Get color class for effort visualization
 */
export function getEffortColorClass(effortHours: number): string {
  const effortPM = hoursToMonths(effortHours)
  if (effortPM < 3) return "text-green-600 bg-green-50 border-green-200"
  if (effortPM < 6) return "text-yellow-600 bg-yellow-50 border-yellow-200"
  if (effortPM < 12) return "text-orange-600 bg-orange-50 border-orange-200"
  return "text-red-600 bg-red-50 border-red-200"
}

/**
 * China attribute descriptors for UI
 */
export const CHINA_DESCRIPTORS = {
  afp: {
    label: "Adjusted Function Points",
    description: "Total function points adjusted for complexity",
    min: 50,
    max: 1000,
    default: 200,
    step: 10,
  },
  input: {
    label: "Input Transactions",
    description: "Number of input data transactions",
    min: 0,
    max: 200,
    default: 30,
    step: 5,
  },
  output: {
    label: "Output Transactions",
    description: "Number of output data transactions",
    min: 0,
    max: 200,
    default: 40,
    step: 5,
  },
  enquiry: {
    label: "Enquiry Transactions",
    description: "Number of enquiry/query transactions",
    min: 0,
    max: 100,
    default: 20,
    step: 5,
  },
  file: {
    label: "Internal Files",
    description: "Number of internal logical files",
    min: 0,
    max: 100,
    default: 15,
    step: 1,
  },
  interface: {
    label: "External Interfaces",
    description: "Number of external interface files",
    min: 0,
    max: 50,
    default: 10,
    step: 1,
  },
  resource: {
    label: "Resource Constraints",
    description: "Resource constraint level (1=low, 10=high)",
    min: 1,
    max: 10,
    default: 5,
    step: 1,
  },
  duration: {
    label: "Project Duration",
    description: "Expected project duration in months",
    min: 1,
    max: 48,
    default: 12,
    step: 1,
  },
} as const
