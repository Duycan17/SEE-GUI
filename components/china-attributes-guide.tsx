"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CHINA_DESCRIPTORS } from "@/lib/china-model"
import {
  Calculator,
  FileInput,
  FileOutput,
  Search,
  Database,
  Network,
  Cpu,
  Clock,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

interface ChinaAttributesGuideProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChinaAttributesGuide({ open, onOpenChange }: ChinaAttributesGuideProps) {
  const attributeGuides = [
    {
      key: "afp",
      icon: Calculator,
      title: "Adjusted Function Points (AFP)",
      description: "Total function points adjusted for technical complexity factors",
      range: "50 - 1000",
      default: "200",
      impact: "negative",
      guidelines: [
        {
          value: "50-100",
          label: "Very Small",
          description: "Simple application with minimal functionality",
          examples: ["Landing page", "Simple calculator", "Basic form"],
        },
        {
          value: "100-200",
          label: "Small",
          description: "Small application with limited features",
          examples: ["Todo app", "Simple blog", "Contact manager"],
        },
        {
          value: "200-300",
          label: "Medium",
          description: "Standard application with moderate complexity",
          examples: ["E-commerce site", "CRM system", "Project management tool"],
        },
        {
          value: "300-500",
          label: "Large",
          description: "Complex application with many features",
          examples: ["Enterprise ERP", "Social media platform", "Banking system"],
        },
        {
          value: "500+",
          label: "Very Large",
          description: "Very complex system with extensive functionality",
          examples: ["Large-scale enterprise system", "Multi-tenant SaaS platform", "Complex financial system"],
        },
      ],
    },
    {
      key: "input",
      icon: FileInput,
      title: "Input Transactions",
      description: "Number of unique input data transactions or forms",
      range: "0 - 200",
      default: "30",
      impact: "negative",
      guidelines: [
        {
          value: "0-10",
          label: "Very Low",
          description: "Minimal input requirements",
          examples: ["Read-only dashboard", "Static content site", "Simple viewer"],
        },
        {
          value: "10-30",
          label: "Low",
          description: "Few input forms or transactions",
          examples: ["Basic CRUD app", "Simple registration", "Contact form"],
        },
        {
          value: "30-50",
          label: "Medium",
          description: "Moderate number of input transactions",
          examples: ["Standard web app", "Multi-step forms", "Data entry system"],
        },
        {
          value: "50-80",
          label: "High",
          description: "Many input transactions and forms",
          examples: ["Complex forms", "Multi-entity data entry", "Workflow system"],
        },
        {
          value: "80+",
          label: "Very High",
          description: "Extensive input requirements",
          examples: ["Enterprise data management", "Complex workflow system", "Multi-source data integration"],
        },
      ],
    },
    {
      key: "output",
      icon: FileOutput,
      title: "Output Transactions",
      description: "Number of unique output reports, displays, or exports",
      range: "0 - 200",
      default: "40",
      impact: "positive",
      guidelines: [
        {
          value: "0-10",
          label: "Very Low",
          description: "Minimal output requirements",
          examples: ["Simple form submission", "Basic confirmation", "Minimal reporting"],
        },
        {
          value: "10-30",
          label: "Low",
          description: "Few output screens or reports",
          examples: ["Basic list views", "Simple reports", "Standard displays"],
        },
        {
          value: "30-50",
          label: "Medium",
          description: "Moderate number of outputs",
          examples: ["Multiple reports", "Dashboards", "Export features"],
        },
        {
          value: "50-80",
          label: "High",
          description: "Many output formats and reports",
          examples: ["Complex reporting", "Multiple dashboards", "Various export formats"],
        },
        {
          value: "80+",
          label: "Very High",
          description: "Extensive output requirements",
          examples: ["Enterprise reporting suite", "Advanced analytics", "Multi-format exports"],
        },
      ],
    },
    {
      key: "enquiry",
      icon: Search,
      title: "Enquiry Transactions",
      description: "Number of unique query or search operations",
      range: "0 - 100",
      default: "20",
      impact: "negative",
      guidelines: [
        {
          value: "0-10",
          label: "Very Low",
          description: "Minimal search or query features",
          examples: ["No search", "Basic filtering", "Simple lookup"],
        },
        {
          value: "10-20",
          label: "Low",
          description: "Basic search functionality",
          examples: ["Simple search", "Basic filters", "Standard queries"],
        },
        {
          value: "20-40",
          label: "Medium",
          description: "Moderate search and query features",
          examples: ["Advanced search", "Multiple filters", "Complex queries"],
        },
        {
          value: "40-60",
          label: "High",
          description: "Extensive search capabilities",
          examples: ["Full-text search", "Faceted search", "Complex query builder"],
        },
        {
          value: "60+",
          label: "Very High",
          description: "Very complex search and analytics",
          examples: ["Enterprise search", "Advanced analytics", "AI-powered search"],
        },
      ],
    },
    {
      key: "file",
      icon: Database,
      title: "Internal Files",
      description: "Number of internal logical files or database tables",
      range: "0 - 100",
      default: "15",
      impact: "positive",
      guidelines: [
        {
          value: "0-5",
          label: "Very Low",
          description: "Very simple data model",
          examples: ["Single table", "Minimal data storage", "Simple configuration"],
        },
        {
          value: "5-15",
          label: "Low",
          description: "Simple data model",
          examples: ["Few tables", "Basic relationships", "Simple schema"],
        },
        {
          value: "15-25",
          label: "Medium",
          description: "Moderate data complexity",
          examples: ["Standard database", "Multiple entities", "Moderate relationships"],
        },
        {
          value: "25-40",
          label: "High",
          description: "Complex data model",
          examples: ["Many tables", "Complex relationships", "Advanced schema"],
        },
        {
          value: "40+",
          label: "Very High",
          description: "Very complex data architecture",
          examples: ["Enterprise data model", "Complex relationships", "Multi-database system"],
        },
      ],
    },
    {
      key: "interface",
      icon: Network,
      title: "External Interfaces",
      description: "Number of external APIs, services, or system integrations",
      range: "0 - 50",
      default: "10",
      impact: "positive",
      guidelines: [
        {
          value: "0-5",
          label: "Very Low",
          description: "Minimal external integrations",
          examples: ["Standalone app", "No external APIs", "Self-contained system"],
        },
        {
          value: "5-10",
          label: "Low",
          description: "Few external integrations",
          examples: ["1-2 APIs", "Basic integrations", "Simple external services"],
        },
        {
          value: "10-20",
          label: "Medium",
          description: "Moderate external integrations",
          examples: ["Multiple APIs", "Payment gateway", "Email service", "Cloud storage"],
        },
        {
          value: "20-30",
          label: "High",
          description: "Many external integrations",
          examples: ["Many APIs", "Multiple services", "Complex integrations"],
        },
        {
          value: "30+",
          label: "Very High",
          description: "Extensive external integrations",
          examples: ["Enterprise integrations", "Microservices", "Complex API ecosystem"],
        },
      ],
    },
    {
      key: "resource",
      icon: Cpu,
      title: "Resource Constraints",
      description: "Level of resource limitations (memory, CPU, storage, budget)",
      range: "1 - 10",
      default: "5",
      impact: "positive",
      guidelines: [
        {
          value: "1-2",
          label: "Very Low",
          description: "No significant resource constraints",
          examples: ["Unlimited cloud resources", "High budget", "No performance constraints"],
        },
        {
          value: "3-4",
          label: "Low",
          description: "Minimal resource constraints",
          examples: ["Standard cloud tier", "Adequate budget", "Normal performance requirements"],
        },
        {
          value: "5-6",
          label: "Medium",
          description: "Moderate resource constraints",
          examples: ["Limited budget", "Standard hosting", "Moderate performance needs"],
        },
        {
          value: "7-8",
          label: "High",
          description: "Significant resource constraints",
          examples: ["Tight budget", "Limited infrastructure", "High performance requirements"],
        },
        {
          value: "9-10",
          label: "Very High",
          description: "Severe resource constraints",
          examples: ["Very tight budget", "Minimal infrastructure", "Extreme performance requirements"],
        },
      ],
    },
    {
      key: "duration",
      icon: Clock,
      title: "Project Duration",
      description: "Expected project timeline in months",
      range: "1 - 48",
      default: "12",
      impact: "positive",
      guidelines: [
        {
          value: "1-3",
          label: "Very Short",
          description: "Quick project or sprint",
          examples: ["MVP", "Prototype", "Small feature"],
        },
        {
          value: "3-6",
          label: "Short",
          description: "Short-term project",
          examples: ["Small project", "Single module", "Quick delivery"],
        },
        {
          value: "6-12",
          label: "Medium",
          description: "Standard project timeline",
          examples: ["Standard web app", "Typical project", "Normal development cycle"],
        },
        {
          value: "12-24",
          label: "Long",
          description: "Long-term project",
          examples: ["Large application", "Enterprise system", "Complex project"],
        },
        {
          value: "24+",
          label: "Very Long",
          description: "Very long-term project",
          examples: ["Multi-year project", "Large-scale system", "Enterprise transformation"],
        },
      ],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] lg:max-w-7xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-indigo-600" />
            China Dataset Attributes Estimation Guide
          </DialogTitle>
          <DialogDescription>
            Learn how to estimate each China Dataset attribute for accurate effort prediction based on function points and project metrics
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Understanding China Dataset Attributes
              </h3>
              <p className="text-sm text-indigo-800 mb-2">
                The China Dataset model uses 8 concrete metrics based on function points and project characteristics.
                Unlike multiplier-based models, these are <strong>count-based attributes</strong> representing actual
                project elements.
              </p>
              <div className="flex items-start gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1.5 bg-red-100 text-red-700 px-2 py-1 rounded">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Increases effort</span>
                </div>
                <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-2 py-1 rounded">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Decreases effort (negative coefficient)</span>
                </div>
              </div>
            </div>

            {/* Each Attribute Guide */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {attributeGuides.map((guide) => {
                const Icon = guide.icon
                const descriptor = CHINA_DESCRIPTORS[guide.key as keyof typeof CHINA_DESCRIPTORS]

                return (
                  <div key={guide.key} className="border border-slate-200 rounded-lg p-5 bg-white">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        guide.impact === 'positive' ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          guide.impact === 'positive' ? 'text-red-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-900 mb-1">{guide.title}</h3>
                        <p className="text-xs text-slate-600 mb-2">{guide.description}</p>
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                          <Badge variant="outline" className="bg-slate-50">
                            Range: {guide.range}
                          </Badge>
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                            Default: {guide.default}
                          </Badge>
                          {guide.impact === 'positive' ? (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Increases effort
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <TrendingDown className="w-3 h-3 mr-1" />
                              Decreases effort
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {guide.guidelines.map((guideline, idx) => (
                        <div
                          key={idx}
                          className="border-l-4 border-slate-200 pl-3 py-1.5 bg-slate-50 rounded-r"
                        >
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-xs text-slate-900">{guideline.label}</span>
                            <Badge variant="outline" className="text-[10px] h-4 px-1">
                              {guideline.value}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-600 mb-1.5">{guideline.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {guideline.examples.map((example, exIdx) => (
                              <Badge
                                key={exIdx}
                                variant="outline"
                                className="text-[10px] bg-white border-slate-200 text-slate-700 h-4 px-1.5"
                              >
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Best Practices */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Best Practices for Estimation
              </h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>
                    <strong>Count actual elements</strong> - These are concrete counts, not subjective ratings. Count forms, reports, tables, and APIs.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>
                    <strong>Start with defaults</strong> - Use the default values as a baseline, then adjust based on your specific requirements.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>
                    <strong>Be specific</strong> - Count unique transactions, not variations. A user registration form is one input, not multiple.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>
                    <strong>Consider complexity</strong> - AFP should reflect both size and technical complexity factors.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>
                    <strong>Review similar projects</strong> - Compare with past projects to validate your counts.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>
                    <strong>Update as you learn</strong> - Refine estimates as requirements become clearer during development.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
