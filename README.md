# 🎓 Multi-School Management SaaS Platform
## Comprehensive Technical Architecture & Implementation Blueprint

> Multi-Tenant Educational Infrastructure, Dynamic Student Limit Subscription Plans (200, 600, 1000, 2000, 5000), Cross-Platform Mobile Suite, and Unified Authentication Gateway.

---

## 🏛️ Ecosystem Overview & Implemented Portals

The platform provides a complete educational SaaS ecosystem enabling school tenant onboarding, institutional administration, role-based sign-in, and cross-platform mobile engagement:

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

## 🚀 Quick Launch

| Action / Interface | Launcher File | Description |
| :--- | :--- | :--- |
| **Start SaaS Server & Portal** | [`START_SCHOOL_SAAS.bat`](file:///e:/MYWORKSPACE/school/START_SCHOOL_SAAS.bat) | Launches multi-tenant API server on port 8088 & opens the suite |
| **Suite Master Control Center**| [`index.html`](file:///e:/MYWORKSPACE/school/index.html) | Main hub with 3 schools selector, plan limits, & blueprint |
| **🔑 Unified Sign-In Portal** | [`OPEN_SIGNIN_PORTAL.bat`](file:///e:/MYWORKSPACE/school/OPEN_SIGNIN_PORTAL.bat) | School Code + Password verification, Principal/Teacher/Student login |
| **➕ Apply for New School** | [`OPEN_APPLY_NEW_SCHOOL.bat`](file:///e:/MYWORKSPACE/school/OPEN_APPLY_NEW_SCHOOL.bat) | Onboard new school with 200, 600, 1000, 2000, or 5000 student plan |
| **School-Admin Web Panel** | [`OPEN_SCHOOL_ADMIN.bat`](file:///e:/MYWORKSPACE/school/OPEN_SCHOOL_ADMIN.bat) | Student enrollment, faculty, fee cashier, timetables |
| **Student & Parent Mobile App**| [`OPEN_STUDENT_PARENT_APP.bat`](file:///e:/MYWORKSPACE/school/OPEN_STUDENT_PARENT_APP.bat)| Multi-Child switcher, academic hub, digital ID card |
| **Teacher & Staff Mobile App** | [`OPEN_TEACHER_STAFF_APP.bat`](file:///e:/MYWORKSPACE/school/OPEN_TEACHER_STAFF_APP.bat) | 1-tap attendance, emergency directory, homework grading |
| **👑 Super-Admin Web Panel** | [`OPEN_SUPER_ADMIN.bat`](file:///e:/MYWORKSPACE/school/OPEN_SUPER_ADMIN.bat) | Platform-wide oversight (isolated from public school portals) |
| **Flutter Native Build** | [`DEPLOY_FLUTTER_APP.bat`](file:///e:/MYWORKSPACE/school/DEPLOY_FLUTTER_APP.bat) | Runs `flutter clean && pub get && build apk --release` |

---

## 🏫 The 3 Active Multi-Tenant Schools (All Pre-Seeded & Live)

Each school operates in its own isolated database tenant partition with pre-seeded classes, students, teachers, fee structures, notices, and timetables:

| School Name | School Code | Default Password | Capacity Limit | Principal Login | Sample Teacher | Sample Student |
| :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| **St. Xavier's International Academy** | `SXIA` | `school123` | **1,000 Students** | `PRIN-SXIA-01`<br>(pwd: `admin123`) | `TCH-SXIA-01`<br>(Prof. Marcus Brody) | `ADM-2024-001`<br>(Aarav Sharma) |
| **Apex Global High School** | `APEX` | `school123` | **2,000 Students** | `PRIN-APEX-01`<br>(pwd: `admin123`) | `TCH-APEX-01`<br>(Mr. Alan Turing) | `ADM-APEX-101`<br>(Ethan Vance) |
| **Grace Model Public School** | `GMPS` | `school123` | **200 Students** | `PRIN-GMPS-01`<br>(pwd: `admin123`) | `TCH-GMPS-01`<br>(Mrs. Hannah Abbott) | `ADM-GMPS-01`<br>(Samuel Wilson) |

---

## 💳 Subscription Plans by Children Limit

Educational institutions choose their subscription plan based on student capacity:

| Plan Identifier | Plan Tier | Children / Student Limit | Monthly Price | Annual Price | Key Features |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `plan_200` | **Micro Academy** | **200** | \$49 / mo | \$490 / yr | Core SIS, Attendance, Gradebook, Basic Notices |
| `plan_600` | **Standard School** | **600** | \$129 / mo | \$1,290 / yr | Parent Portal, Multi-Child Switcher, Homework Engine |
| `plan_1000` | **Premier Campus** | **1,000** | \$249 / mo | \$2,490 / yr | Fee Gateway, Instant Receipts, Timetables, Staff Leaves |
| `plan_2000` | **Advanced Institution**| **2,000** | \$449 / mo | \$4,490 / yr | Live Bus GPS Tracking, Custom Subdomain, Analytics |
| `plan_5000` | **Enterprise Multi-Campus**| **5,000** | \$899 / mo | \$8,990 / yr | Multi-Campus Sharding, White-label App, API Access |

---

## 🔐 Two-Stage Authentication & Role Sign-In Flow

1. **School Code & Password Gate**: Users enter their school's unique code (e.g. `SXIA`, `APEX`, `GMPS`) and access password (`school123`) to unlock their institution's portal.
2. **Role Sign-In Selection**:
   - 🏫 **Principal / School Admin**: Enter Principal ID (e.g. `PRIN-SXIA-01`) + Password (`admin123`).
   - 👨‍🏫 **Teacher / Staff**: Enter Teacher Code (e.g. `TCH-APEX-01`) + Password (`teach123`).
   - 👨‍🎓 **Student / Parent**: Enter Admission / Roll No (e.g. `ADM-2024-001`) + Password (`student123`).
3. **Super Admin Isolation**: Super Admin links have been completely removed from public school portals (`school_admin.html`, `student_parent_app.html`, `teacher_staff_app.html`, and `index.html`) and are exclusively available via `OPEN_SUPER_ADMIN.bat`.
