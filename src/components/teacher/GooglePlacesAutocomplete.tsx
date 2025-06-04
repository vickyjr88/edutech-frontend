import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";

interface PlaceResult {
  address: string;
  apartment: string;
  houseNumber: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (place: PlaceResult) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
  label?: string;
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  onPlaceSelect,
  placeholder = "Search for addresses, buildings, or places...",
  initialValue = "",
  className = "",
  label
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
      
      if (!apiKey) {
        setError("Google Maps API key not found. Please set VITE_GOOGLE_MAPS_KEY environment variable.");
        setIsLoading(false);
        return;
      }

      try {
        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places"]
        });

        await loader.load();

        if (inputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            types: ["address", "establishment", "geocode"],
            fields: [
              "address_components",
              "formatted_address",
              "geometry",
              "place_id",
              "name",
              "types"
            ],
            // Set bounds to Kenya region to prioritize local results but allow global search
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(-4.678, 33.909), // Southwest corner of Kenya
              new google.maps.LatLng(5.506, 41.899)   // Northeast corner of Kenya
            ),
            // Don't restrict bounds strictly - allow global search but prioritize Kenya
            strictBounds: false
          });

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            
            if (!place.geometry || !place.geometry.location) {
              console.error("No geometry data available for this place");
              return;
            }

            const addressComponents = place.address_components || [];
            const placeResult: PlaceResult = {
              address: place.formatted_address || "",
              apartment: "",
              houseNumber: "",
              city: "",
              county: "",
              postalCode: "",
              country: "",
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              placeId: place.place_id || ""
            };

            // Check if this is an establishment/business/specific building
            const isEstablishment = place.types?.includes('establishment') || 
                                   place.types?.includes('point_of_interest') ||
                                   place.types?.includes('premise');
            
            let streetAddress = "";
            let establishmentName = "";

            // Parse address components
            addressComponents.forEach((component) => {
              const types = component.types;
              
              if (types.includes("street_number")) {
                placeResult.houseNumber = component.long_name;
              } else if (types.includes("route")) {
                streetAddress = `${placeResult.houseNumber} ${component.long_name}`.trim();
              } else if (types.includes("subpremise")) {
                placeResult.apartment = component.long_name;
              } else if (types.includes("locality")) {
                placeResult.city = component.long_name;
              } else if (types.includes("sublocality_level_1") || types.includes("sublocality")) {
                if (!placeResult.city) placeResult.city = component.long_name;
              } else if (types.includes("administrative_area_level_1")) {
                placeResult.county = component.long_name;
              } else if (types.includes("postal_code")) {
                placeResult.postalCode = component.long_name;
              } else if (types.includes("country")) {
                placeResult.country = component.long_name;
              }
            });

            // Handle establishment names and build proper address
            if (isEstablishment && place.name) {
              establishmentName = place.name;
              
              // For establishments, prefer to show the establishment name with street address
              if (streetAddress) {
                placeResult.address = `${establishmentName}, ${streetAddress}`;
              } else {
                // If no street address, use the formatted address but prioritize the establishment name
                placeResult.address = place.formatted_address || establishmentName;
              }
            } else {
              // For regular addresses, use street address or formatted address
              placeResult.address = streetAddress || place.formatted_address || "";
            }

            // Ensure we have a valid address
            if (!placeResult.address && place.formatted_address) {
              placeResult.address = place.formatted_address;
            }

            setInputValue(place.formatted_address || "");
            onPlaceSelect(placeResult);
          });

          autocompleteRef.current = autocomplete;
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load Google Maps API:", err);
        console.error("API Key (first 10 chars):", apiKey?.substring(0, 10));
        
        // More specific error messages
        let errorMessage = "Failed to load Google Places. ";
        if (!apiKey) {
          errorMessage += "API key is missing.";
        } else if (err instanceof Error) {
          if (err.message.includes("API key")) {
            errorMessage += "Invalid API key or Places API not enabled.";
          } else if (err.message.includes("quota")) {
            errorMessage += "API quota exceeded.";
          } else if (err.message.includes("billing")) {
            errorMessage += "Billing account required.";
          } else {
            errorMessage += `Error: ${err.message}`;
          }
        } else {
          errorMessage += "Please check your internet connection and API key.";
        }
        
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    initializeAutocomplete();

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onPlaceSelect]);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  if (error) {
    return (
      <Card className="p-4 border-red-200 bg-red-50">
        <div className="flex items-center space-x-2 text-red-700">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={isLoading ? "Loading Google Places..." : placeholder}
          disabled={isLoading}
          className="pr-8"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <MapPin className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>
      {isLoading && (
        <p className="text-xs text-gray-500">
          Initializing Google Places autocomplete...
        </p>
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete;