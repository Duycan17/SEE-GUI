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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">{descriptor.label}</Label>
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
