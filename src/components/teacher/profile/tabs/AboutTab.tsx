
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Book, Award, Globe, GraduationCap, Briefcase, Laptop, FileText } from "lucide-react";
import CardWithCheckIcon from "../CardWithCheckIcon";
import { MethodologyItem, StrategyItem, LanguageItem } from "../../professional-profile";

const CertificateIcon = Award;

interface AboutTabProps {
  teacher: {
    bio: string;
    education: Array<{
      id: string;
      institution: string;
      degree: string;
      dates: string;
    }>;
    experience: Array<{
      id: string;
      position: string;
      institution: string;
      dates: string;
      description?: string;
    }>;
    methodologies: MethodologyItem[];
    strategies: StrategyItem[];
    languages: LanguageItem[];
    certifications: Array<{
      id: string;
      name: string;
      issuer: string;
      date: string;
      isVerified: boolean;
    }>;
    technicalSkills?: Array<{
      id: string;
      skill: string;
      description?: string;
      level?: string;
    }>;
  };
}

export default function AboutTab({ teacher }: AboutTabProps) {
  return (
    <>
      {/* Teacher Bio Card - Full Width */}
      <div className="mb-10">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-kidato-purple" />
              <CardTitle className="text-xl">Bio</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{teacher.bio}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-kidato-purple" />
              <CardTitle className="text-xl">Educational Qualifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {teacher.education.length > 0 ? (
              <ul className="space-y-5">
                {teacher.education.map((edu) => (
                  <CardWithCheckIcon key={edu.id}>
                    <span className="font-medium text-gray-900">{edu.degree}</span>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.dates}</p>
                  </CardWithCheckIcon>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No educational information available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-kidato-purple" />
              <CardTitle className="text-xl">Teaching Experience</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {teacher.experience.length > 0 ? (
              <ul className="space-y-5">
                {teacher.experience.map((exp) => (
                  <CardWithCheckIcon key={exp.id}>
                    <span className="font-medium text-gray-900">{exp.position}</span>
                    <p className="text-sm text-gray-600">{exp.institution}</p>
                    <p className="text-xs text-gray-500">{exp.dates}</p>
                    {exp.description && (
                      <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                    )}
                  </CardWithCheckIcon>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No experience information available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CertificateIcon className="h-5 w-5 text-kidato-purple" />
              <CardTitle className="text-xl">Certifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {teacher.certifications.length > 0 ? (
              <ul className="space-y-5">
                {teacher.certifications.map((cert) => (
                  <CardWithCheckIcon key={cert.id}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">{cert.name}</span>
                      {cert.isVerified && (
                        <span className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">{cert.date}</p>
                  </CardWithCheckIcon>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No certifications available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5 text-kidato-purple" />
              <CardTitle className="text-xl">Teaching Methodologies</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {teacher.methodologies.length > 0 ? (
              <ul className="space-y-5">
                {teacher.methodologies.map((item) => (
                  <CardWithCheckIcon key={item._id}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      {item.isCertified && (
                        <span className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          Certified
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                  </CardWithCheckIcon>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No methodologies available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-kidato-purple" />
              <CardTitle className="text-xl">Teaching Strategies</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {teacher.strategies.length > 0 ? (
              <ul className="space-y-5">
                {teacher.strategies.map((item) => (
                  <CardWithCheckIcon key={item._id}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">{item.strategy}</span>
                      {item.is_certified && (
                        <span className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          Certified
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                  </CardWithCheckIcon>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No strategies available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-kidato-purple" />
              <CardTitle className="text-xl">Languages</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {teacher.languages.length > 0 ? (
              <ul className="space-y-5">
                {teacher.languages.map((item) => (
                  <li key={item._id} className="flex items-start bg-gray-50 p-4 rounded-lg">
                    <div className="mt-1">
                      <span className="bg-kidato-purple/10 text-kidato-purple p-1.5 rounded-full flex items-center justify-center">
                        <Globe className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        {item.isCertified && (
                          <span className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                            Certified
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No languages available</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {teacher.technicalSkills && teacher.technicalSkills.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Skills</h2>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Laptop className="h-5 w-5 text-kidato-purple" />
                <CardTitle className="text-xl">Digital & Technical Proficiency</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {teacher.technicalSkills.map((skill) => (
                  <CardWithCheckIcon key={skill.id}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">{skill.skill}</span>
                      {skill.level && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          skill.level === 'Advanced' ? 'bg-green-50 text-green-700' : 
                          skill.level === 'Intermediate' ? 'bg-blue-50 text-blue-700' :
                          'bg-yellow-50 text-yellow-700'
                        }`}>
                          {skill.level}
                        </span>
                      )}
                    </div>
                    {skill.description && (
                      <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                    )}
                  </CardWithCheckIcon>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
