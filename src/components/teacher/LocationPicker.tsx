
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GooglePlacesAutocomplete from "./GooglePlacesAutocomplete";

interface LocationPickerProps {
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

const LocationPicker = ({
  onLocationSelect,
  initialAddress = "",
  initialApartment = "",
  initialHouseNumber = "",
  initialCity = "",
  initialCounty = "",
  initialPostalCode = "",
}: LocationPickerProps) => {
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
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    // Initialize with any provided values
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

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use reverse geocoding to get address from coordinates
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();

          if (data.results && data.results[0]) {
            const result = data.results[0];
            const addressComponents = result.address_components;

            const location = {
              address: result.formatted_address,
              apartment: "",
              houseNumber: "",
              city: addressComponents.find((c: any) => c.types.includes("locality"))?.long_name || "",
              county: addressComponents.find((c: any) => c.types.includes("administrative_area_level_1"))?.long_name || "",
              postalCode: addressComponents.find((c: any) => c.types.includes("postal_code"))?.long_name || "",
              latitude,
              longitude,
            };

            setSelectedLocation(location);
            onLocationSelect(location);
          }
        } catch (error) {
          console.error("Error getting address from coordinates:", error);
          alert("Failed to get address from your location");
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Failed to get your current location");
        setIsGettingLocation(false);
      }
    );
  };

  const handleApartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = { ...selectedLocation, apartment: e.target.value };
    setSelectedLocation(newLocation);
    onLocationSelect(newLocation);
  };

  const handleHouseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = { ...selectedLocation, houseNumber: e.target.value };
    setSelectedLocation(newLocation);
    onLocationSelect(newLocation);
  };

  const handlePlaceSelect = (place: any) => {
    const location = {
      address: place.address,
      apartment: place.apartment || "",
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

  return (
    <div className="space-y-4 w-full">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Location Search</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="flex items-center gap-2"
          >
            {isGettingLocation ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Getting location...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                Use Current Location
              </>
            )}
          </Button>
        </div>
        <GooglePlacesAutocomplete
          onPlaceSelect={handlePlaceSelect}
          placeholder="Search for your teaching location..."
          initialValue={selectedLocation.address}
        />
      </div>

      {selectedLocation.address && (
        <div className="space-y-3">
          <div className="relative w-full h-40 bg-gray-200 rounded-md overflow-hidden">
            <div
              className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
              style={{
                backgroundImage: "url('https://via.placeholder.com/800x400/e5e7eb/94a3b8?text=Map')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <MapPin className="h-8 w-8 text-kidato-purple" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-kidato-purple rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="text-xs text-gray-500">Selected Location</Label>
              <p className="text-sm font-medium">{selectedLocation.address}</p>
              <p className="text-xs text-gray-600">
                {selectedLocation.city}, {selectedLocation.county}, {selectedLocation.postalCode}
              </p>
            </div>

            {/* House Number and Apartment Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div>
                <Label htmlFor="houseNumber" className="text-xs text-gray-500">House Number</Label>
                <Input
                  id="houseNumber"
                  value={selectedLocation.houseNumber}
                  onChange={handleHouseNumberChange}
                  placeholder="Enter house number"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="apartment" className="text-xs text-gray-500">Apartment Name/Number</Label>
                <Input
                  id="apartment"
                  value={selectedLocation.apartment}
                  onChange={handleApartmentChange}
                  placeholder="E.g., Apt 4B, Block C, etc."
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
