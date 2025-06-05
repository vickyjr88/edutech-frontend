import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
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
          <h1 className="text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Clear guidelines that ensure a safe, respectful, and productive learning environment for all our users.
          </p>
          <div className="flex items-center justify-center mt-8 space-x-8">
            <div className="flex items-center text-purple-100">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Child Safety First
            </div>
            <div className="flex items-center text-purple-100">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Fair & Transparent
            </div>
            <div className="flex items-center text-purple-100">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Educational Excellence
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 -mt-16 relative z-10">
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction and Acceptance</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Kidato Inc ("Kidato," "we," "us," or "our"). These Terms and Conditions ("Terms") govern your use of our educational platform and services. By accessing or using Kidato, you agree to be bound by these Terms.
              </p>
              <p className="text-gray-700 mb-4">
                If you do not agree with any part of these Terms, you may not access or use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Platform Description</h2>
              <p className="text-gray-700 mb-4">
                Kidato is an educational technology platform that connects students with qualified tutors and provides AI-powered learning experiences. Our services include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>One-on-one and group tutoring sessions</li>
                <li>AI-generated educational content and assessments</li>
                <li>Progress tracking and analytics</li>
                <li>Educational resources and materials</li>
                <li>Communication tools between students, tutors, and guardians</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts and Eligibility</h2>
              <p className="text-gray-700 mb-4">
                To use our services, you must create an account and provide accurate information. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
              <p className="text-gray-700 mb-4">
                Users under 18 years of age must have parental or guardian consent to use our platform. We reserve the right to verify age and parental consent as required by applicable laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Tutor Requirements and Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                All tutors must meet our qualification standards and agree to our code of conduct. Tutors are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Providing accurate credentials and qualifications</li>
                <li>Delivering quality educational services</li>
                <li>Maintaining professional conduct at all times</li>
                <li>Protecting student privacy and safety</li>
                <li>Complying with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment Terms and Refunds</h2>
              <p className="text-gray-700 mb-4">
                Payment for services is due as specified in your subscription or session booking. We use secure third-party payment processors to handle transactions.
              </p>
              <p className="text-gray-700 mb-4">
                Refund policies vary by service type and are detailed in our separate refund policy. Generally, refunds may be available for cancelled sessions with adequate notice or technical issues preventing service delivery.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All content on the Kidato platform, including but not limited to text, graphics, software, and educational materials, is the property of Kidato or our licensors and is protected by intellectual property laws.
              </p>
              <p className="text-gray-700 mb-4">
                Users retain ownership of content they create but grant Kidato a license to use such content for platform operations and improvement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Prohibited Conduct</h2>
              <p className="text-gray-700 mb-4">Users may not:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Use the platform for illegal or unauthorized purposes</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Share inappropriate or offensive content</li>
                <li>Attempt to breach platform security</li>
                <li>Impersonate others or provide false information</li>
                <li>Use automated tools to access the platform without permission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Child Safety and Protection</h2>
              <p className="text-gray-700 mb-4">
                Kidato is committed to providing a safe learning environment for all students, especially minors. All educators must:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Undergo background checks as required by law</li>
                <li>Complete child safety training</li>
                <li>Report any concerning behavior immediately</li>
                <li>Maintain appropriate boundaries with students</li>
                <li>Follow our comprehensive Child Protection Policy</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We monitor interactions through various means including session recordings, activity logs, and user reports to ensure compliance with safety standards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Platform Availability and Technical Requirements</h2>
              <p className="text-gray-700 mb-4">
                While we strive to maintain continuous service availability, we cannot guarantee uninterrupted access to the platform. We reserve the right to modify, suspend, or discontinue services with reasonable notice.
              </p>
              <p className="text-gray-700 mb-4">
                Users are responsible for ensuring they have compatible devices and internet connectivity to access our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Kidato's liability is limited to the maximum extent permitted by law. We are not liable for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of data or profits</li>
                <li>Actions of third-party tutors or users</li>
                <li>Technical failures beyond our control</li>
                <li>Educational outcomes or academic performance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Termination</h2>
              <p className="text-gray-700 mb-4">
                Either party may terminate these Terms at any time. Kidato reserves the right to suspend or terminate accounts for violations of these Terms or for any other reason at our discretion.
              </p>
              <p className="text-gray-700 mb-4">
                Upon termination, you must cease using the platform, though certain provisions of these Terms will survive termination.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law and Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of the jurisdiction where Kidato Inc is incorporated. Any disputes will be resolved through binding arbitration or in the courts of competent jurisdiction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Modifications to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms at any time. Users will be notified of material changes, and continued use of the platform constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@kidato.com<br />
                  <strong>Support:</strong> support@kidato.com<br />
                  <strong>Address:</strong> Kidato Inc Legal Department
                </p>
              </div>
            </section>

            <p className="text-gray-600 text-sm mt-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;