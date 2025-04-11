import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BarChart3,
  Beaker,
  FlaskRoundIcon as Flask,
  LineChart,
  CheckCircle,
  ChevronRight,
  Star,
  Award,
  Shield,
  Zap,
  Users,
  Globe,
  Sparkles,
  ArrowUpRight,
  Gauge,
  Atom,
} from "lucide-react"
import { BubblesBackground } from "./components/bubbles-background"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-md transition-all duration-300">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-700">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-lg shadow-md group hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
              <Flask className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="tracking-tight">Gas Dynamix</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all after:duration-300"
            >
              Features
            </Link>
            <Link
              href="#solutions"
              className="text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all after:duration-300"
            >
              Solutions
            </Link>
            <Link
              href="#gallery"
              className="text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all after:duration-300"
            >
              Gallery
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all after:duration-300"
            >
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-sm font-medium text-blue-700 bg-blue-400 hover:text-blue-800 transition-all duration-300"
              >
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with High-Quality Gas Analysis Imagery */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-blue-50/50 to-white z-0"></div>
          <div className="absolute inset-0 bg-[url('/images/gas-analysis-hero.png')] bg-cover bg-center opacity-10 z-0"></div>

          {/* Enhanced bubbles in background */}
          <BubblesBackground count={20} minSize={30} maxSize={150} minSpeed={0.2} maxSpeed={0.8} />

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-blue-400/5 z-0 animate-gradient-shift"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="inline-flex items-center rounded-full border border-blue-200 bg-white/90 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-blue-700 shadow-md group hover:shadow-lg transition-all duration-300 hover:border-blue-300 max-w-max">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                  <span className="relative overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-50/0 via-blue-100/30 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></span>
                    <span className="relative">Premium Gas Analysis Platform</span>
                  </span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 animate-gradient-x">
                    Precision Gas Mixer Analysis for Industry Leaders
                  </h1>
                  <p className="max-w-[600px] text-blue-700/80 md:text-xl leading-relaxed">
                    Analyze, visualize, and manage gas composition data with our professional platform. Make informed
                    decisions with industry-leading accuracy and real-time insights.
                  </p>
                </div>

                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="#features">
                    <Button
                      size="lg"
                      className="gap-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-blue-300/30 hover:shadow-xl relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/0 via-blue-600/30 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></span>
                      <span className="relative">Learn More</span>
                      <ArrowRight className="h-4 w-4 relative group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                  <Link href="#solutions">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      Explore Features
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center space-x-4 text-sm text-blue-700/70">
                  <div className="flex items-center group hover:text-blue-700/90 transition-colors duration-200">
                    <CheckCircle className="mr-1.5 h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                    <span>Professional Analysis Tools</span>
                  </div>
                  <div className="flex items-center group hover:text-blue-700/90 transition-colors duration-200">
                    <CheckCircle className="mr-1.5 h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                    <span>Enterprise-grade Security</span>
                  </div>
                </div>
              </div>

              <div className="relative flex justify-center">
                {/* Enhanced background effects */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>

                <div className="relative w-full max-w-[600px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group hover:shadow-blue-200/30 transition-all duration-500 hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-700/20 z-10 rounded-2xl group-hover:from-blue-600/20 group-hover:to-blue-700/30 transition-colors duration-300"></div>
                  <Image
                    src="/images/gas-dashboard.png"
                    alt="Gas Analysis Dashboard"
                    className="object-cover w-full h-full rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    width={800}
                    height={600}
                    priority
                  />

                  {/* Enhanced floating UI elements */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-20 transform rotate-3 group-hover:rotate-0 transition-all duration-300 border border-blue-100 group-hover:border-blue-200">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm font-medium text-blue-900">Live Analysis</span>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-20 transform rotate-[-3deg] group-hover:rotate-0 transition-all duration-300 border border-blue-100 group-hover:border-blue-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <LineChart className="w-4 h-4 text-blue-700" />
                      </div>
                      <div>
                        <div className="text-xs text-blue-700/70">Methane</div>
                        <div className="text-sm font-medium text-blue-900">85.2%</div>
                      </div>
                    </div>
                  </div>

                  {/* New floating element */}
                  <div className="absolute top-1/2 -right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-20 transform translate-y-[-50%] group-hover:right-4 transition-all duration-500 border border-blue-100 group-hover:border-blue-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Gauge className="w-4 h-4 text-purple-700" />
                      </div>
                      <div>
                        <div className="text-xs text-blue-700/70">Accuracy</div>
                        <div className="text-sm font-medium text-blue-900">100%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced floating gas molecule illustrations */}
            <div className="absolute top-1/4 right-[5%] w-16 h-16 rounded-full bg-blue-100/50 backdrop-blur-sm flex items-center justify-center shadow-lg z-10 animate-float">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-200/30 animate-pulse"></div>
                <span className="relative text-blue-700 font-mono text-xs">CH₄</span>
              </div>
            </div>

            <div className="absolute bottom-1/4 left-[10%] w-12 h-12 rounded-full bg-blue-100/50 backdrop-blur-sm flex items-center justify-center shadow-lg z-10 animate-float animation-delay-1000">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-200/30 animate-pulse"></div>
                <span className="relative text-blue-700 font-mono text-xs">CO₂</span>
              </div>
            </div>

            <div className="absolute top-2/3 right-[15%] w-14 h-14 rounded-full bg-purple-100/50 backdrop-blur-sm flex items-center justify-center shadow-lg z-10 animate-float animation-delay-2000">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-purple-200/30 animate-pulse"></div>
                <span className="relative text-purple-700 font-mono text-xs">H₂</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Gas Analysis Metrics */}
        <section className="w-full py-12 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/20 to-blue-50/0 opacity-30"></div>
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:border-blue-200 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors duration-300">
                    <Atom className="w-6 h-6 text-blue-700" />
                  </div>
                  <h3 className="text-3xl font-bold text-blue-900 mb-1 group-hover:text-blue-800 transition-colors">
                    100%
                  </h3>
                  <p className="text-sm text-blue-700/70 group-hover:text-blue-700/90 transition-colors">
                    Analysis Accuracy
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:border-blue-200 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors duration-300">
                    <Zap className="w-6 h-6 text-green-700" />
                  </div>
                  <h3 className="text-3xl font-bold text-blue-900 mb-1 group-hover:text-blue-800 transition-colors">
                    30s
                  </h3>
                  <p className="text-sm text-blue-700/70 group-hover:text-blue-700/90 transition-colors">
                    Analysis Time
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:border-blue-200 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors duration-300">
                    <Flask className="w-6 h-6 text-purple-700" />
                  </div>
                  <h3 className="text-3xl font-bold text-blue-900 mb-1 group-hover:text-blue-800 transition-colors">
                    12+
                  </h3>
                  <p className="text-sm text-blue-700/70 group-hover:text-blue-700/90 transition-colors">
                    Gas Types Analyzed
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:border-blue-200 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors duration-300">
                    <Users className="w-6 h-6 text-amber-700" />
                  </div>
                  <h3 className="text-3xl font-bold text-blue-900 mb-1 group-hover:text-blue-800 transition-colors">
                    5000+
                  </h3>
                  <p className="text-sm text-blue-700/70 group-hover:text-blue-700/90 transition-colors">
                    Global Customers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Gas Types Showcase with High-Quality Images */}
        <section className="w-full py-20 bg-gradient-to-b from-white to-blue-50/30 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent z-10"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative z-20">
            <div className="text-center mb-12">
              <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 mb-4 hover:bg-blue-200 transition-colors duration-300 hover:shadow-md">
                Comprehensive Analysis
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600">
                Advanced Analysis for All Gas Types
              </h2>
              <p className="max-w-[800px] mx-auto text-blue-700/70 md:text-lg">
                Our platform provides detailed composition analysis for a wide range of gas types across multiple
                industries
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {/* Natural Gas Card - Enhanced with High-Quality Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-blue-300 rounded-2xl blur-xl opacity-30 group-hover:opacity-70 transform group-hover:scale-105 transition-all duration-300"></div>
                <div className="relative bg-white border border-blue-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300">
                      <Flask className="w-6 h-6 text-blue-700" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
                      Natural Gas
                    </h3>
                  </div>
                  <p className="text-blue-700/70 mb-4 group-hover:text-blue-700/90 transition-colors duration-300">
                    Comprehensive analysis of methane, ethane, propane, and other hydrocarbons in natural gas samples.
                  </p>
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100 group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-300">
                        CH₄
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100 group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-300">
                        C₂H₆
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100 group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-300">
                        C₃H₈
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100 group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-300">
                        C₄H₁₀
                      </span>
                    </div>
                    <div className="relative overflow-hidden rounded-lg">
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Image
                        src="/images/natural-gas.png"
                        alt="Natural Gas Analysis"
                        className="w-full h-40 object-cover rounded-lg transform group-hover:scale-110 transition-transform duration-500"
                        width={400}
                        height={200}
                      />
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowUpRight className="w-4 h-4 text-blue-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Biogas Card - Enhanced with High-Quality Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-blue-200 rounded-2xl blur-xl opacity-30 group-hover:opacity-70 transform group-hover:scale-105 transition-all duration-300"></div>
                <div className="relative bg-white border border-blue-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-colors duration-300">
                      <Beaker className="w-6 h-6 text-green-700" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
                      Biogas
                    </h3>
                  </div>
                  <p className="text-blue-700/70 mb-4 group-hover:text-blue-700/90 transition-colors duration-300">
                    Detailed composition analysis of biogas from anaerobic digestion, including methane and carbon
                    dioxide content.
                  </p>
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100 group-hover:bg-green-100 group-hover:border-green-200 transition-all duration-300">
                        CH₄
                      </span>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100 group-hover:bg-green-100 group-hover:border-green-200 transition-all duration-300">
                        CO₂
                      </span>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100 group-hover:bg-green-100 group-hover:border-green-200 transition-all duration-300">
                        H₂S
                      </span>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100 group-hover:bg-green-100 group-hover:border-green-200 transition-all duration-300">
                        N₂
                      </span>
                    </div>
                    <div className="relative overflow-hidden rounded-lg">
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Image
                        src="/images/biogas.png"
                        alt="Biogas Analysis"
                        className="w-full h-40 object-cover rounded-lg transform group-hover:scale-110 transition-transform duration-500"
                        width={400}
                        height={200}
                      />
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowUpRight className="w-4 h-4 text-green-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hydrogen Card - Enhanced with High-Quality Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-blue-200 rounded-2xl blur-xl opacity-30 group-hover:opacity-70 transform group-hover:scale-105 transition-all duration-300"></div>
                <div className="relative bg-white border border-blue-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-colors duration-300">
                      <Zap className="w-6 h-6 text-purple-700" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
                      Hydrogen
                    </h3>
                  </div>
                  <p className="text-blue-700/70 mb-4 group-hover:text-blue-700/90 transition-colors duration-300">
                    High-precision purity analysis for hydrogen gas used in fuel cells and industrial applications.
                  </p>
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-100 group-hover:bg-purple-100 group-hover:border-purple-200 transition-all duration-300">
                        H₂
                      </span>
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-100 group-hover:bg-purple-100 group-hover:border-purple-200 transition-all duration-300">
                        O₂
                      </span>
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-100 group-hover:bg-purple-100 group-hover:border-purple-200 transition-all duration-300">
                        N₂
                      </span>
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-100 group-hover:bg-purple-100 group-hover:border-purple-200 transition-all duration-300">
                        H₂O
                      </span>
                    </div>
                    <div className="relative overflow-hidden rounded-lg">
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Image
                        src="/images/hydrogen.png"
                        alt="Hydrogen Analysis"
                        className="w-full h-40 object-cover rounded-lg transform group-hover:scale-110 transition-transform duration-500"
                        width={400}
                        height={200}
                      />
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowUpRight className="w-4 h-4 text-purple-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-12">
              <Link href="#gallery">
                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-xl relative overflow-hidden group">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/0 via-blue-600/30 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></span>
                  <span className="relative">View All Gas Types</span>
                  <ChevronRight className="h-4 w-4 relative group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* New Gas Gallery Section with High-Quality Images */}
        <section id="gallery" className="w-full py-20 bg-white relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 mb-4 hover:bg-blue-200 transition-colors duration-300 hover:shadow-md">
                Gas Analysis Gallery
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600">
                Explore Our Gas Analysis Capabilities
              </h2>
              <p className="max-w-[800px] mx-auto text-blue-700/70 md:text-lg">
                View our high-precision analysis technology in action across various gas types and industrial
                applications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Gallery Item 1 */}
              <div className="relative overflow-hidden rounded-xl shadow-lg group">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 z-10"></div>
                <Image
                  src="/images/gas-analysis-lab.png"
                  alt="Gas Analysis Laboratory"
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  width={400}
                  height={300}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white font-bold text-lg mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    Laboratory Analysis
                  </h3>
                  <p className="text-blue-100 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    High-precision gas chromatography for detailed composition analysis
                  </p>
                </div>
              </div>

              {/* Gallery Item 2 */}
              <div className="relative overflow-hidden rounded-xl shadow-lg group">
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 z-10"></div>
                <Image
                  src="/images/lng-storage.png"
                  alt="LNG Storage Facility"
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  width={400}
                  height={300}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white font-bold text-lg mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    LNG Quality Control
                  </h3>
                  <p className="text-green-100 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    Real-time monitoring of liquefied natural gas composition and purity
                  </p>
                </div>
              </div>

              {/* Gallery Item 3 */}
              <div className="relative overflow-hidden rounded-xl shadow-lg group">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 z-10"></div>
                <Image
                  src="/images/flue-gas.png"
                  alt="Flue Gas Analysis"
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  width={400}
                  height={300}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white font-bold text-lg mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    Flue Gas Monitoring
                  </h3>
                  <p className="text-purple-100 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    Continuous emissions monitoring for environmental compliance
                  </p>
                </div>
              </div>

              {/* Gallery Item 4 */}
              <div className="relative overflow-hidden rounded-xl shadow-lg group">
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 via-amber-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 z-10"></div>
                <Image
                  src="/images/gas-industry.png"
                  alt="Gas Industry"
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  width={400}
                  height={300}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white font-bold text-lg mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    Industrial Applications
                  </h3>
                  <p className="text-amber-100 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    Process gas monitoring for manufacturing and industrial facilities
                  </p>
                </div>
              </div>

              {/* Gallery Item 5 */}
              <div className="relative overflow-hidden rounded-xl shadow-lg group">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 z-10"></div>
                <Image
                  src="/images/natural-gas.png"
                  alt="Natural Gas Pipeline"
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  width={400}
                  height={300}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white font-bold text-lg mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    Pipeline Monitoring
                  </h3>
                  <p className="text-blue-100 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    Continuous gas composition analysis for transmission pipelines
                  </p>
                </div>
              </div>

              {/* Gallery Item 6 */}
              <div className="relative overflow-hidden rounded-xl shadow-lg group">
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 z-10"></div>
                <Image
                  src="/images/hydrogen.png"
                  alt="Hydrogen Production"
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  width={400}
                  height={300}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white font-bold text-lg mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    Hydrogen Production
                  </h3>
                  <p className="text-green-100 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    Purity verification for green hydrogen production facilities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Gas Analysis Imagery */}
        <section
          id="features"
          className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-blue-50/30 overflow-hidden relative"
        >
          {/* Background decorative elements */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 mb-2 hover:bg-blue-200 transition-colors duration-300 hover:shadow-md">
                Premium Features
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 animate-gradient-x">
                  Advanced Gas Analysis Tools
                </h2>
                <p className="max-w-[900px] text-blue-700/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides comprehensive tools for gas composition analysis and project management.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
              {/* Feature 1 - Enhanced with High-Quality Image */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex flex-col items-center space-y-6 rounded-2xl border border-blue-100 p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-200 bg-white">
                  <div className="relative">
                    <div className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white shadow-md group-hover:from-blue-600 group-hover:to-blue-700 transition-colors duration-300 group-hover:shadow-lg">
                      <Beaker className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:bg-blue-700 transition-colors duration-300 group-hover:scale-110">
                      1
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
                    High-Precision Analysis
                  </h3>
                  <p className="text-center text-blue-700/70 group-hover:text-blue-700/90 transition-colors duration-300">
                    Analyze gas compositions with 100% accuracy using our advanced algorithms and calibrated sensors.
                  </p>
                  <div className="relative w-full overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Image
                      src="/images/gas-analysis-lab.png"
                      alt="Gas Composition Analysis"
                      className="rounded-lg shadow-md w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                      width={280}
                      height={160}
                    />
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Sparkles className="w-4 h-4 text-blue-700" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 - Enhanced with High-Quality Image */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex flex-col items-center space-y-6 rounded-2xl border border-blue-100 p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-200 bg-white">
                  <div className="relative">
                    <div className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white shadow-md group-hover:from-blue-600 group-hover:to-blue-700 transition-colors duration-300 group-hover:shadow-lg">
                      <LineChart className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:bg-blue-700 transition-colors duration-300 group-hover:scale-110">
                      2
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
                    Real-time Visualization
                  </h3>
                  <p className="text-center text-blue-700/70 group-hover:text-blue-700/90 transition-colors duration-300">
                    View your gas data in real-time with interactive charts and customizable dashboards for immediate
                    insights.
                  </p>
                  <div className="relative w-full overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Image
                      src="/images/gas-dashboard.png"
                      alt="Gas Data Visualization"
                      className="rounded-lg shadow-md w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                      width={280}
                      height={160}
                    />
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Sparkles className="w-4 h-4 text-blue-700" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3 - Enhanced with High-Quality Image */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex flex-col items-center space-y-6 rounded-2xl border border-blue-100 p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-200 bg-white">
                  <div className="relative">
                    <div className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white shadow-md group-hover:from-blue-600 group-hover:to-blue-700 transition-colors duration-300 group-hover:shadow-lg">
                      <BarChart3 className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:bg-blue-700 transition-colors duration-300 group-hover:scale-110">
                      3
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
                    Comprehensive Reporting
                  </h3>
                  <p className="text-center text-blue-700/70 group-hover:text-blue-700/90 transition-colors duration-300">
                    Generate detailed gas composition reports and export data in multiple formats for further analysis.
                  </p>
                  <div className="relative w-full overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Image
                      src="/images/gas-industry.png"
                      alt="Gas Analysis Reports"
                      className="rounded-lg shadow-md w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                      width={280}
                      height={160}
                    />
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Sparkles className="w-4 h-4 text-blue-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Showcase with Gas Industry Images */}
        <section id="solutions" className="w-full py-20 md:py-32 bg-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full opacity-60 animate-pulse-slow"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200 rounded-full opacity-60 animate-pulse-slow animation-delay-1000"></div>

                {/* Main image - Enhanced with High-Quality Image */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-700/20 z-10 rounded-2xl group-hover:from-blue-600/20 group-hover:to-blue-700/30 transition-colors duration-300"></div>
                  <Image
                    src="/images/natural-gas.png"
                    alt="Gas Analysis Platform"
                    className="relative z-0 rounded-2xl w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    width={600}
                    height={500}
                  />
                </div>

                {/* Floating elements - Enhanced */}
                <div className="absolute top-10 -right-10 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl z-20 transform rotate-3 group-hover:rotate-0 transition-all duration-300 w-40 border border-blue-100 hover:border-blue-200 hover:shadow-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <Star className="w-4 h-4 text-blue-700" />
                    </div>
                    <div>
                      <div className="text-xs text-blue-700/70">Methane</div>
                      <div className="text-sm font-bold text-blue-900">85.2%</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 left-10 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl z-20 transform -rotate-2 group-hover:rotate-0 transition-all duration-300 w-48 border border-blue-100 hover:border-blue-200 hover:shadow-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-700" />
                    </div>
                    <div>
                      <div className="text-xs text-blue-700/70">Analysis Time</div>
                      <div className="text-sm font-bold text-blue-900">30 seconds</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 hover:bg-blue-200 transition-colors duration-300 hover:shadow-md">
                  Industry Solutions
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 animate-gradient-x">
                  Tailored Gas Analysis for Every Industry
                </h2>
                <p className="text-blue-700/70 text-lg">
                  Our platform combines cutting-edge technology with intuitive design to provide the most comprehensive
                  gas analysis solution for your specific industry needs.
                </p>
                <ul className="space-y-4">
                  {[
                    "Oil & Gas: Natural gas composition analysis with 100% accuracy",
                    "Renewable Energy: Biogas and hydrogen purity verification",
                    "Environmental: Greenhouse gas monitoring and emissions tracking",
                    "Industrial: Process gas quality control and safety monitoring",
                    "Research: High-precision analysis for laboratory applications",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start group">
                      <div className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 transition-colors duration-300 transform group-hover:scale-110">
                        <CheckCircle className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-blue-700/80 group-hover:text-blue-700/100 transition-colors duration-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Link href="#features">
                    <Button className="gap-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-xl relative overflow-hidden group">
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/0 via-blue-600/30 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></span>
                      <span className="relative">Learn More</span>
                      <ArrowRight className="h-4 w-4 relative group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials with Industry Professionals */}
        <section
          id="testimonials"
          className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-blue-50/30 relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent z-10"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 mb-4 hover:bg-blue-200 transition-colors duration-300 hover:shadow-md">
                Client Testimonials
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 animate-gradient-x">
                Trusted by Gas Analysis Professionals
              </h2>
              <p className="max-w-[800px] mx-auto text-blue-700/70 md:text-lg">
                See what industry leaders are saying about our gas analysis platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 - Enhanced */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 group-hover:border-blue-200 h-full flex flex-col transform group-hover:translate-y-[-5px]">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&q=80"
                      alt="John Smith"
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 group-hover:border-blue-200 transition-colors duration-300 shadow-md group-hover:shadow-lg"
                    />
                    <div>
                      <h3 className="font-bold text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
                        John Smith
                      </h3>
                      <p className="text-sm text-blue-700/70 group-hover:text-blue-700/90 transition-colors duration-300">
                        Chief Engineer, Energy Corp
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-yellow-500 group-hover:scale-110 transition-transform duration-300"
                      />
                    ))}
                  </div>
                  <p className="text-blue-700/70 italic mb-4 group-hover:text-blue-700/90 transition-colors duration-300">
                    "GasAnalytics has revolutionized our natural gas analysis process. The real-time data and accuracy
                    have improved our operational efficiency by 35%."
                  </p>
                  <div className="mt-auto pt-4 border-t border-blue-100 group-hover:border-blue-200 transition-colors duration-300">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-700" />
                      <span className="text-xs text-blue-700/70 group-hover:text-blue-700/90 transition-colors duration-300">
                        Using GasAnalytics since 2023
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 - Enhanced */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 group-hover:border-blue-200 h-full flex flex-col transform group-hover:translate-y-[-5px]">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&q=80"
                      alt="Sarah Johnson"
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 group-hover:border-blue-200 transition-colors duration-300 shadow-md group-hover:shadow-lg"
                    />
                    <div>
                      <h3 className="font-bold text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
                        Sarah Johnson
                      </h3>
                      <p className="text-sm text-blue-700/70 group-hover:text-blue-700/90 transition-colors duration-300">
                        Research Director, BioGas Tech
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-yellow-500 group-hover:scale-110 transition-transform duration-300"
                      />
                    ))}
                  </div>
                  <p className="text-blue-700/70 italic mb-4 group-hover:text-blue-700/90 transition-colors duration-300">
                    "The biogas analysis capabilities are unmatched. We've been able to optimize our production process
                    and increase methane yield by 22% using the insights from GasAnalytics."
                  </p>
                  <div className="mt-auto pt-4 border-t border-blue-100 group-hover:border-blue-200 transition-colors duration-300">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-700" />
                      <span className="text-xs text-blue-700/70 group-hover:text-blue-700/90 transition-colors duration-300">
                        Using GasAnalytics since 2022
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 - Enhanced */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 group-hover:border-blue-200 h-full flex flex-col transform group-hover:translate-y-[-5px]">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces&q=80"
                      alt="Michael Chen"
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 group-hover:border-blue-200 transition-colors duration-300 shadow-md group-hover:shadow-lg"
                    />
                    <div>
                      <h3 className="font-bold text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
                        Michael Chen
                      </h3>
                      <p className="text-sm text-blue-700/70 group-hover:text-blue-700/90 transition-colors duration-300">
                        CTO, H2 Solutions
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-yellow-500 group-hover:scale-110 transition-transform duration-300"
                      />
                    ))}
                  </div>
                  <p className="text-blue-700/70 italic mb-4 group-hover:text-blue-700/90 transition-colors duration-300">
                    "For hydrogen purity analysis, GasAnalytics is the gold standard. The precision and reliability have
                    been crucial for our fuel cell applications and safety protocols."
                  </p>
                  <div className="mt-auto pt-4 border-t border-blue-100 group-hover:border-blue-200 transition-colors duration-300">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-700" />
                      <span className="text-xs text-blue-700/70 group-hover:text-blue-700/90 transition-colors duration-300">
                        Using GasAnalytics since 2023
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section with Gas Molecule Background */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-800 z-0"></div>
          <div className="absolute inset-0 bg-[url('/images/gas-analysis-hero.png')] bg-cover bg-center opacity-10 z-0"></div>

          {/* Enhanced floating molecules */}
          <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-blue-500/20 backdrop-blur-sm flex items-center justify-center z-10 animate-float">
            <span className="text-white/80 font-mono text-lg">CH₄</span>
          </div>
          <div className="absolute bottom-1/3 right-1/5 w-16 h-16 rounded-full bg-blue-500/20 backdrop-blur-sm flex items-center justify-center z-10 animate-float animation-delay-1000">
            <span className="text-white/80 font-mono text-lg">CO₂</span>
          </div>
          <div className="absolute top-2/3 left-1/3 w-12 h-12 rounded-full bg-blue-500/20 backdrop-blur-sm flex items-center justify-center z-10 animate-float animation-delay-2000">
            <span className="text-white/80 font-mono text-sm">H₂</span>
          </div>
          <div className="absolute top-1/3 right-1/4 w-14 h-14 rounded-full bg-purple-500/20 backdrop-blur-sm flex items-center justify-center z-10 animate-float animation-delay-1500">
            <span className="text-white/80 font-mono text-sm">N₂</span>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 animate-gradient-x">
                Ready to Transform Your Gas Analysis Process?
              </h2>
              <p className="text-blue-100 md:text-lg mb-8">
                Join thousands of industry professionals who trust GasAnalytics for precise, reliable gas composition
                analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="#contact">
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-blue-300/30 hover:shadow-xl w-full sm:w-auto relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-blue-100/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></span>
                    <span className="relative">Contact Us</span>
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-blue-700/20 w-full sm:w-auto"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-200" />
                  <span className="text-blue-100 text-sm">Enterprise-grade security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-200" />
                  <span className="text-blue-100 text-sm">24/7 support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-200" />
                  <span className="text-blue-100 text-sm">Global coverage</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="w-full border-t border-blue-100 bg-gradient-to-b from-white to-blue-50/30 py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-semibold text-blue-700">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-lg shadow-md">
                  <Flask className="h-5 w-5" />
                </div>
                <span>GasAnalytics</span>
              </div>
              <p className="text-sm text-blue-700/70">
                Advanced gas composition analysis platform for industry professionals.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-blue-700/70 hover:text-blue-700 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-blue-700/70 hover:text-blue-700 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-blue-700/70 hover:text-blue-700 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-blue-700/70 hover:text-blue-700 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-blue-900">Gas Solutions</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                    Natural Gas
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                    Biogas
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                    Hydrogen
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                    LNG
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                    Flue Gas
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-blue-900">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-blue-900">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                    Data Processing
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-100 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-blue-700/70">
              © 2025 GasAnalytics. All rights reserved. Designed by{" "}
              <span className="text-blue-700 font-medium">Lunar Studio</span>
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-blue-700/70 hover:text-blue-700 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
        <div className="text-center text-xs sm:text-sm text-blue-700/70 group-hover:text-blue-700/90 transition-colors duration-300">
          <Link
            href="/login"
            className="text-blue-700 hover:text-blue-800 font-medium hover:underline transition-colors duration-200 relative hover:after:w-full after:absolute after:left-0 after:bottom-0 after:h-px after:bg-blue-700 after:w-0 after:transition-all after:duration-300"
          >
            Log in to your account
          </Link>
        </div>
      </footer>
    </div>
  )
}

