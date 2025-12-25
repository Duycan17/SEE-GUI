import { NextRequest, NextResponse } from "next/server"
import { estimateEffort, type SEEAttributes } from "@/lib/see-model"

// Standard conversion: 1 person-month = 152 person-hours (20 working days × 7.6 hours/day)
const PERSON_HOURS_PER_MONTH = 152

interface ExplainRequest {
  // SEE attributes
  rely?: number
  cplx?: number
  acap?: number
  pcap?: number
  tool?: number
  sced?: number
  sizeKLOC?: number
}

interface FeatureImportance {
  feature: string
  importance: number
}

interface ExplainResponse {
  success: boolean
  explanation: {
    feature_importance: FeatureImportance[]
    prediction: number
  }
}

/**
 * Calculate feature importance using sensitivity analysis
 * Importance is calculated as the change in effort when varying each attribute
 */
function calculateFeatureImportance(
  attributes: SEEAttributes,
  sizeKLOC: number,
  baseEffort: number
): FeatureImportance[] {
  const importance: FeatureImportance[] = []
  const sensitivityDelta = 0.1 // 10% change to measure sensitivity

  const attributeNames: (keyof SEEAttributes)[] = ["rely", "cplx", "acap", "pcap", "tool", "sced"]

  for (const attr of attributeNames) {
    // Calculate effort with increased attribute value
    const modifiedAttributes: SEEAttributes = {
      ...attributes,
      [attr]: attributes[attr] * (1 + sensitivityDelta),
    }
    const modifiedEffort = estimateEffort(sizeKLOC, modifiedAttributes) * PERSON_HOURS_PER_MONTH

    // Calculate the impact (difference in person-hours)
    const impact = modifiedEffort - baseEffort

    // For inverted attributes (acap, pcap, tool), negative impact means positive importance
    // For normal attributes, positive impact means positive importance
    const isInverted = attr === "acap" || attr === "pcap" || attr === "tool"
    const importanceValue = isInverted ? -impact : impact

    importance.push({
      feature: attr.toUpperCase(),
      importance: Math.round(importanceValue * 100) / 100,
    })
  }

  return importance.sort((a, b) => Math.abs(b.importance) - Math.abs(a.importance))
}

/**
 * POST /api/explain/[model]
 * Mock API endpoint for effort estimation explanation using SEE attributes
 * 
 * Request body (SEE attributes only):
 * {
 *   "rely": 1.0,      // Reliability (0.75 - 1.40)
 *   "cplx": 1.0,      // Complexity (0.70 - 1.65)
 *   "acap": 1.0,      // Analyst Capability (0.71 - 1.46)
 *   "pcap": 1.0,      // Programmer Capability (0.70 - 1.42)
 *   "tool": 1.0,      // Tool Support (0.83 - 1.24)
 *   "sced": 1.0,      // Schedule Constraint (1.00 - 1.23)
 *   "sizeKLOC": 10    // Size in thousands of lines of code
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "explanation": {
 *     "feature_importance": [
 *       {"feature": "RELY", "importance": -208.24},
 *       {"feature": "CPLX", "importance": -68.80},
 *       {"feature": "ACAP", "importance": 26.96},
 *       ...
 *     ],
 *     "prediction": 7354.17  // in person-hours
 *   }
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model } = await params
    const body: ExplainRequest = await request.json()

    // Default values for SEE attributes (nominal = 1.0)
    const attributes: SEEAttributes = {
      rely: body.rely ?? 1.0,
      cplx: body.cplx ?? 1.0,
      acap: body.acap ?? 1.0,
      pcap: body.pcap ?? 1.0,
      tool: body.tool ?? 1.0,
      sced: body.sced ?? 1.0,
    }

    // Default size if not provided
    const sizeKLOC = body.sizeKLOC ?? 10

    // Validate attribute ranges
    const validations = [
      { attr: "rely", value: attributes.rely, min: 0.75, max: 1.4 },
      { attr: "cplx", value: attributes.cplx, min: 0.7, max: 1.65 },
      { attr: "acap", value: attributes.acap, min: 0.71, max: 1.46 },
      { attr: "pcap", value: attributes.pcap, min: 0.7, max: 1.42 },
      { attr: "tool", value: attributes.tool, min: 0.83, max: 1.24 },
      { attr: "sced", value: attributes.sced, min: 1.0, max: 1.23 },
    ]

    for (const { attr, value, min, max } of validations) {
      if (value < min || value > max) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid ${attr} value: ${value}. Must be between ${min} and ${max}`,
          },
          { status: 400 }
        )
      }
    }

    // Calculate base effort in person-months
    const effortPM = estimateEffort(sizeKLOC, attributes)

    // Convert to person-hours
    const effortPH = effortPM * PERSON_HOURS_PER_MONTH

    // Calculate feature importance
    const featureImportance = calculateFeatureImportance(attributes, sizeKLOC, effortPH)

    const response: ExplainResponse = {
      success: true,
      explanation: {
        feature_importance: featureImportance,
        prediction: Math.round(effortPH * 100) / 100,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in explain API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}

