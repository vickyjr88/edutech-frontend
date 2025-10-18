import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Office Address",
      details: [
        "123 Education Street",
        "Learning District, LD 12345",
        "United States"
      ]
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Phone",
      details: [
        "+1 (555) 123-4567"
      ]
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      details: [
        "support@kidato.com"
      ]
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Business Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM EST",
        "Saturday: 10:00 AM - 4:00 PM EST"
      ]
    }
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {contactDetails.map((item, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              {item.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>
              <div className="space-y-1">
                {item.details.map((detail, detailIndex) => (
                  <p key={detailIndex} className="text-sm text-gray-600">
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export { ContactInfo };
