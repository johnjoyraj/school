import urllib.request
import json
import sys

FIREBASE_URL = "https://adonaibroadcast-11095.firebaseio.com"

print("=" * 70)
print("  Firebase Security & Architecture Audit for 'adonaibroadcast-11095'")
print("  Target Scope: Multi-School SaaS Platform & Unified Ecosystem")
print("=" * 70)

# Test 1: Check Root Read Access (/.json)
print("\n[Test 1] Checking Root Read Access (/.json)...")
root_read_insecure = False
try:
    req = urllib.request.Request(f"{FIREBASE_URL}/.json?shallow=true", headers={'User-Agent': 'SecurityAudit/1.0'})
    res = urllib.request.urlopen(req)
    data = res.read().decode('utf-8')
    print("  ❌ INSECURE: Root is publicly readable without authentication!")
    root_read_insecure = True
except urllib.error.HTTPError as e:
    if e.code in (401, 403):
        print("  ✅ SECURE: Root read is properly blocked (HTTP 401 Permission Denied)!")
    else:
        print(f"  ⚠️ HTTP {e.code}: {e.reason}")
except Exception as e:
    print(f"  ⚠️ Error: {e}")

# Test 2: Check Root Write Access (/test_root_exploit.json)
print("\n[Test 2] Checking Root Write Access (/test_root_exploit.json)...")
root_write_insecure = False
try:
    req = urllib.request.Request(
        f"{FIREBASE_URL}/test_root_exploit.json",
        data=b'{"test": 1}',
        headers={'Content-Type': 'application/json'},
        method='PUT'
    )
    res = urllib.request.urlopen(req)
    print("  ❌ INSECURE: Root is publicly writable without authentication! Anyone can wipe data.")
    req_del = urllib.request.Request(f"{FIREBASE_URL}/test_root_exploit.json", method='DELETE')
    urllib.request.urlopen(req_del)
    root_write_insecure = True
except urllib.error.HTTPError as e:
    if e.code in (401, 403):
        print("  ✅ SECURE: Root write is properly blocked (HTTP 401 Permission Denied)!")
    else:
        print(f"  ⚠️ HTTP {e.code}: {e.reason}")
except Exception as e:
    print(f"  ⚠️ Error: {e}")

# Test 3: Check School Path (/school/schools.json)
print("\n[Test 3] Checking School Directory Path (/school/schools.json)...")
try:
    req = urllib.request.Request(f"{FIREBASE_URL}/school/schools.json?shallow=true")
    res = urllib.request.urlopen(req)
    print("  ✅ OPERATIONAL: /school/schools is accessible for tenant resolution.")
except urllib.error.HTTPError as e:
    if e.code in (401, 403):
        print("  ℹ️ PENDING RULES PUBLISH: /school rules have not been published in Firebase Console yet.")
        print("     Paste database.rules.json into Firebase Console to unlock.")
    else:
        print(f"  ⚠️ HTTP {e.code}: {e.reason}")
except Exception as e:
    print(f"  ⚠️ Error: {e}")

# Test 4: Check User Credentials Protection (/school/users.json)
print("\n[Test 4] Checking User Passwords Protection (/school/users.json)...")
try:
    req = urllib.request.Request(f"{FIREBASE_URL}/school/users.json?shallow=true")
    res = urllib.request.urlopen(req)
    print("  ⚠️ NOTE: Full users list readable - individual login lookup should be used.")
except urllib.error.HTTPError as e:
    if e.code in (401, 403):
        print("  ✅ SECURE: Bulk /school/users dump is blocked from public scraping.")
except Exception as e:
    print(f"  ⚠️ Error: {e}")

# Test 5: Check Online Payments Node (/school/online_payments.json)
print("\n[Test 5] Checking UPI Online Payments Node (/school/online_payments.json)...")
try:
    req = urllib.request.Request(f"{FIREBASE_URL}/school/online_payments.json?shallow=true")
    res = urllib.request.urlopen(req)
    print("  ✅ OPERATIONAL: Online payment ledger for UPI ID 'joy.john@ybl' is connected.")
except urllib.error.HTTPError as e:
    if e.code in (401, 403):
        print("  ℹ️ PENDING RULES PUBLISH: Ready to activate once rules are published.")
except Exception as e:
    print(f"  ⚠️ Error: {e}")

print("\n" + "=" * 70)
print("Firebase Console Rules Editor URL:")
print("https://console.firebase.google.com/project/adonaibroadcast-11095/database/adonaibroadcast-11095/rules")
print("=" * 70)
