import React from 'react';
import { Award, Briefcase, GraduationCap } from 'lucide-react';

interface TeacherExperienceSectionProps {
  teacher: any;
}

const TeacherExperienceSection: React.FC<TeacherExperienceSectionProps> = ({ teacher }) => {
  return (
    <div className="space-y-8">
      {/* Work Experience */}
      <div>
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <Briefcase className="mr-2 h-5 w-5 text-kidato-purple" />
          Work Experience
        </h3>

        <div className="space-y-6">
          {(teacher.experience || []).map((exp: any) => (
            <div key={exp.id} className="relative pl-8 border-l-2 border-gray-200 pb-6 last:pb-0">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-kidato-purple"></div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                  <h4 className="font-semibold">{exp.position}</h4>
                  <span className="text-sm text-gray-500">{exp.dates}</span>
                </div>
                <p className="text-gray-700 font-medium">{exp.institution}</p>
                {exp.description && (
                  <p className="mt-2 text-gray-600 text-sm">{exp.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <GraduationCap className="mr-2 h-5 w-5 text-kidato-purple" />
          Education
        </h3>

        <div className="space-y-6">
          {(teacher.education || []).map((edu: any) => (
            <div key={edu.id} className="relative pl-8 border-l-2 border-gray-200 pb-6 last:pb-0">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-kidato-purple"></div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <span className="text-sm text-gray-500">{edu.dates}</span>
                </div>
                <p className="text-gray-700">{edu.institution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      {teacher.achievements && teacher.achievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <Award className="mr-2 h-5 w-5 text-kidato-purple" />
            Achievements & Awards
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(teacher.achievements || []).map((achievement: any) => (
              <div key={achievement.id} className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <div className="flex items-start">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <Award className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800">{achievement.title}</h4>
                    <p className="text-gray-700 text-sm">{achievement.issuer} • {achievement.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherExperienceSection;