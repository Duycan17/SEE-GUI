"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { getAttributeLabel } from "@/lib/see-model"

interface SEEAttributeSliderProps {
  attribute: string
  value: number
  onChange: (value: number) => void
  descriptor: {
    label: string
    description: string
    min: number
    max: number
    nominal: number
    inverted?: boolean
  }
}

export function SEEAttributeSlider({ attribute, value, onChange, descriptor }: SEEAttributeSliderProps) {
  const label = getAttributeLabel(value)
  const attributeCode = attribute.toUpperCase()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium flex items-center gap-2">
            {descriptor.label}
            <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              {attributeCode}
            </span>
          </Label>
          <p className="text-xs text-muted-foreground">{descriptor.description}</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold">{value.toFixed(2)}</span>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>

      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={descriptor.min}
        max={descriptor.max}
        step={0.01}
        className="w-full"
      />
    </div>
  )
}
