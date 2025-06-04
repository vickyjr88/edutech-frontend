import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProfileJourney } from '../ProfileJourneyContext';
import { Award, Plus, X, Shield, FileCheck, CheckCircle, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cvService } from '@/integrations/api/services/cv.service';
import { useToast } from '@/components/ui/use-toast';

interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  year: string;
  description: string;
}

interface CertificationsFormProps {
  onComplete: () => void;
}

export const CertificationsForm = ({ onComplete }: CertificationsFormProps) => {
  const { 
    certifications, 
    setCertifications, 
    verification,
    updateVerification,
    completeStep 
  } = useProfileJourney();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCVPrefill, setShowCVPrefill] = useState(false);
  const [isCVLoading, setIsCVLoading] = useState(false);

  // Local state for certifications
  const [certificationEntries, setCertificationEntries] = useState<CertificationEntry[]>(() => {
    if (certifications.length > 0) {
      return certifications.map((cert, index) => ({
        id: cert.id || `cert-${index}`,
        name: cert.value || cert.name || '',
        issuer: cert.issuer || '',
        year: cert.year?.toString() || '',
        description: cert.details || cert.description || ''
      }));
    }
    return [{
      id: 'cert-1',
      name: '',
      issuer: '',
      year: '',
      description: ''
    }];
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  // Check for CV extracted data on component mount
  useEffect(() => {
    const checkCVData = async () => {
      try {
        const { data: cvData, error } = await cvService.getCVExtractedData();
        if (cvData && cvData.certifications && cvData.certifications.length > 0) {
          // Only show prefill option if there are no existing certifications
          if (certificationEntries.length === 1 && !certificationEntries[0].name) {
            setShowCVPrefill(true);
          }
        }
      } catch (error) {
        console.log('No CV data available for prefill');
      }
    };

    checkCVData();
  }, []);

  // Handle CV prefill
  const handleCVPrefill = async () => {
    setIsCVLoading(true);
    try {
      const { data: cvData, error } = await cvService.getCVExtractedData();
      
      if (error || !cvData || !cvData.certifications) {
        throw new Error('No certification data found in CV');
      }

      // Convert CV certification data to form format
      const cvCertificationEntries: CertificationEntry[] = cvData.certifications.map((cert, index) => ({
        id: `cv-cert-${index}`,
        name: cert.name || '',
        issuer: cert.issuer || '',
        year: cert.issueDate ? new Date(cert.issueDate).getFullYear().toString() : '',
        description: cert.description || ''
      }));

      setCertificationEntries(cvCertificationEntries);
      setShowCVPrefill(false);

      toast({
        title: "Certifications prefilled from CV",
        description: `Added ${cvCertificationEntries.length} certifications from your CV`,
      });
    } catch (error) {
      console.error('Error prefilling from CV:', error);
      toast({
        title: "Prefill failed",
        description: "Could not extract certification data from CV",
        variant: "destructive",
      });
    } finally {
      setIsCVLoading(false);
    }
  };

  const handleAddCertification = () => {
    setCertificationEntries([...certificationEntries, {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      year: '',
      description: ''
    }]);
  };

  const handleRemoveCertification = (id: string) => {
    const filtered = certificationEntries.filter(entry => entry.id !== id);
    if (filtered.length === 0) {
      setCertificationEntries([{
        id: 'cert-1',
        name: '',
        issuer: '',
        year: '',
        description: ''
      }]);
    } else {
      setCertificationEntries(filtered);
    }
  };

  const handleCertificationChange = (id: string, field: keyof CertificationEntry, value: string) => {
    setCertificationEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleVerificationChange = (field: 'backgroundCheck' | 'idVerification', value: boolean) => {
    updateVerification({ [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Process certifications
      const validCertifications = certificationEntries.filter(entry => 
        entry.name.trim()
      );

      if (validCertifications.length > 0) {
        const certificationData = validCertifications.map(entry => ({
          id: entry.id,
          value: entry.name,
          name: entry.name,
          issuer: entry.issuer,
          year: entry.year ? parseInt(entry.year) : undefined,
          details: entry.description,
          description: entry.description
        }));
        setCertifications(certificationData);
      }

      // Check if form has minimum required data
      const hasRequiredData = validCertifications.length > 0 || 
                             verification.backgroundCheck || 
                             verification.idVerification;

      if (!hasRequiredData) {
        alert('Please add at least one certification or complete a verification step');
        return;
      }

      // Mark step as complete
      completeStep('certifications');
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = certificationEntries.some(entry => entry.name.trim()) ||
                     verification.backgroundCheck ||
                     verification.idVerification;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-8 p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Award className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Certifications & Achievements</h3>
          <p className="text-gray-600">Add your credentials and complete verification</p>
        </div>

        {/* CV Prefill Nudge */}
        {showCVPrefill && (
          <div className="mb-6 p-4 bg-gradient-to-br from-[#5c64d4]/10 to-[#fc9323]/10 rounded-2xl border-2 border-dashed border-[#5c64d4]/30">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-[#5c64d4]" />
                <Sparkles className="h-4 w-4 text-[#fc9323] animate-pulse" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">🏆 Auto-fill from CV</h4>
              <p className="text-sm text-gray-600 mb-4">
                We found certifications in your uploaded CV. Would you like to auto-fill this form?
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  type="button"
                  onClick={handleCVPrefill}
                  disabled={isCVLoading}
                  className="bg-gradient-to-r from-[#5c64d4] to-[#fc9323] text-white hover:from-[#5c64d4]/90 hover:to-[#fc9323]/90"
                >
                  {isCVLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Auto-fill Certifications
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCVPrefill(false)}
                  className="border-[#5c64d4] text-[#5c64d4] hover:bg-[#5c64d4]/10"
                >
                  Fill manually instead
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Certifications Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-6 w-6 text-[#fc9323]" />
            <h4 className="text-lg font-semibold text-gray-900">Professional Certifications</h4>
          </div>

          {certificationEntries.map((entry, index) => (
            <div key={entry.id} className="border-2 border-orange-200 rounded-3xl p-6 space-y-4 bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#fc9323] rounded-2xl flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <h5 className="font-semibold text-gray-900">Certification {index + 1}</h5>
                </div>
                {certificationEntries.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCertification(entry.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`certName-${entry.id}`} className="text-sm font-medium">Certification Name</Label>
                  <Input
                    id={`certName-${entry.id}`}
                    value={entry.name}
                    onChange={(e) => handleCertificationChange(entry.id, 'name', e.target.value)}
                    placeholder="Teaching License, TESOL, etc."
                    className="rounded-xl border-orange-200 focus:border-orange-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`certIssuer-${entry.id}`} className="text-sm font-medium">Issuing Organization</Label>
                  <Input
                    id={`certIssuer-${entry.id}`}
                    value={entry.issuer}
                    onChange={(e) => handleCertificationChange(entry.id, 'issuer', e.target.value)}
                    placeholder="Ministry of Education, Cambridge, etc."
                    className="rounded-xl border-orange-200 focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`certYear-${entry.id}`} className="text-sm font-medium">Year Obtained</Label>
                  <select
                    id={`certYear-${entry.id}`}
                    value={entry.year}
                    onChange={(e) => handleCertificationChange(entry.id, 'year', e.target.value)}
                    className="w-full rounded-xl border border-orange-200 px-3 py-2 focus:border-orange-400 focus:outline-none"
                  >
                    <option value="">Select year</option>
                    {years.map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`certDesc-${entry.id}`} className="text-sm font-medium">Description (Optional)</Label>
                  <Textarea
                    id={`certDesc-${entry.id}`}
                    value={entry.description}
                    onChange={(e) => handleCertificationChange(entry.id, 'description', e.target.value)}
                    placeholder="Brief description of the certification..."
                    className="rounded-xl border-orange-200 focus:border-orange-400"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddCertification}
            className="w-full flex items-center gap-2 border-2 border-dashed border-orange-300 text-orange-700 hover:text-orange-800 hover:bg-orange-50 rounded-2xl py-4"
          >
            <Plus className="h-5 w-5" />
            Add Another Certification
          </Button>
        </div>

        {/* Verification Section */}
        <div className="bg-gradient-to-br from-[#acb4e4] to-[#efebf0] p-6 rounded-3xl border-2 border-[#5c64d4]/20">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-[#5c64d4]" />
            <h4 className="text-lg font-semibold text-gray-900">Identity Verification</h4>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#5c64d4]/20">
              <div className="flex items-center gap-3">
                <FileCheck className="h-5 w-5 text-blue-600" />
                <div>
                  <Label className="font-medium text-gray-900">Background Check</Label>
                  <p className="text-sm text-gray-600">Upload background check document</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="backgroundCheck"
                  checked={verification.backgroundCheck}
                  onChange={(e) => handleVerificationChange('backgroundCheck', e.target.checked)}
                  className="w-5 h-5 text-[#5c64d4] rounded border-gray-300 focus:ring-[#5c64d4]"
                />
                <Label htmlFor="backgroundCheck" className="text-sm font-medium">
                  Completed
                </Label>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#5c64d4]/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <Label className="font-medium text-gray-900">ID Verification</Label>
                  <p className="text-sm text-gray-600">Upload government-issued ID</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="idVerification"
                  checked={verification.idVerification}
                  onChange={(e) => handleVerificationChange('idVerification', e.target.checked)}
                  className="w-5 h-5 text-[#5c64d4] rounded border-gray-300 focus:ring-[#5c64d4]"
                />
                <Label htmlFor="idVerification" className="text-sm font-medium">
                  Completed
                </Label>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Verification documents help build trust with students and parents. 
              You can upload these documents later in your profile settings.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-3xl border border-green-200">
          <div className="flex items-start gap-3">
            <Award className="h-6 w-6 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Certification Tips</h4>
              <p className="text-sm text-green-700">
                Include teaching licenses, subject-specific certifications, language proficiency certificates, 
                and any relevant professional development credentials. Even informal certifications from online 
                courses can be valuable.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={cn(
              "px-12 py-4 font-semibold rounded-2xl text-lg shadow-xl transition-all duration-300",
              isFormValid 
                ? "bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white hover:shadow-2xl hover:scale-105" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Completing Profile..." : "Complete Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
};