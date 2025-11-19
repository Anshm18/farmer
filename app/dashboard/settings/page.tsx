"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Lock, MapPin, DollarSign } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState({ name: "", email: "" })
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
  })

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setFormData({
        fullName: userData.name,
        email: userData.email,
        phone: "+91 98765 43210",
        city: "Pune",
        state: "Maharashtra",
      })
    }
  }, [])

  const handleSave = () => {
    const updatedUser = { ...user, name: formData.fullName }
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    alert("Settings saved successfully!")
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-bold text-foreground mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
            <Input
              placeholder="Your name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
            <Input placeholder="your@email.com" type="email" value={formData.email} disabled />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
            <Input
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-accent">
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Location Settings */}
      <Card className="p-6 border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Location</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">City</label>
            <Input
              placeholder="Your city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">State</label>
            <Input
              placeholder="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>
          <Button variant="outline">Update Location</Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Notifications</h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm text-foreground">New orders notifications</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm text-foreground">Message notifications</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm text-foreground">Weekly reports</span>
          </label>
        </div>
      </Card>

      {/* Payment Settings */}
      <Card className="p-6 border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Payment Methods</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-semibold text-foreground">Bank Account</p>
              <p className="text-xs text-muted-foreground">HDFC Bank - 1234****</p>
            </div>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6 border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Security</h3>
        </div>
        <Button variant="outline">Change Password</Button>
      </Card>
    </div>
  )
}
