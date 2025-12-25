import { useState } from "react"

export interface ChinaDatasetInput {
  AFP: number // Adjusted Function Points
  Input: number // Number of inputs
  Output: number // Number of outputs
  Enquiry: number // Number of enquiries
  File: number // Number of files
  Interface: number // Number of interfaces
  Resource: number // Resource constraints
  Duration: number // Project duration (months)
}

export interface FeatureImportance {
  feature: string
  importance: number
}

export interface ChinaPredictionResult {
  feature_importance: FeatureImportance[]
  prediction: number // Person-hours
  prediction_pm: number // Person-months
  model_version: string
  dataset: string
}

export function useChinaPrediction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ChinaPredictionResult | null>(null)

  const predict = async (input: ChinaDatasetInput) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/explain/china", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Prediction failed")
      }

      setResult(data.explanation)
      return data.explanation
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get prediction"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    predict,
    loading,
    error,
    result,
  }
}
