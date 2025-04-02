
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationPickerProps {
  onLocationSelect: (location: {
    address: string;
    city: string;
    county: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  }) => void;
  initialAddress?: string;
  initialCity?: string;
  initialCounty?: string;
  initialPostalCode?: string;
}

const LocationPicker = ({
  onLocationSelect,
  initialAddress = "",
  initialCity = "",
  initialCounty = "",
  initialPostalCode = "",
}: LocationPickerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [mockResults, setMockResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState({
    address: initialAddress,
    city: initialCity,
    county: initialCounty,
    postalCode: initialPostalCode,
    latitude: 0,
    longitude: 0,
  });

  // Mock locations for demonstration
  const mockLocations = [
    {
      address: "123 Main Street",
      city: "Nairobi",
      county: "Nairobi County",
      postalCode: "00100",
      latitude: -1.2921,
      longitude: 36.8219,
    },
    {
      address: "456 Valley Road",
      city: "Nairobi",
      county: "Nairobi County",
      postalCode: "00200",
      latitude: -1.2747,
      longitude: 36.8116,
    },
    {
      address: "789 University Way",
      city: "Nairobi",
      county: "Nairobi County",
      postalCode: "00100",
      latitude: -1.2809,
      longitude: 36.8157,
    },
    {
      address: "321 Mombasa Road",
      city: "Nairobi",
      county: "Nairobi County",
      postalCode: "00500",
      latitude: -1.3183,
      longitude: 36.8288,
    },
    {
      address: "555 Ngong Road",
      city: "Nairobi",
      county: "Nairobi County",
      postalCode: "00200",
      latitude: -1.2985,
      longitude: 36.7766,
    },
  ];

  useEffect(() => {
    // Initialize with any provided values
    if (initialAddress || initialCity || initialCounty || initialPostalCode) {
      setSelectedLocation({
        address: initialAddress,
        city: initialCity,
        county: initialCounty,
        postalCode: initialPostalCode,
        latitude: -1.2921, // Default to Nairobi coordinates
        longitude: 36.8219,
      });
    }
  }, [initialAddress, initialCity, initialCounty, initialPostalCode]);

  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Filter mock locations based on search query
      const filteredLocations = mockLocations.filter(
        location => 
          location.address.toLowerCase().includes(searchQuery.toLowerCase()) || 
          location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.county.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setMockResults(filteredLocations);
      setIsSearching(false);
    }, 800);
  };

  const selectLocation = (location: any) => {
    setSelectedLocation(location);
    setMockResults([]);
    setSearchQuery("");
    onLocationSelect(location);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for an address..."
            onKeyDown={handleKeyDown}
            className="pr-10"
          />
          {searchQuery && (
            <button 
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setSearchQuery("")}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={handleSearch}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          title="Use current location"
          onClick={() => selectLocation(mockLocations[0])}
        >
          <MapPin className="w-4 h-4" />
        </Button>
      </div>

      {/* Mock search results */}
      {mockResults.length > 0 && (
        <Card className="p-2 max-h-60 overflow-y-auto">
          <ul className="divide-y">
            {mockResults.map((location, index) => (
              <li 
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                onClick={() => selectLocation(location)}
              >
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-gray-500" />
                  <div>
                    <p className="font-medium">{location.address}</p>
                    <p className="text-sm text-gray-600">
                      {location.city}, {location.county}, {location.postalCode}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Mock map display */}
      {selectedLocation.address && (
        <div className="space-y-3">
          <div className="relative w-full h-40 bg-gray-200 rounded-md overflow-hidden">
            {/* Mock map image */}
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
                  <MapPin className="h-8 w-8 text-kidato-blue" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-kidato-blue rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-white p-1 rounded shadow-sm text-xs text-gray-700">
              Mock Map View
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div>
              <Label className="text-xs text-gray-500">Selected Location</Label>
              <p className="text-sm font-medium">{selectedLocation.address}</p>
              <p className="text-xs text-gray-600">
                {selectedLocation.city}, {selectedLocation.county}, {selectedLocation.postalCode}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
