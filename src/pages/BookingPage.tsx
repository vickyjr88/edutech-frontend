import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Calendar,
    Clock,
    ChevronRight,
    ChevronLeft,
    Check,
    User,
    BookOpen,
    CreditCard,
    AlertCircle,
    Loader2,
    CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { MvpTeacherService } from '@/integrations/api/services/mvp-teacher.service';
import { MvpParentService, Child } from '@/integrations/api/services/mvp-parent.service';
import MvpBookingService from '@/integrations/api/services/mvp-booking.service';
import MvpAvailabilityService from '@/integrations/api/services/mvp-availability.service';
import { useAuth } from '@/contexts/AuthContext';

type BookingStep = 'offering' | 'child' | 'datetime' | 'confirm';

const BookingPage = () => {
    const { teacherId } = useParams<{ teacherId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [step, setStep] = useState<BookingStep>('offering');
    const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState<any>(null);
    const [children, setChildren] = useState<Child[]>([]);

    // Selection state
    const [selectedOffering, setSelectedOffering] = useState<any>(null);
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [slotsLoading, setSlotsLoading] = useState(false);

    useEffect(() => {
        if (teacherId) {
            loadTeacherData();
        }
    }, [teacherId]);

    useEffect(() => {
        if (user && user.role === 'parent') {
            loadChildren();
        }
    }, [user]);

    useEffect(() => {
        if (selectedDate && teacherId) {
            loadAvailableSlots();
        }
    }, [selectedDate, teacherId]);

    const loadTeacherData = async () => {
        try {
            setLoading(true);
            const data = await MvpTeacherService.getTeacherDetails(teacherId!);
            setTeacher(data);
        } catch (error) {
            console.error('Failed to load teacher data:', error);
            toast.error('Failed to load teacher details');
        } finally {
            setLoading(false);
        }
    };

    const loadChildren = async () => {
        try {
            const data = await MvpParentService.getChildren();
            setChildren(data);
        } catch (error) {
            console.error('Failed to load children:', error);
        }
    };

    const loadAvailableSlots = async () => {
        try {
            setSlotsLoading(true);
            const slots = await MvpAvailabilityService.getAvailableSlots(teacherId!, selectedDate);
            setAvailableSlots(slots);
        } catch (error) {
            console.error('Failed to load slots:', error);
            toast.error('Failed to load available slots');
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleNext = () => {
        if (step === 'offering') setStep('child');
        else if (step === 'child') setStep('datetime');
        else if (step === 'datetime') setStep('confirm');
    };

    const handleBack = () => {
        if (step === 'child') setStep('offering');
        else if (step === 'datetime') setStep('child');
        else if (step === 'confirm') setStep('datetime');
    };

    const handleBooking = async () => {
        if (!selectedOffering || !selectedChild || !selectedDate || !selectedTime) {
            toast.error('Please complete all selections');
            return;
        }

        try {
            setBookingLoading(true);

            const booking = await MvpBookingService.createBooking({
                offeringId: selectedOffering._id,
                teacherId: teacherId!,
                studentName: selectedChild.fullName,
                studentGrade: selectedChild.gradeLevel,
                scheduledDate: selectedDate,
                scheduledTime: selectedTime,
                notes: "", // Can add notes field to UI later
            });

            toast.success('Session booked successfully!');
            navigate(`/payment/${booking._id}`);
        } catch (error) {
            console.error('Booking failed:', error);
            toast.error('Failed to create booking');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-kidato-purple mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading session details...</p>
                </div>
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="max-w-md w-full p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Teacher Not Found</h2>
                    <p className="text-gray-600 mb-6">We couldn't find the teacher you're looking for.</p>
                    <Button onClick={() => navigate('/teachers')} className="bg-kidato-purple">
                        Browse Teachers
                    </Button>
                </Card>
            </div>
        );
    }

    const steps = [
        { id: 'offering', label: 'Session Type', icon: BookOpen },
        { id: 'child', label: 'Student', icon: User },
        { id: 'datetime', label: 'Date & Time', icon: Calendar },
        { id: 'confirm', label: 'Confirm', icon: Check },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === step);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    {/* Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <button
                                onClick={() => navigate(`/teacher/${teacherId}`)}
                                className="flex items-center text-sm font-medium text-gray-500 hover:text-kidato-purple mb-2 transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Back to Profile
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">Book your session</h1>
                            <p className="text-gray-600 mt-1">Schedule a learning session with <span className="font-semibold text-kidato-purple">{teacher.fullName}</span></p>
                        </div>

                        <div className="flex items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex -space-x-2 mr-3">
                                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                                    <img src={teacher.profileImage || "/placeholder.svg"} alt={teacher.fullName} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-gray-900">{teacher.fullName}</p>
                                <p className="text-gray-500 text-xs">Professional Educator</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-10 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
                        <div
                            className="absolute top-1/2 left-0 h-0.5 bg-kidato-purple -translate-y-1/2 z-0 transition-all duration-500"
                            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        ></div>

                        <div className="relative z-10 flex justify-between">
                            {steps.map((s, i) => {
                                const Icon = s.icon;
                                const isActive = step === s.id;
                                const isCompleted = currentStepIndex > i;

                                return (
                                    <div key={s.id} className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                                                ? 'bg-kidato-purple text-white shadow-lg ring-4 ring-purple-100'
                                                : isCompleted
                                                    ? 'bg-kidato-purple text-white'
                                                    : 'bg-white text-gray-400 border-2 border-gray-200'
                                                }`}
                                        >
                                            {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                        </div>
                                        <span className={`text-xs font-bold mt-2 ${isActive ? 'text-kidato-purple' : 'text-gray-500'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Area */}
                        <Card className="lg:col-span-2 shadow-xl border-none overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {step === 'offering' && 'Select what you want to learn'}
                                        {step === 'child' && 'Who is learning?'}
                                        {step === 'datetime' && 'Pick your preferred slot'}
                                        {step === 'confirm' && 'Review details'}
                                    </h2>
                                    <Badge variant="outline" className="bg-gray-50 text-gray-600">
                                        Step {currentStepIndex + 1} of 4
                                    </Badge>
                                </div>

                                <div className="p-8">
                                    {/* Step 1: Offering Selection */}
                                    {step === 'offering' && (
                                        <div className="space-y-4">
                                            {teacher.offerings?.length > 0 ? (
                                                <RadioGroup
                                                    value={selectedOffering?._id}
                                                    onValueChange={(val) => setSelectedOffering(teacher.offerings.find((o: any) => o._id === val))}
                                                    className="grid gap-4"
                                                >
                                                    {teacher.offerings.map((offering: any) => (
                                                        <div
                                                            key={offering._id}
                                                            className={`relative group border-2 rounded-2xl p-5 cursor-pointer transition-all ${selectedOffering?._id === offering._id
                                                                ? 'border-kidato-purple bg-purple-50/50 shadow-md'
                                                                : 'border-gray-100 hover:border-purple-200 hover:bg-gray-50/50'
                                                                }`}
                                                            onClick={() => setSelectedOffering(offering)}
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <h3 className="font-bold text-lg text-gray-900">{offering.title}</h3>
                                                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 capitalize">
                                                                            {offering.type.replace('-', ' ')}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{offering.description}</p>
                                                                    <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                                                                        <div className="flex items-center">
                                                                            <Clock className="h-3.5 w-3.5 mr-1 text-kidato-purple" />
                                                                            {offering.sessionDuration} mins
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <BookOpen className="h-3.5 w-3.5 mr-1 text-kidato-purple" />
                                                                            {offering.subject}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right ml-4">
                                                                    <p className="text-2xl font-black text-kidato-purple">${offering.price}</p>
                                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Per session</p>
                                                                </div>
                                                            </div>
                                                            <RadioGroupItem value={offering._id} className="sr-only" />
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            ) : (
                                                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                    <p className="text-gray-500 font-medium">This teacher hasn't added any offerings yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Step 2: Child Selection */}
                                    {step === 'child' && (
                                        <div className="space-y-6">
                                            {user ? (
                                                children.length > 0 ? (
                                                    <RadioGroup
                                                        value={selectedChild?._id}
                                                        onValueChange={(val) => setSelectedChild(children.find(c => c._id === val) || null)}
                                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                    >
                                                        {children.map((child) => (
                                                            <div
                                                                key={child._id}
                                                                className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${selectedChild?._id === child._id
                                                                    ? 'border-kidato-purple bg-purple-50 shadow-md scale-[1.02]'
                                                                    : 'border-gray-100 hover:border-purple-200'
                                                                    }`}
                                                                onClick={() => setSelectedChild(child)}
                                                            >
                                                                <div className="w-12 h-12 rounded-full bg-kidato-purple/10 flex items-center justify-center mr-4">
                                                                    <User className="h-6 w-6 text-kidato-purple" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="font-bold text-gray-900">{child.fullName}</p>
                                                                    <p className="text-gray-500 text-xs">{child.gradeLevel}</p>
                                                                </div>
                                                                <RadioGroupItem value={child._id} className="sr-only" />
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                ) : (
                                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                                        <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                        <p className="text-gray-500 font-medium mb-4">You haven't added any children yet.</p>
                                                        <Button onClick={() => navigate('/parents-dashboard/children')} variant="outline" className="border-kidato-purple text-kidato-purple">
                                                            Add a Child
                                                        </Button>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="text-center py-12">
                                                    <p className="text-gray-600 mb-4">You need to be logged in as a parent to book a session.</p>
                                                    <Button onClick={() => navigate('/login', { state: { from: location } })} className="bg-kidato-purple">
                                                        Log In / Sign Up
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Step 3: Date & Time Selection */}
                                    {step === 'datetime' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                                    <CalendarDays className="h-5 w-5 mr-2 text-kidato-purple" />
                                                    Select Date
                                                </h3>
                                                <div className="grid grid-cols-7 gap-2">
                                                    {/* Simplified Calendar - In real app use a full calendar library */}
                                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                                        <div key={d} className="text-center text-[10px] font-black text-gray-400 uppercase py-1">{d}</div>
                                                    ))}
                                                    {Array.from({ length: 31 }).map((_, i) => {
                                                        const date = `2026-01-${(i + 1).toString().padStart(2, '0')}`;
                                                        const isPast = (i + 1) < new Date().getDate();
                                                        return (
                                                            <button
                                                                key={i}
                                                                disabled={isPast}
                                                                onClick={() => setSelectedDate(date)}
                                                                className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${selectedDate === date
                                                                    ? 'bg-kidato-purple text-white shadow-lg scale-110'
                                                                    : isPast
                                                                        ? 'text-gray-200 cursor-not-allowed'
                                                                        : 'text-gray-600 hover:bg-purple-50 hover:text-kidato-purple'
                                                                    }`}
                                                            >
                                                                {i + 1}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex flex-col">
                                                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                                    <Clock className="h-5 w-5 mr-2 text-kidato-purple" />
                                                    Available Time
                                                </h3>
                                                {selectedDate ? (
                                                    <ScrollArea className="flex-1 max-h-[300px] pr-4">
                                                        <div className="grid grid-cols-2 gap-3 pb-4">
                                                            {slotsLoading ? (
                                                                <div className="col-span-2 py-12 flex flex-col items-center justify-center">
                                                                    <Loader2 className="h-8 w-8 animate-spin text-kidato-purple mb-2" />
                                                                    <p className="text-xs text-gray-400 font-medium italic">Finding slots...</p>
                                                                </div>
                                                            ) : availableSlots.length > 0 ? (
                                                                availableSlots.map(time => (
                                                                    <button
                                                                        key={time}
                                                                        onClick={() => setSelectedTime(time)}
                                                                        className={`px-4 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${selectedTime === time
                                                                            ? 'bg-kidato-purple text-white border-kidato-purple shadow-md'
                                                                            : 'border-gray-100 text-gray-600 hover:border-purple-200 hover:bg-purple-50/50'
                                                                            }`}
                                                                    >
                                                                        {time}
                                                                    </button>
                                                                ))
                                                            ) : (
                                                                <div className="col-span-2 py-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                                                    <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                                                    <p className="text-gray-400 text-xs font-medium italic">No availability found for this date.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </ScrollArea>
                                                ) : (
                                                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-6 text-center border-2 border-dashed border-gray-100">
                                                        <Calendar className="h-10 w-10 text-gray-200 mb-2" />
                                                        <p className="text-gray-400 text-sm">Please select a date first</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: Confirmation */}
                                    {step === 'confirm' && (
                                        <div className="space-y-6">
                                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100">
                                                <h3 className="font-black text-gray-900 text-2xl mb-6">Booking Overview</h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-6">
                                                        <div className="flex items-start">
                                                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center mr-4 shrink-0">
                                                                <BookOpen className="h-5 w-5 text-kidato-purple" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Session</p>
                                                                <p className="font-bold text-gray-900">{selectedOffering?.title}</p>
                                                                <p className="text-gray-500 text-xs">{selectedOffering?.subject} • {selectedOffering?.sessionDuration} mins</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start">
                                                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center mr-4 shrink-0">
                                                                <User className="h-5 w-5 text-kidato-purple" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Student</p>
                                                                <p className="font-bold text-gray-900">{selectedChild?.fullName}</p>
                                                                <p className="text-gray-500 text-xs">{selectedChild?.gradeLevel}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="flex items-start">
                                                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center mr-4 shrink-0">
                                                                <Calendar className="h-5 w-5 text-kidato-purple" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date & Time</p>
                                                                <p className="font-bold text-gray-900">{new Date(selectedDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                                                <p className="text-gray-500 text-xs">At {selectedTime} (Your Timezone)</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start">
                                                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center mr-4 shrink-0">
                                                                <CreditCard className="h-5 w-5 text-kidato-purple" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                                                                <p className="font-bold text-gray-900 text-xl text-kidato-purple">${selectedOffering?.price}</p>
                                                                <p className="text-gray-500 text-xs flex items-center">
                                                                    <Check className="h-3 w-3 text-green-500 mr-1" />
                                                                    Secure Checkout
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                                <p className="text-xs text-amber-800 leading-relaxed">
                                                    By confirming, you agree to our 24-hour cancellation policy. A meeting link will be sent to your email after successful payment.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Actions */}
                                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                                    {step !== 'offering' ? (
                                        <Button variant="ghost" onClick={handleBack} className="text-gray-500 font-bold hover:text-gray-900">
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Back
                                        </Button>
                                    ) : (
                                        <div />
                                    )}

                                    {step === 'confirm' ? (
                                        <Button
                                            onClick={handleBooking}
                                            disabled={bookingLoading}
                                            className="bg-kidato-purple hover:bg-blue-700 px-10 h-12 rounded-2xl text-base font-black shadow-lg shadow-purple-200 transition-all active:scale-95"
                                        >
                                            {bookingLoading ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Confirm & Proceed to Payment'
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleNext}
                                            disabled={
                                                (step === 'offering' && !selectedOffering) ||
                                                (step === 'child' && !selectedChild) ||
                                                (step === 'datetime' && (!selectedDate || !selectedTime))
                                            }
                                            className="bg-kidato-purple hover:bg-blue-700 px-10 h-12 rounded-2xl text-base font-black shadow-lg shadow-purple-200 transition-all active:scale-95"
                                        >
                                            Next step
                                            <ChevronRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sidebar Summary */}
                        <div className="space-y-6">
                            <Card className="shadow-lg border-none overflow-hidden rounded-3xl">
                                <div className="bg-gray-900 p-6 text-white">
                                    <h3 className="font-bold flex items-center">
                                        <CreditCard className="h-4 w-4 mr-2 text-purple-400" />
                                        Summary
                                    </h3>
                                </div>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Session</span>
                                            <span className="font-bold text-gray-900 truncate max-w-[120px]">{selectedOffering?.title || 'Not selected'}</span>
                                        </div>
                                        {selectedOffering && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Price</span>
                                                <span className="font-bold text-gray-900">${selectedOffering.price}</span>
                                            </div>
                                        )}
                                        <Separator className="bg-gray-100" />
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="font-black text-gray-900">Total</span>
                                            <div className="text-right">
                                                <span className="text-2xl font-black text-kidato-purple">${selectedOffering?.price || '0.00'}</span>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">USD</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                                    <Check className="h-4 w-4 mr-2 text-green-500" />
                                    Why Kidato?
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                        'Expert vetted tutors',
                                        'Personalized 1-on-1 focus',
                                        'Interactive learning tools',
                                        'Flexible scheduling',
                                        'Secure payment processing'
                                    ].map(item => (
                                        <li key={item} className="flex items-center text-xs text-gray-600 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-kidato-purple mr-2 shrink-0"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BookingPage;
