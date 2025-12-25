"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, TrendingUp, TrendingDown, Calculator } from "lucide-react"
import { useChinaPrediction, type ChinaDatasetInput } from "@/hooks/use-china-prediction"

const DEFAULT_VALUES: ChinaDatasetInput = {
  AFP: 200,
  Input: 30,
  Output: 40,
  Enquiry: 20,
  File: 15,
  Interface: 10,
  Resource: 5,
  Duration: 12,
}

const FIELD_DESCRIPTIONS = {
  AFP: "Adjusted Function Points",
  Input: "Number of input transactions",
  Output: "Number of output transactions",
  Enquiry: "Number of enquiry transactions",
  File: "Number of internal files",
  Interface: "Number of external interfaces",
  Resource: "Resource constraint level (1-10)",
  Duration: "Project duration in months",
}

export function ChinaEffortPredictor() {
  const [inputs, setInputs] = useState<ChinaDatasetInput>(DEFAULT_VALUES)
  const { predict, loading, error, result } = useChinaPrediction()

  const handleInputChange = (field: keyof ChinaDatasetInput, value: string) => {
    const numValue = parseFloat(value) || 0
    setInputs((prev) => ({ ...prev, [field]: numValue }))
  }

  const handlePredict = async () => {
    await predict(inputs)
  }

  const handleReset = () => {
    setInputs(DEFAULT_VALUES)
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">China Dataset Effort Predictor</h1>
        <p className="text-muted-foreground">
          Estimate software development effort using NASA/China dataset model
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Project Attributes</CardTitle>
            <CardDescription>Enter your project metrics for effort estimation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(inputs).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-sm font-medium">
                  {key}
                </Label>
                <p className="text-xs text-muted-foreground">{FIELD_DESCRIPTIONS[key as keyof ChinaDatasetInput]}</p>
                <Input
                  id={key}
                  type="number"
                  value={value}
                  onChange={(e) => handleInputChange(key as keyof ChinaDatasetInput, e.target.value)}
                  className="w-full"
                  min="0"
                  step="1"
                />
              </div>
            ))}

            <div className="flex gap-2 pt-4">
              <Button onClick={handlePredict} disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-4 w-4" />
                    Predict Effort
                  </>
                )}
              </Button>
              <Button onClick={handleReset} variant="outline" disabled={loading}>
                Reset
              </Button>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Prediction Results</CardTitle>
            <CardDescription>Estimated effort and feature importance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Effort Prediction */}
                <div className="p-6 bg-primary/5 rounded-lg border-2 border-primary/20">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Estimated Effort</p>
                    <div className="text-4xl font-bold text-primary">{result.prediction.toLocaleString()}</div>
                    <p className="text-sm font-medium">person-hours</p>
                    <Badge variant="secondary" className="mt-2">
                      {result.prediction_pm.toFixed(2)} person-months
                    </Badge>
                  </div>
                </div>

                {/* Feature Importance */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Feature Importance</h3>
                  <div className="space-y-2">
                    {result.feature_importance
                      .sort((a, b) => Math.abs(b.importance) - Math.abs(a.importance))
                      .map((item) => {
                        const isPositive = item.importance > 0
                        const absValue = Math.abs(item.importance)
                        const maxAbs = Math.max(
                          ...result.feature_importance.map((f) => Math.abs(f.importance))
                        )
                        const widthPercent = (absValue / maxAbs) * 100

                        return (
                          <div key={item.feature} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium">{item.feature}</span>
                              <span className={isPositive ? "text-red-600" : "text-green-600"}>
                                {isPositive ? "+" : ""}
                                {item.importance.toFixed(2)}
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${isPositive ? "bg-red-500" : "bg-green-500"}`}
                                style={{ width: `${widthPercent}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-red-500" />
                    <span>Increases effort</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 text-green-500" />
                    <span>Decreases effort</span>
                  </div>
                </div>

                {/* Model Info */}
                <div className="pt-4 border-t space-y-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Model:</span> {result.model_version}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Dataset:</span> {result.dataset}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center space-y-2">
                  <Calculator className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Enter project attributes and click Predict Effort</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
