import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink, Navigation } from "lucide-react";

interface ContactMapProps {
  address?: string;
  latitude?: number;
  longitude?: number;
}

const ContactMap: React.FC<ContactMapProps> = ({ 
  address = "123 Education Street, Learning District, LD 12345, United States",
  latitude = 40.7128,
  longitude = -74.0060
}) => {
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const openInMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  const getDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(directionsUrl, '_blank');
  };

  if (mapError) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Our Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Map Unavailable
            </h3>
            <p className="text-gray-600 mb-4">
              Unable to load the map. Please use the buttons below to view our location.
            </p>
            <div className="space-y-2">
              <Button onClick={openInMaps} className="w-full" variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Google Maps
              </Button>
              <Button onClick={getDirections} className="w-full" variant="outline">
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          Our Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Map Placeholder - Replace with actual map integration */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-pattern opacity-10"></div>
              <div className="text-center z-10">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <p className="text-blue-800 font-semibold">Interactive Map</p>
                <p className="text-blue-600 text-sm">Click to explore</p>
              </div>
            </div>
            
            {/* Address and Actions */}
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                <p className="text-sm text-gray-600">{address}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={openInMaps} size="sm" variant="outline" className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Map
                </Button>
                <Button onClick={getDirections} size="sm" variant="outline" className="flex-1">
                  <Navigation className="w-4 h-4 mr-2" />
                  Directions
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { ContactMap };
