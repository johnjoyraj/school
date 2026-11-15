// Step 1 of SaaS Blueprint: Backend Setup & API Linkage
class AppConstants {
  // Live backend domain or local testing endpoint
  static const String baseUrl = "http://localhost:8088/api";

  // Active School Tenant identifier (Multi-Tenant Header)
  static const int defaultSchoolId = 1;
  static const String schoolHeaderKey = "X-School-Id";

  // App Identity
  static const String appName = "EduSaaS Mobile Portal";
  static const String appVersion = "2.4.0";
}
