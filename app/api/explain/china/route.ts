import { NextRequest, NextResponse } from "next/server"

/**
 * China Dataset SEE Model API
 * Mock implementation for effort prediction based on NASA/China dataset attributes
 */

interface ChinaDatasetInput {
  AFP: number // Adjusted Function Points
  Input: number // Number of inputs
  Output: number // Number of outputs
  Enquiry: number // Number of enquiries
  File: number // Number of files
  Interface: number // Number of interfaces
  Resource: number // Resource constraints
  Duration: number // Project duration (months)
}

interface FeatureImportance {
  feature: string
  importance: number
}

interface ExplanationResponse {
  success: boolean
  explanation: {
    feature_importance: FeatureImportance[]
    prediction: number // Effort in person-hours
    prediction_pm: number // Effort in person-months (160 hours/month)
    model_version: string
    dataset: string
  }
}

/**
 * Mock feature importance calculation
 * Simulates ML model feature importance based on input values
 */
function calculateFeatureImportance(input: ChinaDatasetInput): FeatureImportance[] {
  // Coefficients based on typical China dataset regression model
  const coefficients = {
    AFP: -1.041,
    Input: -2.293,
    Output: 0.674,
    Enquiry: -0.344,
    File: 1.247,
    Interface: 2.156,
    Resource: 3.892,
    Duration: 8.467,
  }

  return Object.entries(input).map(([feature, value]) => ({
    feature,
    importance: parseFloat((coefficients[feature as keyof typeof coefficients] * value).toFixed(2)),
  }))
}

/**
 * Mock effort prediction using China dataset model
 * Formula approximates: Effort = base + Σ(coefficient_i * feature_i)
 */
function predictEffort(input: ChinaDatasetInput): number {
  const baseEffort = 1200 // Base effort in person-hours

  // Weighted contribution of each feature
  const contribution =
    input.AFP * -1.041 +
    input.Input * -2.293 +
    input.Output * 0.674 +
    input.Enquiry * -0.344 +
    input.File * 1.247 +
    input.Interface * 2.156 +
    input.Resource * 3.892 +
    input.Duration * 8.467

  const totalEffort = baseEffort + contribution * 50 // Scale factor

  return parseFloat(Math.max(totalEffort, 100).toFixed(2)) // Minimum 100 hours
}

export async function POST(request: NextRequest) {
  try {
    const body: ChinaDatasetInput = await request.json()

    // Validate input
    const requiredFields: (keyof ChinaDatasetInput)[] = [
      "AFP",
      "Input",
      "Output",
      "Enquiry",
      "File",
      "Interface",
      "Resource",
      "Duration",
    ]

    for (const field of requiredFields) {
      if (typeof body[field] !== "number") {
        return NextResponse.json(
          {
            success: false,
            error: `Missing or invalid field: ${field}`,
          },
          { status: 400 }
        )
      }
    }

    // Calculate prediction and feature importance
    const prediction = predictEffort(body)
    const featureImportance = calculateFeatureImportance(body)

    const response: ExplanationResponse = {
      success: true,
      explanation: {
        feature_importance: featureImportance,
        prediction: prediction,
        prediction_pm: parseFloat((prediction / 160).toFixed(2)), // Convert to person-months
        model_version: "china-dataset-v1.0",
        dataset: "NASA/China Software Engineering Dataset",
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Invalid request body",
      },
      { status: 400 }
    )
  }
}
