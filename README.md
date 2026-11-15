# 🎓 Multi-School Management SaaS Platform
## Comprehensive Technical Architecture, Firebase Cloud Sync & Online UPI Payment Gateway

> Multi-Tenant Educational Infrastructure, Dynamic Student Limit Subscription Plans (200, 600, 1000, 2000, 5000), Cross-Platform Mobile Suite, Secured Firebase Database, and Live UPI Payment Gateway (`joy.john@ybl`).

---

## 🌐 Live Cloud Deployment & Links

| Service | Endpoint / Link | Description |
| :--- | :--- | :--- |
| **🚀 Live GitHub Pages App** | [https://johnjoyraj.github.io/school/](https://johnjoyraj.github.io/school/) | Fully deployed public SaaS web application |
| **📦 GitHub Repository** | [https://github.com/johnjoyraj/school](https://github.com/johnjoyraj/school) | Git repository with all sources, portals, scripts |
| **🔥 Firebase Realtime DB** | `https://adonaibroadcast-11095.firebaseio.com/school` | Cloud partition for tenant data & users |
| **💳 Online UPI Gateway** | `joy.john@ybl` (Joy John) | Instant UPI intent links, dynamic QR, UTR receipts |
| **🔒 Firebase Rules Console** | [Firebase Rules Console](https://console.firebase.google.com/project/adonaibroadcast-11095/database/adonaibroadcast-11095/rules) | Publish unified security rules editor |

---

## 🏛️ Ecosystem Overview & Implemented Portals

```
                               ┌─────────────────────────────────┐
                               │   APPLY FOR NEW SCHOOL PORTAL   │
                               │(200, 600, 1000, 2000, 5000 plan)│
                               │        apply_school.html        │
                               └────────────────┬────────────────┘
                                                │
                               ┌────────────────┴────────────────┐
                               │     UNIFIED SIGN-IN GATEWAY     │
                               │   (School Code + Password Gate) │
                               │            signin.html          │
                               └─┬──────────────┬──────────────┬─┘
                                 │              │              │
                   ┌─────────────┴─────┐ ┌──────┴────────┐ ┌───┴───────────────┐
                   │   PRINCIPAL /     │ │  STUDENT &    │ │   TEACHER &       │
                   │   SCHOOL ADMIN    │ │  PARENT APP   │ │   STAFF APP       │
                   │ school_admin.html │ │student_parent │ │ teacher_staff_app │
                   └───────────────────┘ └───────────────┘ └───────────────────┘
```

---

## 💳 Online UPI Payment Gateway Integration (`joy.john@ybl`)

The application integrates direct online UPI payments to **`joy.john@ybl`** across the entire lifecycle:

1. **School Subscription Activation ([`apply_school.html`](apply_school.html))**:
   - New schools choose their student capacity plan (200, 600, 1000, 2000, or 5000 children).
   - Instant "Pay via UPI QR / App" button generates dynamic QR code for `joy.john@ybl`.
   - Once UTR is entered, the school and principal account are provisioned immediately.

2. **Parent & Student Fee Payment ([`student_parent_app.html`](student_parent_app.html))**:
   - Parents see their child's term tuition fee balance directly on their mobile home screen.
   - 1-Tap "Pay Fees via UPI" triggers Google Pay / PhonePe / Paytm on mobile or shows high-resolution dynamic QR on desktop.
   - Electronic verified receipt is generated instantly with print/download capability.

3. **Admin Cashier Desk ([`school_admin.html`](school_admin.html))**:
   - School cashiers can click "Collect via UPI (joy.john@ybl)" to show on-screen dynamic QR codes to visiting parents.
   - Real-time cloud ledger recording UTR reference numbers.

---

## 🔒 Firebase Security & Credential Protection

1. **Root Read/Write Lockdown**:
   - Root (`/.json`) has `.read: false` and `.write: false` to eliminate automated warning emails and prevent unauthorized scraping.
2. **Encrypted Password Storage**:
   - Passwords for schools, principals, teachers, and students are **NEVER stored in plaintext**.
   - Cryptographically strong salted SHA-256 hashes (`password_salt` + `password_hash`) are generated using the Web Crypto API (`crypto.subtle.digest`) and Python `hashlib`.
3. **Protected Users Node**:
   - `/school/users` bulk reading is strictly blocked (`.read: false`) so user records cannot be dumped by external crawlers.
4. **Enforced Payment Validation**:
   - `/school/online_payments` strictly validates that transactions must target `joy.john@ybl` and cannot be deleted once recorded.

### Run Security Audit Anytime:
```bash
py check_firebase_security.py
```

---

## 🏫 The 3 Active Multi-Tenant Schools (All Pre-Seeded & Live)

| School Name | School Code | Default Password | Capacity Limit | Principal Login | Sample Teacher | Sample Student |
| :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| **St. Xavier's International Academy** | `SXIA` | `school123` | **1,000 Students** | `PRIN-SXIA-01`<br>(pwd: `admin123`) | `TCH-SXIA-01`<br>(Prof. Marcus Brody) | `ADM-2024-001`<br>(Aarav Sharma) |
| **Apex Global High School** | `APEX` | `school123` | **2,000 Students** | `PRIN-APEX-01`<br>(pwd: `admin123`) | `TCH-APEX-01`<br>(Mr. Alan Turing) | `ADM-APEX-101`<br>(Ethan Vance) |
| **Grace Model Public School** | `GMPS` | `school123` | **200 Students** | `PRIN-GMPS-01`<br>(pwd: `admin123`) | `TCH-GMPS-01`<br>(Mrs. Hannah Abbott) | `ADM-GMPS-01`<br>(Samuel Wilson) |

---

## 💳 Subscription Plans by Children Limit

| Plan Identifier | Plan Tier | Children / Student Limit | Annual Price | Key Features |
| :--- | :--- | :---: | :---: | :--- |
| `plan_200` | **Micro Academy** | **200** | ₹3,999 / yr | Core SIS, Attendance, Gradebook, Basic Notices |
| `plan_600` | **Standard School** | **600** | ₹9,999 / yr | Parent Portal, Multi-Child Switcher, Homework Engine |
| `plan_1000` | **Premier Campus** | **1,000** | ₹19,999 / yr | Fee Gateway, Instant Receipts, Timetables, Staff Leaves |
| `plan_2000` | **Advanced Institution**| **2,000** | ₹34,999 / yr | Live Bus GPS Tracking, Custom Subdomain, Analytics |
| `plan_5000` | **Enterprise Multi-Campus**| **5,000** | ₹69,999 / yr | Multi-Campus Sharding, White-label App, API Access |

---

## 🚀 Quick Launch (Local Development)

| Action / Interface | Launcher File | Description |
| :--- | :--- | :--- |
| **Start SaaS Server & Portal** | [`START_SCHOOL_SAAS.bat`](START_SCHOOL_SAAS.bat) | Launches multi-tenant API server on port 8088 & opens the suite |
| **Suite Master Control Center**| [`index.html`](index.html) | Main hub with 3 schools selector, plan limits, & blueprint |
| **🔑 Unified Sign-In Portal** | [`OPEN_SIGNIN_PORTAL.bat`](OPEN_SIGNIN_PORTAL.bat) | School Code + Password verification, Principal/Teacher/Student login |
| **➕ Apply for New School** | [`OPEN_APPLY_NEW_SCHOOL.bat`](OPEN_APPLY_NEW_SCHOOL.bat) | Onboard new school with 200, 600, 1000, 2000, or 5000 student plan |
| **School-Admin Web Panel** | [`OPEN_SCHOOL_ADMIN.bat`](OPEN_SCHOOL_ADMIN.bat) | Student enrollment, faculty, fee cashier, timetables |
| **Student & Parent Mobile App**| [`OPEN_STUDENT_PARENT_APP.bat`](OPEN_STUDENT_PARENT_APP.bat)| Multi-Child switcher, academic hub, digital ID card |
| **Teacher & Staff Mobile App** | [`OPEN_TEACHER_STAFF_APP.bat`](OPEN_TEACHER_STAFF_APP.bat) | 1-tap attendance, emergency directory, homework grading |
| **👑 Super-Admin Web Panel** | [`OPEN_SUPER_ADMIN.bat`](OPEN_SUPER_ADMIN.bat) | Platform-wide oversight (isolated from public school portals) |
| **Flutter Native Build** | [`DEPLOY_FLUTTER_APP.bat`](DEPLOY_FLUTTER_APP.bat) | Runs `flutter clean && pub get && build apk --release` |
