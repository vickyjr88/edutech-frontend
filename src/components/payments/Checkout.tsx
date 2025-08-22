import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { ArrowLeft, Users, Calendar, CreditCard, Phone, Check, Star, X } from 'lucide-react';
import { Enrollment } from '@/integrations/api/services/enrollment.service';
import { useClassById } from '@/hooks/use-class-service';
import { useAuth } from '@/contexts/AuthContext';
import { useGetProfileById } from '@/hooks/use-student-service';
import { useGetTeacherProfileById } from '@/hooks/use-teacher-service';
import { formatDate } from 'date-fns';

// Move component definitions outside to prevent re-creation on every render
const StepIndicator = ({ currentStep }: { currentStep: number }) => (
    <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
            {[1, 2, 3].map((stepNum) => (
                <React.Fragment key={stepNum}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${stepNum <= currentStep
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                        {stepNum < currentStep ? <Check size={16} /> : stepNum}
                    </div>
                    {stepNum < 3 && (
                        <div className={`w-12 h-0.5 ${stepNum < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                            }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    </div>
);

const CourseCard = ({ courseData, formData, formatPrice }: { courseData: any, formData: any, formatPrice: (price: number, seats: number) => string }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{courseData.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{courseData.rating}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{courseData.instructor}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{courseData.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{courseData.spotsRemaining} spots remaining</span>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(courseData.price, formData.seats)}
                </div>
                <div className="text-sm text-gray-500">
                    {courseData.currency} {courseData.price.toFixed(2)} per seat
                </div>
            </div>
        </div>
    </div>
);

interface CheckoutFlowProps {
    onClose: () => void;
    enrollment: Enrollment;
}

const CheckoutFlow = ({ onClose, enrollment }: CheckoutFlowProps) => {
    const { user } = useAuth()
    const { data: profile } = useGetProfileById(user?.id)
    const { data: classDataResponse, isLoading: isLoadingClass, error: classError } = useClassById(enrollment?.course?.id);

    const classData = classDataResponse?.data;
    const { data: teacherData } = useGetTeacherProfileById(classData?.teacher?._id)
    const teacher = teacherData?.data?.user;

    const [formData, setFormData] = useState({
        seats: 1,
        paymentMethod: 'credit-card',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        mpesaNumber: '',
        email: user?.email || '',
        fullName: user?.fullName || '',
        parentEmail: '',
        parentPhone: ''
    });

    const courseData = useMemo(() => {
        try {
            return {
                title: classData?.title || enrollment?.course?.title || 'Course',
                price: enrollment?.price || 0,
                currency: "USD",
                instructor: teacher?.fullName || 'TBD',
                rating: classData?.rating || enrollment?.course?.rating || 0,
                schedule: enrollment?.nextClass?.date ? 
                    `${formatDate(new Date(enrollment.nextClass.date), 'EEEE')}, ${enrollment.nextClass.time || 'TBA'}` : 
                    'TBD',
                startDate: classData?.cohorts?.[0]?.startDate ? 
                    formatDate(new Date(classData.cohorts[0].startDate), 'MMMM d, yyyy') : 
                    'TBD',
                enrollmentDeadline: enrollment?.enrollmentDeadline ? 
                    formatDate(new Date(enrollment.enrollmentDeadline), 'MMMM d, yyyy') : 
                    'TBD',
                spotsRemaining: enrollment?.participants ? 
                    Math.max(0, (enrollment.participants.maximum || 0) - (enrollment.participants.current || 0)) : 
                    0,
                duration: "12 weeks",
                description: classData?.description || 'Course description not available'
            };
        } catch (error) {
            console.error('Error creating courseData:', error);
            return {
                title: 'Course',
                price: 0,
                currency: "USD",
                instructor: 'TBD',
                rating: 0,
                schedule: 'TBD',
                startDate: 'TBD',
                enrollmentDeadline: 'TBD',
                spotsRemaining: 0,
                duration: "12 weeks",
                description: 'Course description not available'
            };
        }
    }, [classData, enrollment, teacher]);

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const formatPrice = useCallback((price, seats) => {
        const total = price * seats;
        return `${courseData.currency} ${total.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
    }, [courseData.currency]);

    const formatCardNumber = useCallback((value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    }, []);

    const formatExpiryDate = useCallback((value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    }, []);

    const [step, setStep] = useState(1);
    
    const handleNext = useCallback(() => {
        if (step < 3) setStep(step + 1);
    }, [step]);

    const handleBack = useCallback(() => {
        if (step > 1) setStep(step - 1);
    }, [step]);

    const handleSubmit = useCallback(() => {
        // Here you would typically handle the payment processing
        alert('Enrollment submitted! You will receive a confirmation email shortly.');
    }, []);

    // Early return for loading state
    if (isLoadingClass) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading course details...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Early return for error state
    if (classError || !classData) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="text-red-500 mb-4">
                                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Course</h3>
                                <p className="text-gray-600 mb-4">
                                    {classError ? 'There was an error loading the course details.' : 'Course not found.'}
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Course ID: {enrollment?.course?.id || 'Unknown'}</p>
                                    {classError && (
                                        <p className="text-sm text-red-500">Error: {classError?.message || 'Unknown error'}</p>
                                    )}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="mt-4 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const CourseCardMemoized = useMemo(() => (
        <CourseCard courseData={courseData} formData={formData} formatPrice={formatPrice} />
    ), [courseData, formData, formatPrice]);



    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBack}
                                className="p-2 hover:bg-gray-100 rounded-full"
                                disabled={step === 1}
                            >
                                <ArrowLeft className={`w-5 h-5 ${step === 1 ? 'text-gray-400' : 'text-gray-600'}`} />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Enroll in Course</h1>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    <StepIndicator currentStep={step} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Confirm Course Details</h2>
                                        {CourseCardMemoized}

                                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                            <h4 className="font-medium text-gray-900 mb-3">Session Information</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Start Date:</span>
                                                    <div className="font-medium">{courseData.startDate}</div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Duration:</span>
                                                    <div className="font-medium">{courseData.duration}</div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Schedule:</span>
                                                    <div className="font-medium">{courseData.schedule}</div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Enrollment Deadline:</span>
                                                    <div className="font-medium text-orange-600">{courseData.enrollmentDeadline}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                Number of Seats
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => handleInputChange('seats', Math.max(1, formData.seats - 1))}
                                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                >
                                                    -
                                                </button>
                                                <span className="text-xl font-semibold w-8 text-center">{formData.seats}</span>
                                                <button
                                                    onClick={() => handleInputChange('seats', Math.min(10, formData.seats + 1))}
                                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                >
                                                    +
                                                </button>
                                                <span className="text-sm text-gray-600 ml-4">
                                                    {formData.seats === 1 ? '1 seat' : `${formData.seats} seats`} • Max 10 seats per order
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Student Information</h2>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Check className="w-5 h-5 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-900">Using your profile information</span>
                                            </div>
                                            <p className="text-sm text-blue-700">
                                                We've pre-filled your details from your account. You can edit them if needed.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Student Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.fullName}
                                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                                    placeholder="Enter student's full name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Student Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                                    placeholder="student@example.com"
                                                />
                                            </div>

                                            <div className="border-t pt-4">
                                                <h4 className="font-medium text-gray-900 mb-4">Parent/Guardian Information</h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Parent/Guardian Email *
                                                        </label>
                                                        <input
                                                            type="email"
                                                            value={formData.parentEmail}
                                                            onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                                            placeholder="parent@example.com"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Parent/Guardian Phone *
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            value={formData.parentPhone}
                                                            onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                                            placeholder="+254 700 000 000"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Method</h2>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => handleInputChange('paymentMethod', 'credit-card')}
                                                    className={`p-4 border-2 rounded-lg flex items-center gap-3 ${formData.paymentMethod === 'credit-card'
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <CreditCard className="w-5 h-5" />
                                                    <span className="font-medium">Credit/Debit Card</span>
                                                </button>

                                                <button
                                                    onClick={() => handleInputChange('paymentMethod', 'mpesa')}
                                                    className={`p-4 border-2 rounded-lg flex items-center gap-3 ${formData.paymentMethod === 'mpesa'
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <Phone className="w-5 h-5" />
                                                    <span className="font-medium">M-Pesa</span>
                                                </button>
                                            </div>

                                            {formData.paymentMethod === 'credit-card' && (
                                                <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                                                    <h4 className="font-medium text-gray-900 mb-4">Card Details</h4>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Cardholder Name *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={formData.cardholderName}
                                                                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                placeholder="Full name on card"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Card Number *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={formData.cardNumber}
                                                                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                placeholder="1234 5678 9012 3456"
                                                                maxLength={19}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Expiry Date *
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.expiryDate}
                                                                    onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    placeholder="MM/YY"
                                                                    maxLength={5}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    CVV *
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.cvv}
                                                                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    placeholder="123"
                                                                    maxLength={4}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {formData.paymentMethod === 'mpesa' && (
                                                <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                                                    <h4 className="font-medium text-gray-900 mb-4">M-Pesa Details</h4>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            M-Pesa Phone Number *
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            value={formData.mpesaNumber}
                                                            onChange={(e) => handleInputChange('mpesaNumber', e.target.value)}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="+254 700 000 000"
                                                        />
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            You'll receive an M-Pesa prompt to complete the payment
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="sticky top-8">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Course Fee ({formData.seats} seat{formData.seats > 1 ? 's' : ''})</span>
                                            <span className="font-medium">{formatPrice(courseData.price, formData.seats)}</span>
                                        </div>
                                        <div className="border-t pt-3">
                                            <div className="flex justify-between text-lg font-semibold">
                                                <span>Total</span>
                                                <span>{formatPrice(courseData.price, formData.seats)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    {step < 3 ? (
                                        <button
                                            onClick={handleNext}
                                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            {step === 1 ? 'Continue to Student Info' : 'Continue to Payment'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSubmit}
                                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                                        >
                                            Complete Enrollment
                                        </button>
                                    )}

                                    {step > 1 && (
                                        <button
                                            onClick={handleBack}
                                            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                        >
                                            Back
                                        </button>
                                    )}
                                </div>

                                <div className="mt-6 text-xs text-gray-500">
                                    <p>💳 Secure payment processing</p>
                                    <p>📧 Instant confirmation email</p>
                                    <p>🔒 Your data is protected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutFlow;