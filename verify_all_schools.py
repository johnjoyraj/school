import json

with open("school_seed.json", encoding="utf-8") as f:
    d = json.load(f)

for i in [1, 2, 3]:
    s = d["schools"][str(i)]
    stus = [st for st in d["students"].values() if st.get("school_id") == i]
    tchs = [tc for tc in d["teachers"].values() if tc.get("school_id") == i]
    classes = [c for c in d["classes"].values() if c.get("school_id") == i]
    fees = [fe for fe in d["fee_payments"].values() if fe.get("school_id") == i]
    print(f"School {i}: {s['name']} ({s['code']})")
    print(f"  - Principal: {s.get('admin_name', 'N/A')}")
    print(f"  - Classes: {len(classes)} ({[c['name'] + '-' + c['section'] for c in classes]})")
    print(f"  - Students: {len(stus)} ({[st['name'] for st in stus]})")
    print(f"  - Teachers: {len(tchs)} ({[tc['name'] for tc in tchs]})")
    print(f"  - Fees: {len(fees)}")
