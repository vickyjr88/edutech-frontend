import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useContent } from "@/hooks/useContent";
import type { PageContent } from "@/content/types";

const TermsAndConditions = () => {
  const { content, loading, error } = useContent<PageContent>('pages/terms-and-conditions.json');

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kidato-purple"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Extract sections
  const heroSection = content?.sections.find(s => s.type === 'hero');
  const legalSection = content?.sections.find(s => s.type === 'legal');
  const valuePillars = (content as any)?.valuePillars || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40z'/%3E%3Cpath d='m0 40l40-40h-40z' transform='translate(40)' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            {heroSection?.type === 'hero' ? heroSection.title : 'Terms & Conditions'}
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            {heroSection?.type === 'hero' ? heroSection.subtitle : 'Clear guidelines that ensure a safe, respectful, and productive learning environment for all our users.'}
          </p>
          <div className="flex items-center justify-center mt-8 space-x-8">
            {valuePillars.map((pillar: any, index: number) => (
              <div key={index} className="flex items-center text-purple-100">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {pillar.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 -mt-16 relative z-10">

          <div className="prose prose-lg max-w-none">
            {legalSection?.type === 'legal' && legalSection.sections?.map((section: any, index: number) => (
              <section key={index} className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.heading}</h2>
                {section.content && (
                  <p className="text-gray-700 mb-4">{section.content}</p>
                )}
                {section.list && (
                  <ul className="list-disc pl-6 text-gray-700 mb-4">
                    {section.list.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.subheading && (
                  <div className="mb-6">
                    <h3 className="text-xl font-medium text-gray-800 mb-3">{section.subheading}</h3>
                    {section.content && <p className="text-gray-700 mb-4">{section.content}</p>}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;