import 'package:flutter/material.dart';
import '../core/constants.dart';

class TeacherScreen extends StatefulWidget {
  const TeacherScreen({super.key});

  @override
  State<TeacherScreen> createState() => _TeacherScreenState();
}

class _TeacherScreenState extends State<TeacherScreen> {
  final List<Map<String, dynamic>> _students = [
    {'id': 1, 'name': 'Aarav Sharma', 'roll': 101, 'status': 'P'},
    {'id': 3, 'name': 'David Peterson', 'roll': 102, 'status': 'P'},
    {'id': 4, 'name': 'Diya Nair', 'roll': 103, 'status': 'P'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F766E),
        foregroundColor: Colors.white,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Faculty Portal", style: TextStyle(fontSize: 14)),
            Text("Prof. Marcus Brody", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("1-Tap Attendance: Grade 10-A", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  ..._students.map((st) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 6.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(st['name'], style: const TextStyle(fontWeight: FontWeight.bold)),
                              Text("Roll #${st['roll']}", style: const TextStyle(fontSize: 12, color: Colors.grey)),
                            ],
                          ),
                          Row(
                            children: ['P', 'A', 'L'].map((code) {
                              final isSelected = st['status'] == code;
                              Color activeColor = code == 'P' ? Colors.green : (code == 'A' ? Colors.red : Colors.orange);
                              return Padding(
                                padding: const EdgeInsets.only(left: 4.0),
                                child: InkWell(
                                  onTap: () => setState(() => st['status'] = code),
                                  child: Container(
                                    width: 32,
                                    height: 32,
                                    alignment: Alignment.center,
                                    decoration: BoxDecoration(
                                      color: isSelected ? activeColor : Colors.grey[200],
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      code,
                                      style: TextStyle(
                                        color: isSelected ? Colors.white : Colors.black87,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ),
                              );
                            }).toList(),
                          )
                        ],
                      ),
                    );
                  }),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0F766E),
                      foregroundColor: Colors.white,
                      minimumSize: const Size.fromHeight(44),
                    ),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Attendance saved and synced to cloud!")),
                      );
                    },
                    child: const Text("Save & Dispatch Notifications"),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
