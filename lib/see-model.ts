/**
 * Software Effort Estimation (SEE) Model
 * Based on NASA/China datasets using COCOMO-like cost drivers
 *
 * Attributes (1.0 is nominal):
 * - RELY: Reliability requirements (0.75 - 1.40)
 * - CPLX: Complexity (0.70 - 1.65)
 * - ACAP: Analyst Capability (1.46 - 0.71)
 * - PCAP: Programmer Capability (1.42 - 0.70)
 * - TOOL: Use of Software Tools (1.24 - 0.83)
 * - SCED: Required Schedule (1.23 - 1.00)
 */

export interface SEEAttributes {
  rely: number
  cplx: number
  acap: number
  pcap: number
  tool: number
  sced: number
}

// Base effort equation: Effort = a * (Size ^ b) * EAF
// Where EAF (Effort Adjustment Factor) is the product of all cost drivers
const BASE_COEFFICIENT = 2.94 // 'a' coefficient
const EXPONENT = 1.1 // 'b' exponent for organic projects

/**
 * Calculate the Effort Adjustment Factor (EAF)
 * EAF is the product of all cost driver multipliers
 */
export function calculateEAF(attributes: SEEAttributes): number {
  return attributes.rely * attributes.cplx * attributes.acap * attributes.pcap * attributes.tool * attributes.sced
}

/**
 * Estimate effort in person-months
 * @param sizeKLOC - Size in thousands of lines of code (KLOC)
 * @param attributes - SEE cost driver attributes
 * @returns Estimated effort in person-months
 */
export function estimateEffort(sizeKLOC: number, attributes: SEEAttributes): number {
  const eaf = calculateEAF(attributes)
  const effort = BASE_COEFFICIENT * Math.pow(sizeKLOC, EXPONENT) * eaf
  return Math.round(effort * 100) / 100 // Round to 2 decimal places
}

/**
 * Get a descriptive label for an attribute value
 */
export function getAttributeLabel(value: number): string {
  if (value <= 0.75) return "Very Low"
  if (value <= 0.88) return "Low"
  if (value <= 1.0) return "Nominal"
  if (value <= 1.15) return "High"
  if (value <= 1.3) return "Very High"
  return "Extra High"
}

/**
 * Get color class for effort visualization
 */
export function getEffortColorClass(effortPM: number): string {
  if (effortPM < 3) return "text-green-600 bg-green-50 border-green-200"
  if (effortPM < 6) return "text-yellow-600 bg-yellow-50 border-yellow-200"
  if (effortPM < 12) return "text-orange-600 bg-orange-50 border-orange-200"
  return "text-red-600 bg-red-50 border-red-200"
}

/**
 * SEE attribute descriptors for UI
 */
export const SEE_DESCRIPTORS = {
  rely: {
    label: "Reliability",
    description: "Required software reliability",
    min: 0.75,
    max: 1.4,
    nominal: 1.0,
  },
  cplx: {
    label: "Complexity",
    description: "Product complexity",
    min: 0.7,
    max: 1.65,
    nominal: 1.0,
  },
  acap: {
    label: "Analyst Capability",
    description: "Capability of the analysis team",
    min: 0.71,
    max: 1.46,
    nominal: 1.0,
    inverted: true, // Higher capability = lower multiplier
  },
  pcap: {
    label: "Programmer Capability",
    description: "Capability of the programming team",
    min: 0.7,
    max: 1.42,
    nominal: 1.0,
    inverted: true,
  },
  tool: {
    label: "Tool Support",
    description: "Use of software development tools",
    min: 0.83,
    max: 1.24,
    nominal: 1.0,
    inverted: true,
  },
  sced: {
    label: "Schedule Constraint",
    description: "Required development schedule",
    min: 1.0,
    max: 1.23,
    nominal: 1.0,
  },
} as const
