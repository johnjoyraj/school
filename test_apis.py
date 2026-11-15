import urllib.request
import json
import time
import subprocess
import sys

print("Testing updated Multi-School SaaS Authentication, 3 Schools & 5 Plan Tiers...")

p = subprocess.Popen([sys.executable, "E:\\MYWORKSPACE\\school\\server.py"])
time.sleep(2)

try:
    with urllib.request.urlopen("http://localhost:8088/api/health", timeout=3) as res:
        data = json.loads(res.read().decode('utf-8'))
        print("✓ Health Check:", data)

    # 1. Test 5 Subscription Plans (200, 600, 1000, 2000, 5000 limits)
    with urllib.request.urlopen("http://localhost:8088/api/plans", timeout=3) as res:
        plans = json.loads(res.read().decode('utf-8'))
        print(f"✓ Subscription Plans ({len(plans)} tiers):")
        for pl in plans:
            print(f"   - {pl['name']} | Limit: {pl['student_limit']} students | ${pl['monthly_price']}/mo")
        assert len(plans) == 5, "Expected 5 plans"

    # 2. Test All 3 Schools Opening & Data
    with urllib.request.urlopen("http://localhost:8088/api/schools/list", timeout=3) as res:
        schools = json.loads(res.read().decode('utf-8'))
        print(f"✓ Active Schools ({len(schools)} schools):")
        for s in schools:
            print(f"   - ID {s['id']}: {s['name']} (Code: {s['code']}) | Plan Limit: {s['student_limit']}")
        assert len(schools) >= 3, "Expected at least 3 schools"

    for sch_id in [1, 2, 3]:
        with urllib.request.urlopen(f"http://localhost:8088/api/students?school_id={sch_id}", timeout=3) as r:
            stus = json.loads(r.read().decode('utf-8'))
            print(f"   ✓ School {sch_id} Students Count: {len(stus)} (First student: {stus[0]['name']})")
        with urllib.request.urlopen(f"http://localhost:8088/api/teachers?school_id={sch_id}", timeout=3) as r:
            tchs = json.loads(r.read().decode('utf-8'))
            print(f"   ✓ School {sch_id} Teachers Count: {len(tchs)} (First teacher: {tchs[0]['name']})")

    # 3. Test School Verification with School Code & Password
    verify_req = urllib.request.Request(
        "http://localhost:8088/api/auth/school-verify",
        data=json.dumps({"code": "SXIA", "password": "school123"}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(verify_req, timeout=3) as r:
        v_data = json.loads(r.read().decode('utf-8'))
        print(f"✓ School Code Verify (SXIA): {v_data['message']} (Capacity: {v_data['school']['student_limit']})")

    # 4. Test Role Logins (Principal, Teacher, Student)
    # Principal
    p_req = urllib.request.Request(
        "http://localhost:8088/api/auth/login",
        data=json.dumps({"school_id": 1, "role": "principal", "login_id": "PRIN-SXIA-01", "password": "admin123"}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(p_req, timeout=3) as r:
        p_res = json.loads(r.read().decode('utf-8'))
        print(f"✓ Principal Login: {p_res['message']} -> Redirect: {p_res['redirect']}")

    # Teacher
    t_req = urllib.request.Request(
        "http://localhost:8088/api/auth/login",
        data=json.dumps({"school_id": 2, "role": "teacher", "login_id": "TCH-APEX-01", "password": "teach123"}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(t_req, timeout=3) as r:
        t_res = json.loads(r.read().decode('utf-8'))
        print(f"✓ Teacher Login (School 2): {t_res['message']} -> Redirect: {t_res['redirect']}")

    # Student
    s_req = urllib.request.Request(
        "http://localhost:8088/api/auth/login",
        data=json.dumps({"school_id": 3, "role": "student", "login_id": "ADM-GMPS-01", "password": "student123"}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(s_req, timeout=3) as r:
        s_res = json.loads(r.read().decode('utf-8'))
        print(f"✓ Student Login (School 3): {s_res['message']} -> Redirect: {s_res['redirect']}")

    # 5. Test Apply for New School with Capacity Limit
    apply_req = urllib.request.Request(
        "http://localhost:8088/api/schools/apply",
        data=json.dumps({
            "name": "Oakridge International School",
            "code": "OIS",
            "password": "school123",
            "plan_id": "plan_600",
            "admin_name": "Dr. Catherine Howard",
            "admin_login_id": "PRIN-OIS-01",
            "admin_password": "admin123",
            "admin_email": "principal@oakridge.edu",
            "phone": "+1 (555) 333-8899",
            "address": "12 Ridge Way, Oak Valley"
        }).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(apply_req, timeout=3) as r:
        app_res = json.loads(r.read().decode('utf-8'))
        print(f"✓ Apply for New School (600 Limit): {app_res['message']}")

    print("\n🎉 ALL MULTI-SCHOOL AUTHENTICATION & CAPACITY TESTS PASSED SUCCESSFULLY!")

finally:
    p.terminate()
    p.wait()
    print("Test process terminated.")
