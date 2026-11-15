import 'package:flutter/material.dart';
import 'core/constants.dart';
import 'screens/student_parent_screen.dart';
import 'screens/teacher_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const EduSaaSApp());
}

class EduSaaSApp extends StatelessWidget {
  const EduSaaSApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConstants.appName,
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF4F46E5)),
        useMaterial3: true,
        fontFamily: 'Segoe UI',
      ),
      home: const RoleSelectorScreen(),
    );
  }
}

class RoleSelectorScreen extends StatelessWidget {
  const RoleSelectorScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(Icons.school, size: 72, color: Color(0xFF38BDF8)),
              const SizedBox(height: 16),
              const Text(
                'EduSaaS Mobile',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const Text(
                'Multi-School Management Ecosystem',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Color(0xFF94A3B8)),
              ),
              const SizedBox(height: 48),
              ElevatedButton.icon(
                icon: const Icon(Icons.family_restroom),
                label: const Text('Student & Parent Portal (Multi-Child)'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF4F46E5),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const StudentParentScreen()),
                  );
                },
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                icon: const Icon(Icons.co_present),
                label: const Text('Teacher & Faculty Portal'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF38BDF8),
                  side: const BorderSide(color: Color(0xFF38BDF8)),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const TeacherScreen()),
                  );
                },
              ),
              const SizedBox(height: 32),
              const Text(
                'Backend Connected: ' + AppConstants.baseUrl,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
