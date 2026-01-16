# Kidato MVP - Setup Status

**Date:** January 15, 2026
**Status:** Initial Setup Complete ✅

---

## ✅ Completed

### 1. Project Cloning
- ✅ Cloned `learniverse-kidato` to `kidato-mvp`
- ✅ All code preserved (no deletions)
- ✅ Git initialized

### 2. Environment Configuration
- ✅ Created `.env.example` with MVP-specific variables
- ✅ Copied to `.env` for local development
- ✅ Added feature flags for all MVP/non-MVP features
- ✅ Configured Kenya-specific settings (KES, timezone, phone prefix)

**Key Environment Variables:**
- `VITE_MVP_MODE=true` - Master MVP switch
- `VITE_MVP_API_URL` - Namespace for new MVP APIs (`/api/v1/mvp`)
- `VITE_ENABLE_MPESA_PAYMENT=true` - M-PESA payment flag
- Individual feature flags for granular control

### 3. Feature Flags System
- ✅ Created `/src/config/features.ts`
- ✅ Centralized feature toggle system
- ✅ TypeScript-safe feature checking
- ✅ Development mode logging

**Feature Categories:**
- **Enabled**: Teacher profiles, offerings, booking, M-PESA, admin, CMS, blog, newsletter
- **Disabled (Hidden from UI)**: Messaging, Zoom, Google Calendar, reviews, advanced analytics, assignments

### 4. MVP API Client
- ✅ Created `/src/integrations/api/mvp-client.ts`
- ✅ Axios instance configured for `/mvp` namespace
- ✅ Auth token interceptors
- ✅ Auto token refresh on 401
- ✅ File upload support

### 5. MVP Payment Service
- ✅ Created `/src/integrations/api/services/mvp-payment.service.ts`
- ✅ M-PESA STK Push integration ready
- ✅ Payment status polling
- ✅ Phone number validation/formatting
- ✅ Payment history retrieval
- ✅ Receipt download

---

## 📋 Next Steps

### Frontend (Week 5-8)
1. **Update Routes** (Priority: HIGH)
   - [ ] Modify `AppRoutes.tsx` to hide non-MVP routes
   - [ ] Create MVP-specific route guard component
   - [ ] Update Navbar/Sidebar to hide non-MVP links
   - [ ] Test routing with feature flags

2. **Simplified Components** (Priority: HIGH)
   - [ ] Create simplified `TeacherProfileForm` (single-step)
   - [ ] Create simplified `ClassSetupForm` (no AI wizard)
   - [ ] Create `MpesaPaymentForm` component
   - [ ] Create `PaymentStatusPoller` component

3. **Dashboard Updates** (Priority: MEDIUM)
   - [ ] Simplify `TeacherDashboard` (hide messaging, zoom tabs)
   - [ ] Simplify `ParentDashboard` (basic bookings + payments only)
   - [ ] Update analytics to show numbers only (no charts)

4. **Testing** (Priority: HIGH)
   - [ ] Test with M-PESA sandbox
   - [ ] End-to-end booking flow
   - [ ] Feature flag toggles
   - [ ] Mobile responsive

### Backend (Week 1-4)
1. **Create `/mvp` Namespace Module** (Priority: CRITICAL)
   - [ ] Create `MvpModule` in kidato-api
   - [ ] Add to `AppModule` imports
   - [ ] Set up controller with `/mvp` prefix

2. **M-PESA Integration** (Priority: CRITICAL - BLOCKING)
   - [ ] Install Flutterwave SDK
   - [ ] Create `PaymentGatewayService`
   - [ ] Implement STK Push initiation
   - [ ] Implement webhook handler
   - [ ] Add signature verification
   - [ ] Test with sandbox

3. **Simplified Endpoints** (Priority: HIGH)
   - [ ] `POST /mvp/payments/initiate-mpesa`
   - [ ] `POST /mvp/payments/webhook`
   - [ ] `GET /mvp/payments/status/:ref`
   - [ ] `GET /mvp/payments/history`
   - [ ] `POST /mvp/payments/receipt`

4. **Teacher Approval Workflow** (Priority: HIGH)
   - [ ] Add `status` field to TeacherProfile
   - [ ] `GET /admin/teachers/pending`
   - [ ] `POST /admin/teachers/:id/approve`
   - [ ] `POST /admin/teachers/:id/reject`
   - [ ] Email notifications

---

