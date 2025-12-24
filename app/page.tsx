import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock,
  Code2,
  Layout,
  LineChart,
  Lock,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-[120px]" />
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] rounded-full bg-purple-200/30 blur-[150px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <header className="flex items-center justify-between px-6 py-6 md:px-12 backdrop-blur-md border-b border-slate-200/60 bg-white/50 sticky top-0 z-50 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-white fill-white/20" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 tracking-tight">
              Velociti AI
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-indigo-600 transition-colors cursor-pointer">Features</a>
              <a href="#workflow" className="hover:text-indigo-600 transition-colors cursor-pointer">How it works</a>
              <a href="#pricing" className="hover:text-indigo-600 transition-colors cursor-pointer">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hidden sm:inline-flex cursor-pointer">
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6 shadow-lg shadow-slate-200 transition-all cursor-pointer">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="flex-1">
          <section className="relative px-6 py-24 md:py-32 flex flex-col items-center text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>

            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 leading-[1.1] text-slate-900">
              Project Management <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 animate-gradient-x">
                Reimagined with AI
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Velociti AI combines the robust workflow of industry leaders with cutting-edge
              AI to estimate software effort, optimize sprints, and automate the mundane.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 relative z-10">
              <Link href="/login">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 text-white cursor-pointer">
                  Start for Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="https://github.com" target="_blank">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-200 bg-white hover:bg-slate-50 text-slate-900 cursor-pointer shadow-sm transition-all hover:scale-105">
                  <Code2 className="w-5 h-5 mr-2 text-slate-500" />
                  View on GitHub
                </Button>
              </Link>
            </div>

            {/* UI Mockup - Light Glass Effect */}
            <div className="mt-20 relative w-full max-w-6xl mx-auto rounded-xl border border-slate-200/60 shadow-2xl bg-white/40 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 group">
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent z-10"></div>
              <div className="aspect-[16/9] w-full bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center relative">
                {/* Abstract UI representation */}
                <div className="w-full h-full border border-slate-200 rounded-lg bg-white p-6 grid grid-cols-12 gap-6 opacity-90 group-hover:opacity-100 transition-opacity duration-700 shadow-sm">
                  <div className="col-span-3 h-full border-r border-slate-100 flex flex-col gap-4 pr-6">
                    <div className="h-8 w-32 bg-slate-100 rounded-md animate-pulse"></div>
                    <div className="h-4 w-20 bg-slate-50 rounded-md"></div>
                    <div className="h-4 w-24 bg-slate-50 rounded-md"></div>
                    <div className="h-4 w-16 bg-slate-50 rounded-md"></div>
                    <div className="mt-auto h-12 w-full bg-indigo-50 rounded-lg border border-indigo-100"></div>
                  </div>
                  <div className="col-span-9 h-full flex flex-col gap-6">
                    <div className="flex justify-between">
                      <div className="h-8 w-48 bg-slate-100 rounded-md"></div>
                      <div className="flex gap-2">
                        <div className="h-8 w-8 rounded-full bg-purple-100"></div>
                        <div className="h-8 w-8 rounded-full bg-blue-100"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 h-full">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-full bg-slate-50/50 rounded-lg p-4 flex flex-col gap-3 border border-slate-100">
                          <div className="h-3 w-16 bg-slate-200 rounded-full"></div>
                          <div className="h-24 w-full bg-white rounded-md border border-slate-100 p-3 shadow-sm">
                            <div className="h-3 w-3/4 bg-slate-100 rounded mb-2"></div>
                            <div className="h-2 w-1/2 bg-slate-50 rounded"></div>
                            <div className="mt-4 flex justify-between">
                              <div className="h-4 w-12 bg-indigo-100 rounded-full"></div>
                            </div>
                          </div>
                          <div className="h-24 w-full bg-white rounded-md border border-slate-100 p-3 opacity-60">
                            <div className="h-3 w-3/4 bg-slate-100 rounded mb-2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Partner / Trusted By */}
          <section className="py-12 border-y border-slate-200 bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-sm font-medium text-slate-500 mb-8 uppercase tracking-widest">Trusted by efficient teams everywhere</p>
              <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 mix-blend-multiply">
                {/* Text Logos for demo */}
                <h3 className="text-xl font-bold font-mono text-slate-800">ACME Corp</h3>
                <h3 className="text-xl font-bold font-serif text-slate-800">Globex</h3>
                <h3 className="text-xl font-bold italic text-slate-800">Soylent</h3>
                <h3 className="text-xl font-bold font-sans text-slate-800">Umbrella</h3>
                <h3 className="text-xl font-bold tracking-tighter text-slate-800">Initech</h3>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-24 md:py-32 relative bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">Built for Modern Engineering</h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  We ve taken the core features you rely on and enhanced them with intelligent automation and analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-500/30 hover:bg-slate-100 transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Layout className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-slate-900">Kanban & Visual Boards</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Drag-and-drop swimlanes, custom statuses, and rapid-fire task management.
                    The interface you know, refined for speed.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-purple-500/30 hover:bg-slate-100 transition-all duration-300 group relative overflow-hidden shadow-sm hover:shadow-md cursor-pointer">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] rounded-full pointer-events-none"></div>
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Bot className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-slate-900">AI Effort Estimation</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Stop guessing. Our AI analyzes historical data and complexity metrics to predict precise effort points for every ticket.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-green-500/30 hover:bg-slate-100 transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <LineChart className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-slate-900">Real-time Velocity</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Live insights into your team's performance. Track burn-down charts and cycle time without manual configuration.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center gap-6 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <Lock className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 text-slate-900">Enterprise Security</h4>
                    <p className="text-slate-600 text-sm">SSO, 2FA, and Role-Based Access Control included by default.</p>
                  </div>
                </div>
                <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center gap-6 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 text-slate-900">Lightning Fast</h4>
                    <p className="text-slate-600 text-sm">Optimized for performance. Zero lag, even with thousands of tickets.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Workflow Section */}
          <section id="workflow" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center gap-16">
                <div className="w-full md:w-1/2">
                  <h2 className="text-3xl md:text-5xl font-bold mb-8 text-slate-900">How Velociti Works</h2>
                  <div className="space-y-8">
                    {[
                      { title: "Create a Task", desc: "Add your user stories or bugs.", icon: <MessageSquare className="text-slate-600" /> },
                      { title: "AI Analysis", desc: "Our engine scans the description for key complexity indicators.", icon: <Sparkles className="text-purple-600" /> },
                      { title: "Receive Estimate", desc: "Get an instant story point recommendation.", icon: <BarChart3 className="text-slate-600" /> },
                      { title: "Track Progress", desc: "Move it across the board to completion.", icon: <CheckCircle2 className="text-green-600" /> }
                    ].map((step, index) => (
                      <div key={index} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-lg text-slate-700 shadow-sm group-hover:border-indigo-500 group-hover:text-indigo-600 transition-colors">
                            {index + 1}
                          </div>
                          {index !== 3 && <div className="w-0.5 h-full bg-slate-200 my-2"></div>}
                        </div>
                        <div className="pb-8">
                          <h4 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                            {step.title} {step.icon && <span className="[&>svg]:w-5 [&>svg]:h-5">{step.icon}</span>}
                          </h4>
                          <p className="text-slate-600 mt-2">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
                    {/* Graphic showing AI processing */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50"></div>
                    <div className="relative p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                      <Bot className="w-24 h-24 text-indigo-600 mb-6 animate-bounce" />
                      <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 text-left w-full max-w-sm border border-slate-200 shadow-lg">
                        <div className="flex justify-between text-xs text-slate-500 mb-2">
                          <span>ANALYSIS COMPLETE</span>
                          <span>98% CONFIDENCE</span>
                        </div>
                        <div className="text-lg font-mono text-green-600 mb-1">
                          &gt; Estimated Effort: 5 Points
                        </div>
                        <div className="h-1 w-full bg-slate-200 rounded-full mt-4 overflow-hidden">
                          <div className="h-full bg-green-500 w-[70%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-50"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/40 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-slate-900">Ready to Accelerate?</h2>
              <p className="text-xl text-slate-600 mb-12">
                Join thousands of developers delivering faster with Velociti AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button className="h-16 px-10 text-xl rounded-full bg-indigo-600 text-white hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105 cursor-pointer">
                    Get Started Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="h-16 px-10 text-xl rounded-full border-slate-300 bg-white hover:bg-slate-50 text-slate-900 cursor-pointer">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-slate-200 bg-white text-slate-500">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="font-bold text-white">V</span>
                </div>
                <span className="text-xl font-bold text-slate-900">Velociti AI</span>
              </div>
              <p className="max-w-sm mb-6">
                Empowering software teams with intelligent estimation and streamlined workflows.
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholders */}
                <div className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors text-slate-700">
                  <span className="font-bold">X</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors text-slate-700">
                  <span className="font-bold">in</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors text-slate-700">
                  <span className="font-bold">Gh</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-indigo-600 transition-colors cursor-pointer">Features</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors cursor-pointer">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors cursor-pointer">Security</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors cursor-pointer">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-indigo-600 transition-colors cursor-pointer">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors cursor-pointer">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors cursor-pointer">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors cursor-pointer">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2025 Velociti AI Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-indigo-600 cursor-pointer">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-600 cursor-pointer">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
