import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactMap } from "@/components/contact/ContactMap";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { Mail, Phone, MessageCircle } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <ContactInfo />
              <ContactMap />
            </div>
          </div>

          {/* Quick Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600">support@kidato.com</p>
              <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
              <p className="text-sm text-gray-500 mt-1">Mon-Fri 9AM-6PM EST</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600">Available 24/7</p>
              <p className="text-sm text-gray-500 mt-1">Get instant help</p>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactUs;
