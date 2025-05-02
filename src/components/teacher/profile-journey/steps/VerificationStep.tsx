import React, { useState, useEffect } from "react";
import { useProfileJourney } from "../ProfileJourneyContext";
import { useToast } from "@/components/ui/use-toast";
import { CheckSquare } from "lucide-react";
import { CertificationsStep } from "../../professional-profile";

const VerificationStep = () => {
  const { verification, updateVerification, setCertifications, certifications, completeStep } = useProfileJourney();
  const { toast } = useToast();
  
  // Debug certifications data
  console.log("VerificationStep - certifications:", certifications);
  
  // Handle certifications update
  const handleCertificationsUpdate = (newCertifications: any[]) => {
    setCertifications(newCertifications);
    checkCompletion(newCertifications, verification);
  };
  
  // Check if step should be marked as complete
  const checkCompletion = (
    certs: any[] | undefined, 
    verificationFields: typeof verification
  ) => {
    if (
      (certs && certs.length > 0 && certs[0]?.name) ||
      verificationFields.backgroundCheck ||
      verificationFields.idVerification
    ) {
      completeStep("verification");
    }
  };
  
  // Perform initial check for completion on mount
  useEffect(() => {
    checkCompletion(certifications, verification);
  }, [certifications, verification]);

  return (
    <div className="space-y-6">
      {/* Certifications Component with Tabs */}
      <CertificationsStep 
        certifications={certifications}
        setCertifications={handleCertificationsUpdate}
        onCertificationsChange={() => {
          // Track when certifications are changed/saved
          toast({
            title: "Saved",
            description: "Your credentials have been updated successfully",
          });
          checkCompletion(certifications, verification);
        }}
      />
    </div>
  );
};

export default VerificationStep;