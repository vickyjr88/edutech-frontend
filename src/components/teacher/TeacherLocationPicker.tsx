import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GooglePlacesAutocomplete from "./GooglePlacesAutocomplete";

interface TeacherLocationPickerProps {
  onLocationSelect: (location: {
    address: string;
    apartment: string;
    houseNumber: string;
    city: string;
    county: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  }) => void;
  initialAddress?: string;
  initialApartment?: string;
  initialHouseNumber?: string;
  initialCity?: string;
  initialCounty?: string;
  initialPostalCode?: string;
}

const TeacherLocationPicker: React.FC<TeacherLocationPickerProps> = ({
  onLocationSelect,
  initialAddress = "",
  initialApartment = "",
  initialHouseNumber = "",
  initialCity = "",
  initialCounty = "",
  initialPostalCode = "",
}) => {
  const [selectedLocation, setSelectedLocation] = useState({
    address: initialAddress,
    apartment: initialApartment,
    houseNumber: initialHouseNumber,
    city: initialCity,
    county: initialCounty,
    postalCode: initialPostalCode,
    latitude: 0,
    longitude: 0,
  });

  const [showManualEntry, setShowManualEntry] = useState(false);

  useEffect(() => {
    if (initialAddress || initialCity || initialCounty || initialPostalCode) {
      setSelectedLocation({
        address: initialAddress,
        apartment: initialApartment,
        houseNumber: initialHouseNumber,
        city: initialCity,
        county: initialCounty,
        postalCode: initialPostalCode,
        latitude: -1.2921, // Default to Nairobi coordinates
        longitude: 36.8219,
      });
    }
  }, [initialAddress, initialApartment, initialHouseNumber, initialCity, initialCounty, initialPostalCode]);

  const handlePlaceSelect = (place: any) => {
    const location = {
      address: place.address,
      apartment: selectedLocation.apartment, // Keep existing apartment info
      houseNumber: place.houseNumber || "",
      city: place.city,
      county: place.county,
      postalCode: place.postalCode,
      latitude: place.latitude,
      longitude: place.longitude,
    };
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  const handleManualInputChange = (field: string, value: string) => {
    const updatedLocation = { ...selectedLocation, [field]: value };
    setSelectedLocation(updatedLocation);
    onLocationSelect(updatedLocation);
  };

  const formatLocationDisplay = () => {
    const parts = [
      selectedLocation.address,
      selectedLocation.city,
      selectedLocation.county,
      selectedLocation.postalCode
    ].filter(Boolean);
    
    return parts.join(", ");
  };

  return (
    <div className="space-y-4 w-full">
      {/* Google Places Autocomplete */}
      <div className="space-y-2">
        <Label>Search for Location</Label>
        <GooglePlacesAutocomplete
          onPlaceSelect={handlePlaceSelect}
          placeholder="Type your teaching location address..."
          initialValue={selectedLocation.address}
        />
        <p className="text-xs text-gray-500">
          Start typing to search for your address using Google Places
        </p>
      </div>

      {/* Manual Entry Fallback */}
      {!selectedLocation.address && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Can't find your location?</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowManualEntry(!showManualEntry)}
            >
              {showManualEntry ? "Hide" : "Enter manually"}
            </Button>
          </div>

          {showManualEntry && (
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-start space-x-2 mb-3">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm text-orange-800 font-medium">Manual Entry</p>
                  <p className="text-xs text-orange-700">
                    Use this if Google Places doesn't recognize your location
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="manual-address" className="text-xs">Street Address</Label>
                  <Input
                    id="manual-address"
                    value={selectedLocation.address}
                    onChange={(e) => handleManualInputChange("address", e.target.value)}
                    placeholder="Enter full street address"
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="manual-city" className="text-xs">City</Label>
                    <Input
                      id="manual-city"
                      value={selectedLocation.city}
                      onChange={(e) => handleManualInputChange("city", e.target.value)}
                      placeholder="City"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manual-county" className="text-xs">County/State</Label>
                    <Input
                      id="manual-county"
                      value={selectedLocation.county}
                      onChange={(e) => handleManualInputChange("county", e.target.value)}
                      placeholder="County"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="manual-postal" className="text-xs">Postal Code</Label>
                  <Input
                    id="manual-postal"
                    value={selectedLocation.postalCode}
                    onChange={(e) => handleManualInputChange("postalCode", e.target.value)}
                    placeholder="Postal code"
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Selected Location Display */}
      {selectedLocation.address && (
        <div className="space-y-3">
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-green-900">Selected Location</p>
                <p className="text-sm text-green-800">{formatLocationDisplay()}</p>
              </div>
            </div>
          </Card>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="house-number" className="text-xs text-gray-500">
                House/Building Number
              </Label>
              <Input
                id="house-number"
                value={selectedLocation.houseNumber}
                onChange={(e) => handleManualInputChange("houseNumber", e.target.value)}
                placeholder="e.g., 123, Building A"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="apartment" className="text-xs text-gray-500">
                Apartment/Unit Details
              </Label>
              <Input
                id="apartment"
                value={selectedLocation.apartment}
                onChange={(e) => handleManualInputChange("apartment", e.target.value)}
                placeholder="e.g., Apt 4B, Unit 12"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLocationPicker;