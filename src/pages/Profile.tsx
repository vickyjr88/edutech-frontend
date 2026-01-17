import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import KidatoMascot from "@/components/dashboard/KidatoMascot";
import { useAuth } from "@/contexts/AuthContext";
import { useGetProfileById } from "@/hooks/use-student-service";
import { getUserInitials } from "@/lib/utils";
import { formatDate } from "date-fns";
import { EditProfileForm } from "@/components/dashboard/EditProfileForm";

const Profile = () => {
  const { user } = useAuth();
  const { data: response, refetch } = useGetProfileById(user.studentId || user.id);
  const profile = response?.data;
  const fullName = user.fullName;

  const nameInitials = useMemo(() => {
    return getUserInitials(fullName);
  }, [fullName]);

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-4 sm:p-6 transition-all duration-300">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>
            </div>

            {/* Profile Content */}
            <Card className="mb-6 border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  <User className="mr-2 h-5 w-5 text-blue-500" />
                  My Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-kidato-purple to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
                      {nameInitials}
                    </div>
                    <h2 className="text-xl font-bold">{user.fullName}</h2>
                    <p className="text-gray-500">{profile?.grade ? `Grade ${profile.grade} Student` : "Student"}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>

                  <div className="w-full md:w-2/3">
                    {isEditing ? (
                      <EditProfileForm
                        profile={profile}
                        onClose={() => {
                          setIsEditing(false)
                          refetch()
                        }}
                      />
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-gray-700 mb-1">Email</h3>
                            <p>{user.email}</p>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-gray-700 mb-1">School</h3>
                            <p>{profile?.school}</p>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-gray-700 mb-1">Interests</h3>
                            <p>{profile?.interests?.join(", ")}</p>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-gray-700 mb-1">Joined</h3>
                            <p>{profile ? formatDate(profile.createdAt, "MMMM yyyy") : ""}</p>
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <h3 className="font-medium text-gray-700 mb-2">About Me</h3>
                          <p className="text-gray-600">
                            {profile?.aboutMe}
                          </p>
                        </div>
                      </>)
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Kidato AI Mascot */}
      <KidatoMascot />
    </div>
  );
}

export default Profile;