## 🎯 Strategy Summary

### What We're Doing:
✅ **Keep All Code** - No deletions, everything preserved for future
✅ **Hide via UI** - Use feature flags and routing to hide non-MVP features
✅ **Keep CMS/Blog/Newsletter** - Important for marketing
✅ **Keep Admin Panel** - Essential for operations
✅ **Add `/mvp` Namespace** - For new simplified APIs (especially M-PESA)

### What's Hidden (Code Stays):
❌ In-app Messaging UI (use WhatsApp)
❌ Zoom Integration UI (manual links)
❌ Google Calendar UI (manual scheduling)
❌ Complex Class Setup Wizard (use simple form)
❌ Advanced Analytics Charts (show basic numbers)
❌ Student Achievements/Quests (future gamification)
❌ Assignment System (future feature)
❌ Review/Rating System (post-launch)

---

## 📁 New Files Created

```
kidato-mvp/
├── .env.example                              # ✅ MVP-specific env template
├── .env                                      # ✅ Local environment config
├── src/
│   ├── config/
│   │   └── features.ts                       # ✅ Feature flags system
│   └── integrations/api/
│       ├── mvp-client.ts                     # ✅ API client for /mvp namespace
│       └── services/
│           └── mvp-payment.service.ts        # ✅ M-PESA payment service
└── MVP_SETUP_STATUS.md                       # ✅ This file
```

---

## 🔐 Environment Variables Added

### MVP Mode
- `VITE_MVP_MODE` - Enable MVP mode

### API Configuration
- `VITE_API_URL` - Main API base URL
- `VITE_MVP_API_URL` - MVP namespace URL

### Feature Flags (Enabled)
- `VITE_ENABLE_TEACHER_PROFILES`
- `VITE_ENABLE_OFFERINGS`
- `VITE_ENABLE_BOOKING`
- `VITE_ENABLE_MPESA_PAYMENT`
- `VITE_ENABLE_ADMIN_PANEL`
- `VITE_ENABLE_CMS`
- `VITE_ENABLE_BLOG`
- `VITE_ENABLE_NEWSLETTER`

### Feature Flags (Disabled)
- `VITE_ENABLE_MESSAGING`
- `VITE_ENABLE_ZOOM_INTEGRATION`
- `VITE_ENABLE_GOOGLE_CALENDAR`
- `VITE_ENABLE_REVIEWS`
- `VITE_ENABLE_ADVANCED_ANALYTICS`
- `VITE_ENABLE_STUDENT_ACHIEVEMENTS`
- `VITE_ENABLE_ASSIGNMENTS`

### Regional (Kenya)
- `VITE_DEFAULT_LOCALE=en-KE`
- `VITE_DEFAULT_TIMEZONE=Africa/Nairobi`
- `VITE_CURRENCY=KES`
- `VITE_COUNTRY_CODE=KE`
- `VITE_PHONE_PREFIX=254`

---

## 🧪 Testing Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

---

## 📝 Usage Examples

### Feature Flags in Components

```typescript
import { features } from '@/config/features';

// In your component
function TeacherDashboard() {
  return (
    <div>
      <BookingsTab />
      <EarningsTab />

      {features.messaging.enabled && <MessagingTab />}
      {features.integrations.zoom && <ZoomTab />}
      {features.analytics.advanced && <AdvancedAnalytics />}
    </div>
  );
}
```

### MVP API Client Usage

```typescript
import { mvpPaymentService } from '@/integrations/api/services/mvp-payment.service';

// Initiate M-PESA payment
const payment = await mvpPaymentService.initiateMpesaPayment({
  enrollmentId: 'enrollment-123',
  phoneNumber: '0712345678',
  amount: 2000,
});

// Poll for status
const status = await mvpPaymentService.pollPaymentStatus(
  payment.transactionRef,
  { timeout: 120000 }
);
```

---

## 🚀 Ready for Development

**Frontend:**
- ✅ Environment configured
- ✅ Feature flags ready
- ✅ API client ready
- ✅ M-PESA service ready
- ⏳ Routes need update
- ⏳ Components need simplification

**Backend:**
- ⏳ `/mvp` namespace needs creation
- ⏳ M-PESA integration needs implementation
- ⏳ Teacher approval workflow needs implementation
- ⏳ Simplified endpoints need creation

---

**Next Action:** Start backend work (Week 1-4 plan) or continue frontend setup

