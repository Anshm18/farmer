"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

declare global {
  interface Window {
    google: any
  }
}

interface LocationMapProps {
  onLocationSelect?: (lat: number, lon: number) => void
  showSearch?: boolean
  markerLocations?: Array<{ lat: number; lon: number; title: string }>
}

export function LocationMap({ onLocationSelect, showSearch = true, markerLocations = [] }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const searchBoxRef = useRef<any>(null)
  const [map, setMap] = useState<any>(null)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map
    const initialLocation = { lat: 40.7128, lng: -74.006 } // Default: New York

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: initialLocation,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: false,
    })

    mapInstanceRef.current = mapInstance
    setMap(mapInstance)

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        const userLocation = { lat: latitude, lng: longitude }
        mapInstance.setCenter(userLocation)
        setCurrentLocation({ lat: latitude, lon: longitude })

        // Add marker for current location
        new window.google.maps.Marker({
          position: userLocation,
          map: mapInstance,
          title: "Your Location",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        })
      })
    }

    // Add markers for products
    markerLocations.forEach((location) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lon },
        map: mapInstance,
        title: location.title,
      })

      marker.addListener("click", () => {
        new window.google.maps.InfoWindow({
          content: `<div class="p-2"><strong>${location.title}</strong></div>`,
        }).open(mapInstance, marker)
      })
    })

    // Initialize search box
    if (showSearch) {
      const searchInput = document.getElementById("map-search") as HTMLInputElement
      if (searchInput) {
        const searchBox = new window.google.maps.places.SearchBox(searchInput)
        searchBoxRef.current = searchBox

        mapInstance.addListener("bounds_changed", () => {
          searchBox.setBounds(mapInstance.getBounds())
        })

        searchBox.addListener("places_changed", () => {
          const places = searchBox.getPlaces()

          if (places.length === 0) return

          const place = places[0]
          if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry")
            return
          }

          const loc = place.geometry.location
          mapInstance.setCenter(loc)
          mapInstance.setZoom(15)

          setCurrentLocation({ lat: loc.lat(), lon: loc.lng() })
          onLocationSelect?.(loc.lat(), loc.lng())

          // Add marker for selected location
          new window.google.maps.Marker({
            position: loc,
            map: mapInstance,
            title: place.name,
          })
        })
      }
    }
  }, [onLocationSelect, showSearch, markerLocations])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Location Finder</CardTitle>
        <CardDescription>Search for nearby farms or set your location</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSearch && <Input id="map-search" type="text" placeholder="Search for a location..." className="w-full" />}
        <div ref={mapRef} className="w-full h-96 rounded-lg border border-border overflow-hidden" />
        {currentLocation && (
          <div className="p-3 bg-background border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">Selected Location:</p>
            <p className="font-mono text-sm">
              {currentLocation.lat.toFixed(4)}, {currentLocation.lon.toFixed(4)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
