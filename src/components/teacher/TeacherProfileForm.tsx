
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, MapPin, User, Users, Bookmark, Award } from "lucide-react";
import LocationPicker from "./LocationPicker";

interface TeacherProfileFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const TeacherProfileForm = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: TeacherProfileFormProps) => {
  const { toast } = useToast();
  
  // Contact Information
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [alternativePhone, setAlternativePhone] = useState("");
  
  // Location Information
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  
  // Next of Kin Information
  const [kinName, setKinName] = useState("");
  const [kinRelationship, setKinRelationship] = useState("");
  const [kinPhone, setKinPhone] = useState("");
  
  // Certification Information
  const [isCertified, setIsCertified] = useState(false);
  const [certificationDetails, setCertificationDetails] = useState("");
  const [certificationYear, setCertificationYear] = useState("");
  const [institution, setInstitution] = useState("");

  const handleLocationSelect = (location: any) => {
    setAddress(location.address);
    setCity(location.city);
    setCounty(location.county);
    setPostalCode(location.postalCode);
    setCoordinates({
      latitude: location.latitude,
      longitude: location.longitude
    });
    
    toast({
      title: "Location updated",
      description: `Selected: ${location.address}, ${location.city}`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profileData = {
      contact: {
        phone,
        email,
        alternativePhone
      },
      location: {
        address,
        city,
        county,
        postalCode,
        coordinates
      },
      nextOfKin: {
        name: kinName,
        relationship: kinRelationship,
        phone: kinPhone
      },
      certification: {
        isCertified,
        details: certificationDetails,
        year: certificationYear,
        institution
      }
    };
    
    onSubmit(profileData);
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Teacher Profile Information</CardTitle>
        <CardDescription>
          Please provide your contact details, location, next of kin, and certification information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Contact Information</h3>
            </div>
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your primary phone number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="alternativePhone">Alternative Phone Number</Label>
              <Input
                id="alternativePhone"
                value={alternativePhone}
                onChange={(e) => setAlternativePhone(e.target.value)}
                placeholder="Alternative phone (optional)"
              />
            </div>
          </div>
          
          {/* Location Information Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Location Details</h3>
            </div>
            <Separator />
            
            <LocationPicker 
              onLocationSelect={handleLocationSelect}
              initialAddress={address}
              initialCity={city}
              initialCounty={county}
              initialPostalCode={postalCode}
            />
            
            {/* Hidden inputs to store the location data */}
            <div className="hidden">
              <Input type="hidden" value={address} />
              <Input type="hidden" value={city} />
              <Input type="hidden" value={county} />
              <Input type="hidden" value={postalCode} />
              <Input type="hidden" value={coordinates.latitude.toString()} />
              <Input type="hidden" value={coordinates.longitude.toString()} />
            </div>
          </div>
          
          {/* Next of Kin Information Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Next of Kin</h3>
            </div>
            <Separator />
            
            <div>
              <Label htmlFor="kinName">Full Name</Label>
              <Input
                id="kinName"
                value={kinName}
                onChange={(e) => setKinName(e.target.value)}
                placeholder="Full name of next of kin"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kinRelationship">Relationship</Label>
                <Select value={kinRelationship} onValueChange={setKinRelationship}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="kinPhone">Phone Number</Label>
                <Input
                  id="kinPhone"
                  value={kinPhone}
                  onChange={(e) => setKinPhone(e.target.value)}
                  placeholder="Next of kin phone number"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Certification Information Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Award className="mr-2 h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Teaching Certification</h3>
            </div>
            <Separator />
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isCertified"
                checked={isCertified}
                onCheckedChange={setIsCertified}
              />
              <Label htmlFor="isCertified">I am a certified teacher</Label>
            </div>
            
            {isCertified && (
              <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                <div>
                  <Label htmlFor="certificationDetails">Certification Details</Label>
                  <Input
                    id="certificationDetails"
                    value={certificationDetails}
                    onChange={(e) => setCertificationDetails(e.target.value)}
                    placeholder="Type of certification"
                    required={isCertified}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="Certifying institution"
                      required={isCertified}
                    />
                  </div>
                  <div>
                    <Label htmlFor="certificationYear">Year</Label>
                    <Input
                      id="certificationYear"
                      value={certificationYear}
                      onChange={(e) => setCertificationYear(e.target.value)}
                      placeholder="Year of certification"
                      required={isCertified}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="bg-kidato-blue hover:bg-kidato-dark-blue"
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeacherProfileForm;
