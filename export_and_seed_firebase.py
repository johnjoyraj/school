import sqlite3
import json
import hashlib
import os
import datetime

DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(DIRECTORY, "school_database.db")
SEED_FILE = os.path.join(DIRECTORY, "school_seed.json")

def hash_password(password, salt=None):
    if not salt:
        salt = hashlib.sha256(os.urandom(16)).hexdigest()[:16]
    pwd_hash = hashlib.sha256(f"{salt}:{password}".encode('utf-8')).hexdigest()
    return salt, pwd_hash

def export_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    c.execute("SELECT name FROM sqlite_master WHERE type='table'")
    existing_tables = [r[0] for r in c.fetchall()]
    print("Found tables in DB:", existing_tables)

    data = {
        "metadata": {
            "title": "EduSaaS Multi-School Management SaaS",
            "version": "2.0.0",
            "upi_gateway": {
                "upi_id": "joy.john@ybl",
                "recipient_name": "Joy John",
                "merchant_name": "EduSaaS Multi-School Management",
                "currency": "INR",
                "status": "active"
            },
            "exported_at": datetime.datetime.now().isoformat()
        }
    }

    for table in existing_tables:
        data[table] = {}
        c.execute(f"SELECT * FROM {table}")
        rows = c.fetchall()
        for idx, row in enumerate(rows):
            d = dict(row)
            key = str(d.get("id", idx + 1))
            
            # Secure passwords
            if table == "schools" and "password" in d:
                salt, p_hash = hash_password(d.get("password") or "school123", salt=f"sch_{d['code']}")
                d["password_salt"] = salt
                d["password_hash"] = p_hash
                del d["password"]
            elif table == "users" and "password_hash" in d:
                raw_pwd = d.get("password_hash") or "123456"
                salt, p_hash = hash_password(raw_pwd, salt=f"usr_{d['id']}")
                d["password_salt"] = salt
                d["password_hash"] = p_hash
            elif table == "students" and "password" in d:
                raw_pwd = d.get("password") or "student123"
                salt, p_hash = hash_password(raw_pwd, salt=f"stu_{d['id']}")
                d["password_salt"] = salt
                d["password_hash"] = p_hash
                del d["password"]
            elif table == "teachers" and "password" in d:
                raw_pwd = d.get("password") or "teach123"
                salt, p_hash = hash_password(raw_pwd, salt=f"tch_{d['id']}")
                d["password_salt"] = salt
                d["password_hash"] = p_hash
                del d["password"]

            data[table][key] = d

    # Online Payments table
    data["online_payments"] = {
        "TXN-INIT-001": {
            "transaction_id": "TXN-INIT-001",
            "upi_id": "joy.john@ybl",
            "recipient_name": "Joy John",
            "school_id": 1,
            "school_code": "SXIA",
            "amount": 249.00,
            "purpose": "Premier Campus Subscription Plan (plan_1000)",
            "utr_no": "UPI982348102931",
            "payment_date": datetime.date.today().strftime("%Y-%m-%d"),
            "status": "Verified",
            "created_at": datetime.datetime.now().isoformat()
        }
    }

    with open(SEED_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print(f"Successfully exported and encrypted database to {SEED_FILE}")
    for table in existing_tables:
        print(f"  - {table}: {len(data[table])} items")

if __name__ == "__main__":
    export_db()
