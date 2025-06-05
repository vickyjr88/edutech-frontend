import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Kidato Inc – Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Scope of Policy</h2>
              <p className="text-gray-700 mb-4">
                This Privacy Policy describes how Kidato Inc ("Kidato," "we," "us," or "our") collects, uses, and protects your personal information. This policy applies to all users, including teachers, students, guardians, and institutional partners.
              </p>
              <p className="text-gray-700 mb-4">
                By using the Kidato platform, you consent to the collection and use of your data as described herein.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Data We Collect</h2>
              <p className="text-gray-700 mb-4">We collect the following categories of information:</p>
              
              <div className="mb-4">
                <h3 className="text-xl font-medium text-gray-800 mb-2">Personal Data:</h3>
                <p className="text-gray-700">Names, email addresses, phone numbers, and birth dates.</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-medium text-gray-800 mb-2">Academic Data:</h3>
                <p className="text-gray-700">Grades, performance records, assignments, and assessments.</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-medium text-gray-800 mb-2">Behavioural Data:</h3>
                <p className="text-gray-700">Engagement patterns, time spent on lessons, interaction styles.</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-medium text-gray-800 mb-2">Media Data:</h3>
                <p className="text-gray-700">Audio/video recordings of classes for quality and compliance.</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-medium text-gray-800 mb-2">Device & Usage Data:</h3>
                <p className="text-gray-700">Browser type, location (approximate), time zone, and device type.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Data</h2>
              <p className="text-gray-700 mb-4">Your data is used to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Create and optimise student and teacher profiles.</li>
                <li>Match students to relevant tutors or AI-powered classes.</li>
                <li>Generate custom quizzes and assessments.</li>
                <li>Enhance platform functionality and user experience.</li>
                <li>Provide guardians with progress tracking dashboards.</li>
                <li>Improve our AI models over time via anonymised analysis.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. AI & Data Retention</h2>
              <p className="text-gray-700 mb-4">
                Our AI tutors and recommendation engines utilise user data to improve accuracy, personalisation, and platform intelligence. AI-generated content and interactions may be stored and analysed to train future models.
              </p>
              <p className="text-gray-700 mb-4">
                By using Kidato, you agree to the use of your anonymised or aggregated data to enhance platform capabilities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Storage & Hosting</h2>
              <p className="text-gray-700 mb-4">
                Data is primarily stored in Africa with backups in the European Union and the United States to ensure security, compliance, and disaster recovery. While we follow industry best practices, no system is completely immune to breaches.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We rely on trusted third-party providers (e.g., Firebase, Stripe, Zoom, Google Analytics) to deliver parts of our service. These providers may access your data strictly under our direction and following their privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Parental Consent & Children's Data</h2>
              <p className="text-gray-700 mb-4">
                We comply with child data protection standards (e.g., COPPA, GDPR). Students under legal age must obtain parental/guardian consent. Kidato only processes children's data with explicit permission, and guardians can request data review, correction, or deletion at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Marketing & Communications</h2>
              <p className="text-gray-700 mb-4">
                We may use your contact information to send updates about platform features, educational content, or partnerships. You may opt out of marketing communications by following the "unsubscribe" link or contacting us directly.
              </p>
              <p className="text-gray-700 mb-4">
                We do not sell or rent user data to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Request access to your data.</li>
                <li>Correct or delete inaccurate data.</li>
                <li>Withdraw consent for processing (where applicable).</li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise any of these rights, please contact our support team.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Liability Disclaimer</h2>
              <p className="text-gray-700 mb-4">Kidato is not liable for:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Any loss, theft, or misuse of personal data by users.</li>
                <li>User actions taken outside the platform, including illegal or unethical behaviour.</li>
                <li>Breaches caused by user negligence or third-party tools beyond our control.</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Users are responsible for maintaining the confidentiality of their login credentials and for ensuring their activity on Kidato remains lawful and respectful.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to this Policy</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to update this Privacy Policy. Users will be notified of any changes, and their continued use of the platform will be considered acceptance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Child Safety and Educator Responsibility</h2>
              <p className="text-gray-700 mb-4">
                All teachers, tutors, and educational institutions registered on Kidato agree to uphold ethical standards for engaging with minors, as detailed in our Ethical Agreement on Child Protection (see Section 8 in Terms & Conditions). We monitor educator behaviour through activity logs, peer reviews, and session analytics to uphold student safety.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;