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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Kidato Inc. ("Kidato," "we," "our," or "us"), a Delaware C-Corporation. By using our platform, you agree to these Terms & Conditions, which govern your access to and use of our services. Kidato is an AI-powered educational platform designed to connect teachers, learners, and institutions across Africa. These terms apply to all users—teachers, parents, students, and institutions.
              </p>
              <p className="text-gray-700 mb-4">
                If you do not agree with any of these terms, please do not use the Kidato platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Services Offered</h2>
              <p className="text-gray-700 mb-4">
                Kidato provides tools and infrastructure for teachers to offer live and asynchronous classes, conduct assessments, deliver certifications, and engage students via AI tutor agents. We also provide e-learning solutions to schools, tuition centres, and other educational institutions under business-to-business (B2B) agreements.
              </p>
              <p className="text-gray-700 mb-4">
                We continuously enhance the platform using AI to support profile creation, class matching, quiz generation, and other educational services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Tutor Relationship & Subscription</h2>
              <p className="text-gray-700 mb-4">
                All tutors on the Kidato platform are classified as independent contractors, not employees. Kidato is not responsible for the actions or omissions of tutors beyond what is conducted on our platform. We conduct basic ID and qualification checks and rely on both peer reviews and algorithmic assessments for quality control.
              </p>
              <p className="text-gray-700 mb-4">
                Tutors are required to pay a subscription fee to use the platform and agree to a revenue-sharing model, whereby Kidato retains a percentage of earnings made through the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payments & Currency</h2>
              <p className="text-gray-700 mb-4">
                Parents and institutions make payments through the Kidato platform in USD or Kenyan Shillings (KES). Kidato processes these payments, deducts applicable fees and commissions, and disburses funds to tutors. All transactions are securely processed via third-party payment processors.
              </p>
              <p className="text-gray-700 mb-4">
                Kidato is not liable for errors or disputes arising from payment service providers, and we disclaim responsibility for third-party delays, fees, or transactional issues.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Student Enrollment & Age Restrictions</h2>
              <p className="text-gray-700 mb-4">
                Students may create an account on Kidato, but must have explicit parental or guardian consent before enrolling in any paid program or class. Parents or guardians are solely responsible for their child's use of the platform and for ensuring compliance with applicable age laws in their jurisdiction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                Kidato is not liable for any disagreement or dispute between tutors, students, and parents. However, under extraordinary circumstances, Kidato may agree to review and arbitrate a dispute. In such cases, Kidato's decision shall be final and binding. We do not guarantee refunds or outcomes unless explicitly outlined in specific service agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                You are fully responsible for the data you upload, share, or generate on Kidato. You must ensure that your use of the platform complies with all applicable laws. Kidato will not be held liable for any illegal, defamatory, harmful, or abusive actions conducted by users on or off the platform.
              </p>
              <p className="text-gray-700 mb-4">
                Misuse of the platform, such as attempting to bypass payments, abusing AI systems, or engaging in harassment, will result in immediate account termination and may be reported to relevant authorities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Ethical Agreement for Teachers, Tutors, and Institutions Serving Children</h2>
              <p className="text-gray-700 mb-4">
                By registering as a teacher, tutor, or educational institution on Kidato, you agree to abide by the following ethical guidelines and responsibilities in your engagement with minors (students under the age of 18):
              </p>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-3">8.1 Child-Centred Conduct</h3>
                <p className="text-gray-700 mb-4">
                  You agree to maintain a professional, respectful, and appropriate relationship with all students. You must refrain from any form of physical, emotional, verbal, or psychological abuse, exploitation, or grooming behaviour.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-3">8.2 Digital Safety Practices</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Use only Kidato's communication channels for student engagement.</li>
                  <li>Do not request personal contact details from students.</li>
                  <li>Never initiate private or off-platform conversations with minors.</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-3">8.3 Consent and Transparency</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>You must not engage in teaching sessions with a student under 18 unless their parent or guardian has explicitly enrolled them.</li>
                  <li>Always maintain transparency in communication and reporting regarding a child's learning progress, concerns, or unusual behaviour.</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-3">8.4 Media and Recordings</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>You must not record, share, or distribute any media (video, audio, screenshots) involving a student outside of Kidato's platform or data systems.</li>
                  <li>Any content captured during sessions is the property of Kidato and used solely for platform improvement, training, and quality assurance.</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-3">8.5 Mandatory Reporting Obligation</h3>
                <p className="text-gray-700 mb-4">
                  If you become aware of any indication of child abuse, exploitation, or endangerment—whether online or offline—you must report it immediately to Kidato's Safety & Compliance Team at <a href="mailto:safety@kidato.com" className="text-kidato-purple hover:underline">safety@kidato.com</a>. We will escalate it to the appropriate legal or child protection authorities as required by law.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-3">8.6 Non-Compliance Consequences</h3>
                <p className="text-gray-700 mb-4">
                  Any violation of this Ethical Agreement may lead to immediate suspension or termination of your account. Kidato reserves the right to notify law enforcement and regulatory bodies where necessary.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All platform software, AI systems, designs, content templates, and documentation are the exclusive intellectual property of Kidato Inc. Users may not reproduce, reverse-engineer, resell, or redistribute any aspect of the platform without express written permission.
              </p>
              <p className="text-gray-700 mb-4">
                Unauthorised access or modification of any part of our software is strictly prohibited.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Platform Modifications</h2>
              <p className="text-gray-700 mb-4">
                Kidato reserves the right to modify, update, or discontinue any feature or service without prior notice. Continued use of the platform constitutes acceptance of any updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Kidato, its directors, team members, partners, and affiliates are not liable for any indirect, incidental, special, or consequential damages arising from your use or inability to use the platform. We make no warranties regarding outcomes, performance, or success of any educational engagement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law & Jurisdiction</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed by the laws of the State of Delaware, USA. Where relevant, we acknowledge and comply with applicable data protection and e-learning standards in African countries where we operate. Legal disputes must be brought in a court of competent jurisdiction in Delaware.
              </p>
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