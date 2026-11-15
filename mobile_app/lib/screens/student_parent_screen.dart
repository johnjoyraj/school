import 'package:flutter/material.dart';
import '../core/constants.dart';

class StudentParentScreen extends StatefulWidget {
  const StudentParentScreen({super.key});

  @override
  State<StudentParentScreen> createState() => _StudentParentScreenState();
}

class _StudentParentScreenState extends State<StudentParentScreen> {
  int _activeChildId = 1;
  int _selectedBottomIndex = 0;

  final List<Map<String, dynamic>> _children = [
    {
      'id': 1,
      'name': 'Aarav Sharma',
      'class': 'Grade 10 - Section A',
      'roll': 101,
      'adm': 'ADM-2024-001',
      'attendance': '95.0%',
      'gpa': '3.92',
      'blood': 'B+',
    },
    {
      'id': 2,
      'name': 'Ananya Sharma',
      'class': 'Grade 6 - Section A',
      'roll': 204,
      'adm': 'ADM-2024-002',
      'attendance': '98.5%',
      'gpa': '4.00',
      'blood': 'B+',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final activeChild = _children.firstWhere((c) => c['id'] == _activeChildId);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF4F46E5),
        foregroundColor: Colors.white,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("St. Xavier's Academy", style: TextStyle(fontSize: 14, fontWeight: FontWeight.normal)),
            Text(activeChild['name'], style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(56),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: const Color(0xFF3730A3),
            child: Row(
              children: [
                const Text("Child:", style: TextStyle(color: Colors.white70, fontSize: 13)),
                const SizedBox(width: 8),
                Wrap(
                  spacing: 8,
                  children: _children.map((child) {
                    final isSelected = child['id'] == _activeChildId;
                    return ChoiceChip(
                      label: Text(child['name']),
                      selected: isSelected,
                      selectedColor: Colors.white,
                      labelStyle: TextStyle(
                        color: isSelected ? const Color(0xFF4F46E5) : Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                      backgroundColor: Colors.white24,
                      onSelected: (val) {
                        setState(() => _activeChildId = child['id']);
                      },
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ),
      ),
      body: _buildBody(activeChild),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedBottomIndex,
        onDestinationSelected: (idx) => setState(() => _selectedBottomIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.menu_book), label: 'Academic'),
          NavigationDestination(icon: Icon(Icons.assignment), label: 'Tasks'),
          NavigationDestination(icon: Icon(Icons.directions_bus), label: 'Transport'),
        ],
      ),
    );
  }

  Widget _buildBody(Map<String, dynamic> child) {
    if (_selectedBottomIndex == 0) {
      return ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: const Color(0xFFE0E7FF),
                    child: Text(child['name'][0], style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF4F46E5))),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(child['name'], style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        Text(child['class'], style: const TextStyle(color: Colors.grey)),
                        Text("Roll #${child['roll']} • ${child['adm']}", style: const TextStyle(fontSize: 12, color: Color(0xFF0284C7))),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        Text(child['attendance'], style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF10B981))),
                        const Text("Attendance Rate", style: TextStyle(fontSize: 11, color: Colors.grey)),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        Text(child['gpa'], style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF4F46E5))),
                        const Text("Term GPA", style: TextStyle(fontSize: 11, color: Colors.grey)),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text("Live Announcements", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          const Card(
            child: ListTile(
              leading: Icon(Icons.campaign, color: Color(0xFFEF4444)),
              title: Text("Annual STEM Innovation Expo 2026"),
              subtitle: Text("Registration deadline: this Friday at Academic Office."),
            ),
          ),
        ],
      );
    } else if (_selectedBottomIndex == 1) {
      return ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Text("Academic Hub & Syllabus", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          SizedBox(height: 12),
          Card(
            child: ListTile(
              leading: Icon(Icons.calculate, color: Color(0xFF4F46E5)),
              title: Text("Advanced Mathematics"),
              subtitle: Text("Prof. Marcus Brody • 3 Chapters Complete"),
              trailing: Icon(Icons.arrow_forward_ios, size: 14),
            ),
          ),
          Card(
            child: ListTile(
              leading: Icon(Icons.science, color: Color(0xFF06B6D4)),
              title: Text("Physical Sciences"),
              subtitle: Text("Dr. Sarah Connor • 2 Chapters Complete"),
              trailing: Icon(Icons.arrow_forward_ios, size: 14),
            ),
          ),
        ],
      );
    } else {
      return const Center(child: Text("Connected to EduSaaS Cloud"));
    }
  }
}
