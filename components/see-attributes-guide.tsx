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
import { SEE_DESCRIPTORS } from "@/lib/see-model"
import {
  Shield,
  Code,
  Users,
  Wrench,
  Calendar,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"

interface SEEAttributesGuideProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SEEAttributesGuide({ open, onOpenChange }: SEEAttributesGuideProps) {
  const attributeGuides = [
    {
      key: "rely",
      icon: Shield,
      title: "Reliability (RELY)",
      description: "The required level of software reliability and fault tolerance",
      range: "0.75 - 1.40",
      nominal: "1.0",
      inverted: false,
      guidelines: [
        {
          value: "0.75",
          label: "Very Low",
          description: "Slight inconvenience when software fails. No recovery needed.",
          examples: ["Personal projects", "Prototypes", "Internal tools with no critical impact"],
        },
        {
          value: "0.88",
          label: "Low",
          description: "Low but easily recoverable losses. Simple recovery procedures.",
          examples: ["Internal dashboards", "Development tools", "Non-critical utilities"],
        },
        {
          value: "1.0",
          label: "Nominal",
          description: "Moderate recovery effort. Some financial loss possible.",
          examples: ["Standard business applications", "E-commerce sites", "Content management systems"],
        },
        {
          value: "1.15",
          label: "High",
          description: "High financial loss. Recovery procedures are complex.",
          examples: ["Banking systems", "Payment processing", "Healthcare records"],
        },
        {
          value: "1.30",
          label: "Very High",
          description: "Risk to human life. Extensive recovery procedures required.",
          examples: ["Medical devices", "Aircraft control systems", "Nuclear power plant controls"],
        },
        {
          value: "1.40",
          label: "Extra High",
          description: "Catastrophic consequences. Maximum reliability required.",
          examples: ["Life support systems", "Critical safety systems", "Mission-critical aerospace"],
        },
      ],
    },
    {
      key: "cplx",
      icon: Code,
      title: "Complexity (CPLX)",
      description: "The inherent complexity of the product being developed",
      range: "0.70 - 1.65",
      nominal: "1.0",
      inverted: false,
      guidelines: [
        {
          value: "0.70",
          label: "Very Low",
          description: "Simple, straightforward algorithms. Well-understood problem domain.",
          examples: ["CRUD applications", "Simple data entry forms", "Basic reporting"],
        },
        {
          value: "0.85",
          label: "Low",
          description: "Standard algorithms. Moderate problem complexity.",
          examples: ["Standard web applications", "Database applications", "Simple APIs"],
        },
        {
          value: "1.0",
          label: "Nominal",
          description: "Moderate complexity. Some challenging algorithms required.",
          examples: ["E-commerce platforms", "Social media apps", "Standard enterprise software"],
        },
        {
          value: "1.15",
          label: "High",
          description: "Complex algorithms. Significant problem-solving required.",
          examples: ["Real-time systems", "Complex data processing", "Advanced analytics"],
        },
        {
          value: "1.30",
          label: "Very High",
          description: "Very complex algorithms. Highly innovative solutions needed.",
          examples: ["AI/ML systems", "Complex simulations", "Advanced graphics engines"],
        },
        {
          value: "1.65",
          label: "Extra High",
          description: "Extremely complex. State-of-the-art algorithms required.",
          examples: ["Quantum computing software", "Advanced AI systems", "Cutting-edge research software"],
        },
      ],
    },
    {
      key: "acap",
      icon: Users,
      title: "Analyst Capability (ACAP)",
      description: "The capability and experience of the analysis/requirements team",
      range: "0.71 - 1.46",
      nominal: "1.0",
      inverted: true,
      guidelines: [
        {
          value: "0.71",
          label: "Very High",
          description: "15+ years experience. Exceptional analysts. Deep domain expertise.",
          examples: ["Senior business analysts", "Domain experts", "Industry veterans"],
        },
        {
          value: "0.85",
          label: "High",
          description: "8-15 years experience. Strong analytical skills. Good domain knowledge.",
          examples: ["Experienced analysts", "Senior consultants", "Skilled requirements engineers"],
        },
        {
          value: "1.0",
          label: "Nominal",
          description: "3-8 years experience. Standard analytical capabilities.",
          examples: ["Mid-level analysts", "Standard business analysts", "Typical requirements team"],
        },
        {
          value: "1.15",
          label: "Low",
          description: "1-3 years experience. Limited analytical skills. Basic domain knowledge.",
          examples: ["Junior analysts", "New team members", "Limited experience"],
        },
        {
          value: "1.30",
          label: "Very Low",
          description: "Less than 1 year experience. Minimal analytical skills.",
          examples: ["Entry-level analysts", "Interns", "Very inexperienced team"],
        },
        {
          value: "1.46",
          label: "Extra Low",
          description: "No relevant experience. No analytical training.",
          examples: ["Complete beginners", "Untrained staff", "No domain knowledge"],
        },
      ],
    },
    {
      key: "pcap",
      icon: Code,
      title: "Programmer Capability (PCAP)",
      description: "The capability and experience of the programming team",
      range: "0.70 - 1.42",
      nominal: "1.0",
      inverted: true,
      guidelines: [
        {
          value: "0.70",
          label: "Very High",
          description: "15+ years experience. Exceptional programmers. Expert-level skills.",
          examples: ["Senior architects", "Expert developers", "Tech leads with deep expertise"],
        },
        {
          value: "0.85",
          label: "High",
          description: "8-15 years experience. Strong programming skills. Proficient in multiple technologies.",
          examples: ["Senior developers", "Experienced engineers", "Skilled programmers"],
        },
        {
          value: "1.0",
          label: "Nominal",
          description: "3-8 years experience. Standard programming capabilities.",
          examples: ["Mid-level developers", "Standard engineers", "Typical development team"],
        },
        {
          value: "1.15",
          label: "Low",
          description: "1-3 years experience. Limited programming skills. Basic knowledge.",
          examples: ["Junior developers", "New programmers", "Limited experience"],
        },
        {
          value: "1.30",
          label: "Very Low",
          description: "Less than 1 year experience. Minimal programming skills.",
          examples: ["Entry-level developers", "Interns", "Very inexperienced team"],
        },
        {
          value: "1.42",
          label: "Extra Low",
          description: "No relevant experience. No programming training.",
          examples: ["Complete beginners", "Untrained staff", "No technical background"],
        },
      ],
    },
    {
      key: "tool",
      icon: Wrench,
      title: "Tool Support (TOOL)",
      description: "The quality and use of software development tools and environments",
      range: "0.83 - 1.24",
      nominal: "1.0",
      inverted: true,
      guidelines: [
        {
          value: "0.83",
          label: "Very High",
          description: "Integrated toolset. Advanced IDE. Automated testing. CI/CD pipelines.",
          examples: ["Full DevOps pipeline", "Advanced IDEs (IntelliJ, VS Code)", "Comprehensive testing tools"],
        },
        {
          value: "0.92",
          label: "High",
          description: "Good toolset. Modern IDE. Some automation. Good debugging tools.",
          examples: ["Modern development tools", "Standard IDEs", "Basic CI/CD", "Version control"],
        },
        {
          value: "1.0",
          label: "Nominal",
          description: "Basic toolset. Standard IDE. Minimal automation.",
          examples: ["Basic editors", "Standard tools", "Manual processes"],
        },
        {
          value: "1.10",
          label: "Low",
          description: "Limited toolset. Basic editor. No automation. Poor debugging.",
          examples: ["Minimal tools", "Basic text editors", "No version control", "Manual testing"],
        },
        {
          value: "1.24",
          label: "Very Low",
          description: "No modern tools. Primitive development environment.",
          examples: ["No IDE", "No debugging tools", "No automation", "No version control"],
        },
      ],
    },
    {
      key: "sced",
      icon: Calendar,
      title: "Schedule Constraint (SCED)",
      description: "The required development schedule and time pressure",
      range: "1.00 - 1.23",
      nominal: "1.0",
      inverted: false,
      guidelines: [
        {
          value: "1.00",
          label: "Nominal",
          description: "Standard schedule. No significant time pressure.",
          examples: ["Normal project timeline", "Standard delivery dates", "No rush"],
        },
        {
          value: "1.08",
          label: "High",
          description: "Tight schedule. Some time pressure. May require overtime.",
          examples: ["Accelerated timeline", "Tight deadlines", "Some schedule pressure"],
        },
        {
          value: "1.15",
          label: "Very High",
          description: "Very tight schedule. Significant time pressure. Frequent overtime.",
          examples: ["Rushed projects", "Aggressive deadlines", "High schedule pressure"],
        },
        {
          value: "1.23",
          label: "Extra High",
          description: "Extremely tight schedule. Maximum time pressure. Constant overtime.",
          examples: ["Emergency projects", "Mission-critical deadlines", "Maximum schedule compression"],
        },
      ],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-indigo-600" />
            SEE Attributes Estimation Guide
          </DialogTitle>
          <DialogDescription>
            Learn how to estimate each Software Effort Estimation (SEE) attribute for accurate project planning
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Understanding SEE Attributes
              </h3>
              <p className="text-sm text-indigo-800">
                The Software Effort Estimation (SEE) model uses six cost driver attributes to adjust the base effort
                estimate. Each attribute has a range of values, with <strong>1.0 being nominal</strong> (baseline). Values
                above 1.0 increase effort, while values below 1.0 decrease effort. For inverted attributes (ACAP, PCAP, TOOL),
                higher capability/tool quality results in lower multipliers (values closer to 0.7-0.8).
              </p>
            </div>

            {/* Each Attribute Guide */}
            {attributeGuides.map((guide) => {
              const Icon = guide.icon
              const descriptor = SEE_DESCRIPTORS[guide.key as keyof typeof SEE_DESCRIPTORS]

              return (
                <div key={guide.key} className="border border-slate-200 rounded-lg p-6 bg-white">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">{guide.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">{guide.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <Badge variant="outline" className="bg-slate-50">
                          Range: {guide.range}
                        </Badge>
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                          Nominal: {guide.nominal}
                        </Badge>
                        {guide.inverted && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Inverted (lower = better)
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    {guide.guidelines.map((guideline, idx) => (
                      <div
                        key={idx}
                        className="border-l-4 border-slate-200 pl-4 py-2 bg-slate-50 rounded-r"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-slate-900">{guideline.label}</span>
                          <Badge variant="outline" className="text-xs">
                            {guideline.value}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 mb-2">{guideline.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {guideline.examples.map((example, exIdx) => (
                            <Badge
                              key={exIdx}
                              variant="outline"
                              className="text-xs bg-white border-slate-200 text-slate-700"
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
                    <strong>Start with nominal (1.0)</strong> for all attributes, then adjust based on your specific
                    project context
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>
                    <strong>Be honest and realistic</strong> - underestimating complexity or overestimating team capability
                    leads to inaccurate estimates
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>
                    <strong>Consider the team average</strong> for ACAP and PCAP - don't use the best or worst team member
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>
                    <strong>Review historical projects</strong> - compare similar past projects to calibrate your estimates
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>
                    <strong>Update estimates regularly</strong> - as the project progresses, adjust attributes based on new
                    information
                  </span>
                </li>
              </ul>
            </div>

            {/* Formula Reference */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">How It Works</h3>
              <p className="text-sm text-slate-700 mb-2">
                The SEE model calculates effort using the formula:
              </p>
              <div className="bg-white border border-slate-200 rounded p-3 font-mono text-sm">
                <div className="text-slate-600">Effort (person-months) = 2.94 × (Size<sup>1.1</sup>) × EAF</div>
                <div className="text-slate-500 mt-2 text-xs">
                  Where EAF = RELY × CPLX × ACAP × PCAP × TOOL × SCED
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                The Effort Adjustment Factor (EAF) multiplies all six attributes together. Values above 1.0 increase effort,
                while values below 1.0 decrease effort.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

