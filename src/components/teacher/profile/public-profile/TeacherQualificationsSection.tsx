import React from 'react';
import { Award, Check, File, FileCheck, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface TeacherQualificationsProps {
  teacher: any;
}

const TeacherQualificationsSection: React.FC<TeacherQualificationsProps> = ({ teacher }) => {
  // Group certifications by type
  const teachingCerts = teacher.certifications.filter((cert: any) => 
    cert.name.toLowerCase().includes('teach') || 
    cert.name.toLowerCase().includes('educat') || 
    cert.issuer.toLowerCase().includes('educat')
  );
  
  const specialtyCerts = teacher.certifications.filter((cert: any) => 
    !teachingCerts.includes(cert)
  );

  return (
    <div className="space-y-8">
      {/* Teaching Certifications */}
      <div>
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <Award className="mr-2 h-5 w-5 text-kidato-purple" />
          Teaching Certifications
        </h3>

        {teachingCerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teachingCerts.map((cert: any) => (
              <div key={cert.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex">
                  <div className="rounded-full p-2 bg-blue-50 mr-3">
                    <FileCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{cert.name}</h4>
                      {cert.isVerified && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-0">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{cert.issuer} • {cert.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic">No teaching certifications listed.</p>
        )}
      </div>

      {/* Other Certifications & Licenses */}
      <div>
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <File className="mr-2 h-5 w-5 text-kidato-purple" />
          Specialty Certifications & Licenses
        </h3>

        {specialtyCerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialtyCerts.map((cert: any) => (
              <div key={cert.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex">
                  <div className="rounded-full p-2 bg-purple-50 mr-3">
                    <File className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{cert.name}</h4>
                      {cert.isVerified && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-0">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{cert.issuer} • {cert.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic">No specialty certifications listed.</p>
        )}
      </div>

      <Separator />

      {/* Background Verification */}
      <div>
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <Shield className="mr-2 h-5 w-5 text-kidato-purple" />
          Background Verification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-green-100 mr-3">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Identity Verified</h4>
                <p className="text-gray-700 text-sm">
                  {teacher.isProfileResume 
                    ? "Your government-issued ID has been verified"
                    : `We've confirmed ${teacher.name.split(" ")[0]}'s government-issued ID`
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-green-100 mr-3">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Background Check Passed</h4>
                <p className="text-gray-700 text-sm">
                  {teacher.isProfileResume
                    ? "You have passed our comprehensive background check"
                    : `${teacher.name.split(" ")[0]} has passed our comprehensive background check`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            {teacher.isProfileResume ? (
              <>
                <strong>Verified Profile:</strong> Your verified profile status helps build trust with potential students. We've completed all necessary verification checks for your account.
              </>
            ) : (
              <>
                <strong>Safety First:</strong> All teachers on our platform undergo thorough verification checks for your safety and peace of mind. We verify identity documents, professional credentials, and conduct background checks.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherQualificationsSection;