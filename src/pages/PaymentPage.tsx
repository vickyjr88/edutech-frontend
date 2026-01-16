/**
 * Payment Page
 *
 * Standalone payment page for completing booking payment
 */

import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaymentProcessor from '@/components/payment/PaymentProcessor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MvpBookingService from '@/integrations/api/services/mvp-booking.service';

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Get booking details from location state or fetch them
  const [bookingDetails, setBookingDetails] = React.useState<{
    amount: number;
    offeringTitle: string;
    teacherName: string;
    scheduledDate: string;
  } | null>(location.state as any);

  const [loading, setLoading] = React.useState(!bookingDetails);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!bookingDetails && bookingId) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const booking = await MvpBookingService.getBooking(bookingId);
          setBookingDetails({
            amount: booking.price,
            offeringTitle: (booking.offeringId as any)?.title || 'Learning Session',
            teacherName: (booking.teacherId as any)?.fullName || 'Your Teacher',
            scheduledDate: booking.scheduledDate,
          });
        } catch (err) {
          console.error("Failed to fetch booking details:", err);
          setError("Could not load booking details");
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [bookingId, bookingDetails]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kidato-purple"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!bookingId || !bookingDetails || error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">{error || "Booking Not Found"}</h1>
              <p className="text-gray-600 mb-6">
                {error ? "We encountered an error loading your booking." : "The booking details could not be found."}
              </p>
              <Button onClick={() => navigate('/teachers')}>
                Browse Teachers
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSuccess = () => {
    navigate('/parents-dashboard/courses');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Complete Payment</h1>
            <p className="text-gray-600 mt-1">
              Pay securely with M-PESA via Paystack
            </p>
          </div>

          {/* Payment Processor */}
          <PaymentProcessor
            bookingId={bookingId}
            amount={bookingDetails.amount}
            offeringTitle={bookingDetails.offeringTitle}
            teacherName={bookingDetails.teacherName}
            scheduledDate={bookingDetails.scheduledDate}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
