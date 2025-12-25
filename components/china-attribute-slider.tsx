"use client"

import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getAttributeLabel, type ChinaAttributes } from "@/lib/china-model"

interface ChinaAttributeSliderProps {
  attribute: keyof ChinaAttributes
  value: number
  onChange: (value: number) => void
  descriptor: {
    label: string
    description: string
    min: number
    max: number
    default: number
    step: number
  }
}

export function ChinaAttributeSlider({
  attribute,
  value,
  onChange,
  descriptor,
}: ChinaAttributeSliderProps) {
  const label = getAttributeLabel(value, attribute)
  const attributeCode = attribute.toUpperCase()

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Label className="font-semibold text-sm">{descriptor.label}</Label>
            <Badge variant="outline" className="text-xs font-mono">
              {attributeCode}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{descriptor.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={value}
            onChange={(e) => {
              const newValue = Number.parseFloat(e.target.value) || descriptor.default
              onChange(Math.max(descriptor.min, Math.min(descriptor.max, newValue)))
            }}
            className="w-20 h-8 text-sm text-right"
            min={descriptor.min}
            max={descriptor.max}
            step={descriptor.step}
          />
          <Badge variant="secondary" className="min-w-[80px] justify-center">
            {label}
          </Badge>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={descriptor.min}
        max={descriptor.max}
        step={descriptor.step}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{descriptor.min}</span>
        <span>{descriptor.max}</span>
      </div>
    </div>
  )
}
