import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useContent } from "@/hooks/useContent";
import type { PageContent } from "@/content/types";

const PrivacyPolicy = () => {
  const { content, loading, error } = useContent<PageContent>('pages/privacy-policy.json');

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
  const complianceBadges = (content as any)?.complianceBadges || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='3'/%3E%3Ccircle cx='53' cy='7' r='3'/%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3Ccircle cx='7' cy='53' r='3'/%3E%3Ccircle cx='53' cy='53' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            {heroSection?.type === 'hero' ? heroSection.title : 'Privacy Policy'}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {heroSection?.type === 'hero' ? heroSection.subtitle : 'We are committed to protecting your personal information and ensuring the privacy of our students, teachers, and families.'}
          </p>
          <div className="flex items-center justify-center mt-8 space-x-8">
            {complianceBadges.map((badge: any, index: number) => (
              <div key={index} className="flex items-center text-blue-100">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {badge.name}
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
                  <p className="text-gray-700 mb-4">{section.subheading}</p>
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

export default PrivacyPolicy;