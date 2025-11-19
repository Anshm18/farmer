"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, Leaf, TrendingUp, Users, MapPin, Award } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)

    // Check if user is logged in
    const user = localStorage.getItem("currentUser")
    setIsLoggedIn(!!user)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-card/95 backdrop-blur border-b border-border shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              FarmerHub
            </h1>
          </Link>
          <div className="flex gap-3">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" className="hidden sm:inline-flex bg-transparent">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    localStorage.clear()
                    setIsLoggedIn(false)
                    router.push("/")
                  }}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="hidden sm:inline-flex bg-transparent">
                    Login
                  </Button>
                </Link>
                <Button onClick={handleGetStarted} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
              <span className="text-sm font-semibold text-primary">Launch Your Farm Business</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-pretty">
              Farm to Market, Direct & Fast
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Connect with buyers instantly. Farmers list fresh produce, vendors discover quality products nearby with
              real-time maps, and build sustainable relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent"
              >
                Start Now
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Learn More
              </Button>
            </div>
            <div className="flex gap-8 mt-12 text-sm">
              <div>
                <div className="font-bold text-foreground text-xl">10K+</div>
                <div className="text-muted-foreground">Active Farmers</div>
              </div>
              <div>
                <div className="font-bold text-foreground text-xl">5K+</div>
                <div className="text-muted-foreground">Vendors</div>
              </div>
              <div>
                <div className="font-bold text-foreground text-xl">99%</div>
                <div className="text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
            <Card className="relative p-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="text-center">
                <div className="text-7xl mb-6">🌾</div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Fresh From Farm</h3>
                <p className="text-muted-foreground">Direct connection to quality produce</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card/50 py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-foreground mb-4">Why Choose FarmerHub?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed in the modern agricultural marketplace
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Location-Based Discovery",
                desc: "Find farmers or vendors near you with real-time mapping",
              },
              {
                icon: ShoppingCart,
                title: "Seamless Transactions",
                desc: "Easy ordering, tracking, and payment management",
              },
              {
                icon: Award,
                title: "Verified Trust",
                desc: "Reviews, ratings, and transparent product information",
              },
              {
                icon: TrendingUp,
                title: "Analytics Dashboard",
                desc: "Track sales, inventory, and business growth",
              },
              {
                icon: Users,
                title: "Direct Connection",
                desc: "No middlemen between farmers and buyers",
              },
              {
                icon: Leaf,
                title: "Sustainable Farming",
                desc: "Support local agriculture and fair pricing",
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="p-8 hover:shadow-lg transition-shadow border-border/50 hover:border-primary/30"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h4 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Card className="p-12 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Transform Your Business?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of farmers and vendors already using FarmerHub to grow their business
          </p>
          <Button onClick={handleGetStarted} size="lg" className="bg-gradient-to-r from-primary to-accent">
            Get Started Free
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-bold text-foreground mb-4">FarmerHub</h5>
              <p className="text-sm text-muted-foreground">Connecting farms to markets, directly and fairly.</p>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Product</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    For Farmers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    For Vendors
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2025 FarmerHub. Connecting farms to markets directly.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
