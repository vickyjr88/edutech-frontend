import React from 'react';
import { CheckCircle, User, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TeacherAboutSectionProps {
  teacher: any;
}

const TeacherAboutSection: React.FC<TeacherAboutSectionProps> = ({ teacher }) => {
  return (
    <div className="space-y-8">
      {/* Bio Section */}
      <div>
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <User className="mr-2 h-5 w-5 text-kidato-purple" />
          About Me
        </h3>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-line">{teacher.bio}</p>
        </div>
      </div>

      {/* Teaching Approach */}
      <div>
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <BookOpen className="mr-2 h-5 w-5 text-kidato-purple" />
          My Teaching Approach
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teaching Methodologies */}
          <div className="bg-blue-50 rounded-lg p-5">
            <h4 className="font-medium mb-3 text-blue-800">Teaching Methodologies</h4>
            <ul className="space-y-3">
              {teacher.methodologies.map((method: any) => (
                <li key={method.id} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    {method.is_certified ? (
                      <div className="bg-blue-100 rounded-full p-1">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-full p-1">
                        <div className="h-4 w-4 rounded-full border-2 border-gray-400"></div>
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{method.methodology}</p>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Teaching Strategies */}
          <div className="bg-green-50 rounded-lg p-5">
            <h4 className="font-medium mb-3 text-green-800">Teaching Strategies</h4>
            <ul className="space-y-3">
              {teacher.strategies.map((strategy: any) => (
                <li key={strategy.id} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    {strategy.is_certified ? (
                      <div className="bg-green-100 rounded-full p-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-full p-1">
                        <div className="h-4 w-4 rounded-full border-2 border-gray-400"></div>
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{strategy.strategy}</p>
                    <p className="text-sm text-gray-600">{strategy.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {teacher.languages.map((lang: any) => (
            <Badge 
              key={lang.id} 
              variant="outline"
              className={`px-3 py-1 text-sm ${lang.isCertified ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
            >
              <span className="font-medium">{lang.language}</span>
              {lang.description && (
                <span className="ml-1 font-normal text-xs">({lang.description})</span>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Technical Skills */}
      {teacher.technicalSkills && teacher.technicalSkills.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Technical Skills</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teacher.technicalSkills.map((skill: any) => (
              <div key={skill.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{skill.skill}</h4>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    skill.level === 'Advanced' 
                      ? 'bg-green-100 text-green-800' 
                      : skill.level === 'Intermediate'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {skill.level}
                  </span>
                </div>
                {skill.description && (
                  <p className="text-sm text-gray-600">{skill.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAboutSection;