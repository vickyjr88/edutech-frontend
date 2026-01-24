import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parentService } from "@/integrations/api/services/parent.service";
import { userService } from "@/integrations/api/services/user.service";
import ChildrenManager from "@/components/parents/ChildrenManager";

const ParentProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'personal';

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    alternativePhoneNumber: user?.alternativePhoneNumber || "",
    bio: user?.bio || "",
    contactNumber: "",
  });

  const [parentProfileId, setParentProfileId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const response = await parentService.getProfile();

        if (response.data) {
          setParentProfileId(response.data._id);
          setFormData({
            fullName: response.data.user?.fullName || user?.fullName || "",
            email: response.data.user?.email || user?.email || "",
            phoneNumber: response.data.user?.phoneNumber || user?.phoneNumber || "",
            alternativePhoneNumber: (response.data.user as any)?.alternativePhoneNumber || user?.alternativePhoneNumber || "",
            bio: response.data.user?.bio || user?.bio || "",
            contactNumber: response.data.contactNumber || "",
          });
        } else if (response.error && response.error.status !== 404) {
          // Only toast if it's not a 404 (404 means profile doesn't exist yet, which we handle by staying with user defaults)
          toast({
            title: "Error",
            description: response.error.message || "Failed to load profile. Please refresh the page.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to fetch parent profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, user?.fullName, user?.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      // 1. Update basic user info
      await userService.updateUser(user.id, {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        alternativePhoneNumber: formData.alternativePhoneNumber,
        bio: formData.bio,
      });

      // 2. Either update or create parent profile
      if (parentProfileId) {
        // Update existing parent profile
        await parentService.updateProfile(parentProfileId, {
          contactNumber: formData.contactNumber || formData.alternativePhoneNumber,
        });
      } else {
        // Create new parent profile if it doesn't exist
        const response = await parentService.createProfile({
          user: user.id,
          contactNumber: formData.contactNumber || formData.alternativePhoneNumber,
          preferredContactMethod: 'email',
          receiveProgressReports: true,
          receiveNotifications: true,
        });

        if (response.data) {
          setParentProfileId(response.data._id);
        }
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your personal information and children's profiles
            </p>
          </div>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="children">Children</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your profile details below
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="space-x-2">
                        <Button onClick={() => setIsEditing(false)} variant="outline">
                          Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                          <Save className="h-4 w-4 mr-2" />
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      <User className="inline h-4 w-4 mr-2" />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="inline h-4 w-4 mr-2" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={true}
                      placeholder="Enter your email"
                    />
                    <p className="text-xs text-gray-500">
                      Email cannot be changed. Contact support if you need to update it.
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Alternative Contact Number */}
                  <div className="space-y-2">
                    <Label htmlFor="alternativePhoneNumber">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Alternative Contact Number
                    </Label>
                    <Input
                      id="alternativePhoneNumber"
                      name="alternativePhoneNumber"
                      type="tel"
                      value={formData.alternativePhoneNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter alternative contact number"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Tell us a bit about yourself and your children"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="children">
              <ChildrenManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ParentProfile;
