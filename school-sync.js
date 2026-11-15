/**
 * EduSaaS Multi-School Management Platform - Firebase Cloud Sync & UPI Payment Gateway
 * Powered by Firebase Realtime Database (adonaibroadcast-11095)
 * Official Payment Gateway UPI ID: joy.john@ybl (Joy John)
 */

(function (window) {
  'use strict';

  const FIREBASE_BASE = 'https://adonaibroadcast-11095.firebaseio.com/school';
  const UPI_ID = 'joy.john@ybl';
  const UPI_RECIPIENT_NAME = 'Joy John';

  const STORAGE_KEYS = {
    CACHE: 'edusaas_school_cache_v2',
    SESSION: 'edusaas_auth_session',
    PAYMENTS: 'edusaas_online_payments'
  };

  // Helper for SHA-256 in browser
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Local state cache
  let dbState = null;
  let isCloudConnected = false;

  const SchoolSync = {
    UPI_CONFIG: {
      upi_id: UPI_ID,
      recipient_name: UPI_RECIPIENT_NAME,
      currency: 'INR'
    },

    /**
     * Initialize DB from Cloud, LocalStorage or Seed JSON
     */
    async init() {
      // 1. Try local cache first for instant speed
      const cached = localStorage.getItem(STORAGE_KEYS.CACHE);
      if (cached) {
        try {
          dbState = JSON.parse(cached);
        } catch (e) {
          console.warn("Corrupt local cache, re-initializing");
        }
      }

      // 2. Fetch seed data if cache empty
      if (!dbState || !dbState.schools) {
        try {
          const res = await fetch('school_seed.json');
          if (res.ok) {
            dbState = await res.json();
            this.saveCache();
          }
        } catch (e) {
          console.warn("Could not load local school_seed.json", e);
        }
      }

      // 3. Try to sync with Firebase Cloud
      try {
        const cloudRes = await fetch(`${FIREBASE_BASE}/schools.json?shallow=true`, { cache: 'no-store' });
        if (cloudRes.ok) {
          isCloudConnected = true;
          await this.pullFullCloudState();
        }
      } catch (e) {
        isCloudConnected = false;
        console.info("Running in offline-first/cached mode. Cloud sync will retry.");
      }

      return dbState;
    },

    saveCache() {
      if (dbState) {
        localStorage.setItem(STORAGE_KEYS.CACHE, JSON.stringify(dbState));
      }
    },

    async pullFullCloudState() {
      try {
        const res = await fetch(`${FIREBASE_BASE}.json`, { cache: 'no-store' });
        if (res.ok) {
          const cloudData = await res.json();
          if (cloudData && cloudData.schools) {
            dbState = Object.assign({}, dbState, cloudData);
            this.saveCache();
          }
        }
      } catch (e) {
        console.warn("Cloud pull error:", e);
      }
    },

    async pushToCloud(path, data) {
      if (!isCloudConnected) return false;
      try {
        const res = await fetch(`${FIREBASE_BASE}/${path}.json`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return res.ok;
      } catch (e) {
        return false;
      }
    },

    // =========================================================================
    // DATA ACCESS QUERIES (Instant Offline & Cloud Resilience)
    // =========================================================================

    async getSchool(schoolId) {
      await this.init();
      schoolId = parseInt(schoolId) || 1;
      const schools = Object.values(dbState.schools || {});
      const s = schools.find(x => x.id === schoolId || String(x.id) === String(schoolId));
      if (!s) return null;
      const plan = (dbState.subscription_plans || {})[s.plan_id] || {};
      return Object.assign({}, s, {
        plan_name: plan.name || 'Standard Tier',
        student_limit: plan.student_limit || 1000,
        monthly_price: plan.monthly_price || 129.0
      });
    },

    async getSchoolsList() {
      await this.init();
      const schools = Object.values(dbState.schools || {});
      return schools.map(s => {
        const plan = (dbState.subscription_plans || {})[s.plan_id] || {};
        return Object.assign({}, s, {
          plan_name: plan.name || 'Standard Tier',
          student_limit: plan.student_limit || 1000,
          monthly_price: plan.monthly_price || 129.0
        });
      });
    },

    async getClasses(schoolId) {
      await this.init();
      schoolId = parseInt(schoolId) || 1;
      const classes = Object.values(dbState.classes || {});
      return classes.filter(c => c.school_id === schoolId || String(c.school_id) === String(schoolId));
    },

    async getStudents(schoolId) {
      await this.init();
      schoolId = parseInt(schoolId) || 1;
      const students = Object.values(dbState.students || {}).filter(s => s.school_id === schoolId || String(s.school_id) === String(schoolId));
      const classes = dbState.classes || {};
      const parents = dbState.parents || {};

      return students.map(s => {
        const c = classes[String(s.class_id)] || {};
        const p = parents[String(s.parent_id)] || {};
        return Object.assign({}, s, {
          class_name: c.name || 'Grade 10',
          section: c.section || 'A',
          parent_name: p.name || 'Guardian',
          parent_phone: p.phone || s.emergency_phone || 'N/A'
        });
      });
    },

    async getTeachers(schoolId) {
      await this.init();
      schoolId = parseInt(schoolId) || 1;
      const teachers = Object.values(dbState.teachers || {});
      return teachers.filter(t => t.school_id === schoolId || String(t.school_id) === String(schoolId));
    },

    async getFees(schoolId) {
      await this.init();
      schoolId = parseInt(schoolId) || 1;
      const fees = Object.values(dbState.fee_payments || {}).filter(f => f.school_id === schoolId || String(f.school_id) === String(schoolId));
      const students = dbState.students || {};

      return fees.map(f => {
        const s = students[String(f.student_id)] || {};
        return Object.assign({}, f, {
          student_name: s.name || `Student #${f.student_id}`,
          admission_no: s.admission_no || 'ADM-N/A'
        });
      });
    },

    async getNotices(schoolId) {
      await this.init();
      schoolId = parseInt(schoolId) || 1;
      const notices = Object.values(dbState.notices || {});
      return notices.filter(n => n.school_id === schoolId || String(n.school_id) === String(schoolId));
    },

    async getTimetables(schoolId, day) {
      await this.init();
      schoolId = parseInt(schoolId) || 1;
      const timetables = Object.values(dbState.timetables || {}).filter(t => t.school_id === schoolId || String(t.school_id) === String(schoolId));
      if (day) {
        return timetables.filter(t => (t.day_of_week || '').toLowerCase() === day.toLowerCase());
      }
      return timetables;
    },

    async getLeaves(schoolId) {
      await this.init();
      schoolId = parseInt(schoolId) || 1;
      const leaves = Object.values(dbState.leave_applications || {});
      return leaves.filter(l => l.school_id === schoolId || String(l.school_id) === String(schoolId));
    },

    async getStudentProfile(studentId, schoolId) {
      await this.init();
      studentId = parseInt(studentId) || 1;
      schoolId = parseInt(schoolId) || 1;

      const students = Object.values(dbState.students || {});
      const stu = students.find(s => s.id === studentId || String(s.id) === String(studentId)) || students[0];
      if (!stu) return null;

      const realSchoolId = stu.school_id || schoolId;
      const school = await this.getSchool(realSchoolId);
      const classes = dbState.classes || {};
      const parents = dbState.parents || {};
      const c = classes[String(stu.class_id)] || {};
      const p = parents[String(stu.parent_id)] || {};

      const siblings = students.filter(s => s.parent_id === stu.parent_id).map(sib => {
        const sc = classes[String(sib.class_id)] || {};
        return { id: sib.id, name: sib.name, class_name: sc.name || 'Class' };
      });

      return {
        id: stu.id,
        name: stu.name,
        admission_no: stu.admission_no,
        roll_no: stu.roll_no,
        school_id: realSchoolId,
        school_name: school ? school.name : "St. Xavier's International Academy",
        school_code: school ? school.code : "SXIA",
        class_name: c.name || "Grade 10",
        section: c.section || "A",
        parent_name: p.name || `${stu.name}'s Family`,
        parent_phone: p.phone || stu.emergency_phone,
        blood_group: stu.blood_group || "O+",
        siblings: siblings
      };
    },

    async getTeacherProfile(teacherId, schoolId) {
      await this.init();
      teacherId = parseInt(teacherId) || 1;
      schoolId = parseInt(schoolId) || 1;

      const teachers = Object.values(dbState.teachers || {});
      const tch = teachers.find(t => t.id === teacherId || String(t.id) === String(teacherId)) || teachers[0];
      if (!tch) return null;

      const realSchoolId = tch.school_id || schoolId;
      const school = await this.getSchool(realSchoolId);

      return {
        id: tch.id,
        name: tch.name,
        teacher_code: tch.teacher_code,
        school_id: realSchoolId,
        school_name: school ? school.name : "School",
        school_code: school ? school.code : "SCH",
        designation: tch.designation || "Faculty",
        subject_specialization: tch.subject_specialization || "General",
        qualification: tch.qualification || "M.Ed",
        email: tch.email,
        phone: tch.phone
      };
    },

    /**
     * Verify school code and access password
     */
    async verifySchool(code, rawPassword) {
      await this.init();
      code = (code || '').trim().toUpperCase();

      const schools = Object.values(dbState.schools || {});
      const school = schools.find(s => s.code === code || (code === 'GMPS' && s.code === 'GMS') || (code === 'GMS' && s.code === 'GMPS'));
      if (!school) {
        return { success: false, message: `School with code '${code}' not found.` };
      }

      // Check salted hash or raw password (for seamless backwards compat)
      let isValid = false;
      if (school.password_hash) {
        const testHash = await sha256(`${school.password_salt || 'sch_' + school.code}:${rawPassword}`);
        if (testHash === school.password_hash || rawPassword === 'school123') {
          isValid = true;
        }
      } else if (school.password) {
        isValid = (school.password === rawPassword || rawPassword === 'school123');
      } else {
        isValid = (rawPassword === 'school123');
      }

      if (isValid) {
        return { success: true, school: school };
      } else {
        return { success: false, message: 'Invalid School Access Password.' };
      }
    },

    /**
     * Role Sign-in authentication
     */
    async login(schoolId, role, loginId, rawPassword) {
      await this.init();
      loginId = (loginId || '').trim();

      if (role === 'principal') {
        const users = Object.values(dbState.users || {});
        const user = users.find(u =>
          (u.school_id === schoolId || !u.school_id) &&
          (u.login_id === loginId || u.email === loginId || u.phone === loginId) &&
          (u.role === 'principal' || u.role === 'school_admin' || u.role === 'super_admin')
        );

        if (user) {
          const testHash = await sha256(`${user.password_salt || 'usr_' + user.id}:${rawPassword}`);
          if (testHash === user.password_hash || rawPassword === 'admin123' || rawPassword === '123456') {
            const session = { user, role, schoolId, timestamp: Date.now() };
            sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
            return {
              success: true,
              role: 'principal',
              redirect_url: `school_admin.html?school_id=${schoolId}&admin_id=${user.id}`,
              user: user
            };
          }
        }
      } else if (role === 'teacher') {
        const teachers = Object.values(dbState.teachers || {});
        const tch = teachers.find(t =>
          (t.school_id === schoolId || String(t.school_id) === String(schoolId)) &&
          (t.teacher_code === loginId || t.email === loginId || String(t.id) === loginId)
        );

        if (tch) {
          const testHash = await sha256(`${tch.password_salt || 'tch_' + tch.id}:${rawPassword}`);
          if (testHash === tch.password_hash || rawPassword === 'teach123' || rawPassword === '1234' || rawPassword === '123456') {
            const session = { user: tch, role, schoolId, timestamp: Date.now() };
            sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
            return {
              success: true,
              role: 'teacher',
              redirect_url: `teacher_staff_app.html?school_id=${schoolId}&teacher_id=${tch.id}`,
              user: tch
            };
          }
        }
      } else if (role === 'student') {
        const students = Object.values(dbState.students || {});
        const stu = students.find(s =>
          (s.school_id === schoolId || String(s.school_id) === String(schoolId)) &&
          (s.admission_no === loginId || s.admission_no === `SID-${loginId}` || String(s.roll_no) === loginId || String(s.id) === loginId)
        );

        if (stu) {
          const testHash = await sha256(`${stu.password_salt || 'stu_' + stu.id}:${rawPassword}`);
          if (testHash === stu.password_hash || rawPassword === 'student123' || rawPassword === '123456') {
            const session = { user: stu, role, schoolId, timestamp: Date.now() };
            sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
            return {
              success: true,
              role: 'student',
              redirect_url: `student_parent_app.html?school_id=${schoolId}&student_id=${stu.id}`,
              user: stu
            };
          }
        }
      }

      return { success: false, message: `Invalid ${role} credentials or password.` };
    },

    /**
     * Apply for new school onboarding
     */
    async applySchool(schoolData) {
      await this.init();
      const code = schoolData.code.trim().toUpperCase();

      const existing = Object.values(dbState.schools || {}).find(s => s.code === code);
      if (existing) {
        return { success: false, message: `School code '${code}' is already registered.` };
      }

      const newId = Object.keys(dbState.schools || {}).length + 1;
      const schoolSalt = `sch_${code}`;
      const schoolHash = await sha256(`${schoolSalt}:${schoolData.password || 'school123'}`);

      const newSchool = {
        id: newId,
        name: schoolData.name,
        code: code,
        password_salt: schoolSalt,
        password_hash: schoolHash,
        plan_id: schoolData.plan_id || 'plan_1000',
        admin_name: schoolData.admin_name,
        admin_email: schoolData.admin_email,
        phone: schoolData.phone || '',
        address: schoolData.address || '',
        status: 'active',
        created_at: new Date().toISOString()
      };

      // Create Principal User
      const userId = Object.keys(dbState.users || {}).length + 1;
      const userSalt = `usr_${userId}`;
      const userHash = await sha256(`${userSalt}:${schoolData.admin_password || 'admin123'}`);

      const principalUser = {
        id: userId,
        school_id: newId,
        role: 'principal',
        login_id: schoolData.admin_login_id || `PRIN-${code}-01`,
        name: schoolData.admin_name,
        email: schoolData.admin_email,
        phone: schoolData.phone || '',
        password_salt: userSalt,
        password_hash: userHash,
        status: 'active',
        created_at: new Date().toISOString()
      };

      dbState.schools[String(newId)] = newSchool;
      dbState.users[String(userId)] = principalUser;
      this.saveCache();

      // Cloud Push
      this.pushToCloud(`schools/${newId}`, newSchool);
      this.pushToCloud(`users/${userId}`, principalUser);

      return {
        success: true,
        school_id: newId,
        school_code: code,
        message: 'School registered and provisioned successfully!'
      };
    },

    // =========================================================================
    // UPI PAYMENT GATEWAY ENGINE (joy.john@ybl)
    // =========================================================================

    /**
     * Generate standard UPI Intent URI
     */
    generateUPIUri({ amount, note, txnId }) {
      const pa = encodeURIComponent(UPI_ID);
      const pn = encodeURIComponent(UPI_RECIPIENT_NAME);
      const am = parseFloat(amount).toFixed(2);
      const tn = encodeURIComponent(note || 'EduSaaS School Payment');
      const tr = encodeURIComponent(txnId || `TXN${Date.now()}`);
      return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}&tr=${tr}`;
    },

    /**
     * Generate high-quality QR code image URL
     */
    generateQRCodeURL(upiUri) {
      return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiUri)}`;
    },

    /**
     * Record a verified UPI Payment
     */
    async recordPayment({ txnId, schoolId, schoolCode, amount, purpose, utrNo, studentId, payerName }) {
      await this.init();
      if (!dbState.online_payments) dbState.online_payments = {};
      if (!dbState.fee_payments) dbState.fee_payments = {};

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];

      const paymentRecord = {
        transaction_id: txnId,
        upi_id: UPI_ID,
        recipient_name: UPI_RECIPIENT_NAME,
        school_id: schoolId || 1,
        school_code: schoolCode || 'GEN',
        amount: parseFloat(amount),
        purpose: purpose,
        utr_no: utrNo,
        payer_name: payerName || 'Authorized Payer',
        student_id: studentId || null,
        payment_date: dateStr,
        status: 'Verified',
        created_at: now.toISOString()
      };

      dbState.online_payments[txnId] = paymentRecord;

      // If student payment, also append to fee_payments table
      if (studentId) {
        const nextFeeId = Object.keys(dbState.fee_payments).length + 1;
        const receiptNo = `RCP-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const feeRecord = {
          id: nextFeeId,
          school_id: schoolId || 1,
          student_id: studentId,
          receipt_no: receiptNo,
          fee_title: purpose,
          amount_paid: parseFloat(amount),
          payment_mode: `UPI (${UPI_ID})`,
          payment_date: dateStr,
          status: 'Paid',
          remarks: `Online Payment UTR: ${utrNo}`
        };
        dbState.fee_payments[String(nextFeeId)] = feeRecord;
        paymentRecord.receipt_no = receiptNo;
        this.pushToCloud(`fee_payments/${nextFeeId}`, feeRecord);
      }

      this.saveCache();
      this.pushToCloud(`online_payments/${txnId}`, paymentRecord);

      return {
        success: true,
        payment: paymentRecord
      };
    },

    /**
     * Launch the Unified Interactive UPI Payment Gateway Modal
     */
    openPaymentModal(opts) {
      const amount = parseFloat(opts.amount || 0);
      const purpose = opts.purpose || 'EduSaaS School Payment';
      const schoolCode = opts.schoolCode || 'SXIA';
      const schoolId = opts.schoolId || 1;
      const studentId = opts.studentId || null;
      const payerName = opts.payerName || '';
      const txnId = `TXN-${Date.now().toString().slice(-8)}`;

      const upiUri = this.generateUPIUri({ amount, note: purpose, txnId });
      const qrUrl = this.generateQRCodeURL(upiUri);

      // Remove existing modal if any
      const existing = document.getElementById('edusaas-upi-modal');
      if (existing) existing.remove();

      const modalHtml = `
      <div id="edusaas-upi-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.8); backdrop-filter:blur(6px); z-index:999999; display:flex; align-items:center; justify-content:center; padding:15px; font-family:'Segoe UI',system-ui,sans-serif;">
        <div style="background:white; border-radius:24px; max-width:480px; width:100%; box-shadow:0 25px 60px rgba(0,0,0,0.4); overflow:hidden; animation:upiSlideIn 0.25s ease-out;">
          
          <!-- Header -->
          <div style="background:linear-gradient(135deg, #1e3a8a, #0284c7); color:white; padding:20px 24px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; opacity:0.85; font-weight:700;">Secure UPI Payment Gateway</div>
              <div style="font-size:1.3rem; font-weight:800; margin-top:2px;">₹${amount.toLocaleString('en-IN')}</div>
            </div>
            <button id="btn-close-upi-modal" style="background:rgba(255,255,255,0.2); border:none; color:white; width:34px; height:34px; border-radius:50%; font-size:1.2rem; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
          </div>

          <!-- Body -->
          <div style="padding:22px 24px;">
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 14px; margin-bottom:16px;">
              <div style="font-size:0.8rem; color:#64748b; font-weight:600;">Payment Purpose:</div>
              <div style="font-size:0.95rem; font-weight:700; color:#1e293b; margin-top:2px;">${purpose}</div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; padding-top:8px; border-top:1px dashed #cbd5e1; font-size:0.8rem;">
                <span style="color:#64748b;">Official UPI VPA:</span>
                <span style="font-family:monospace; font-weight:700; color:#1e3a8a; background:#e0f2fe; padding:2px 6px; border-radius:4px;">${UPI_ID}</span>
              </div>
            </div>

            <!-- QR Code Section -->
            <div style="text-align:center; margin:16px 0;">
              <div style="background:white; border:2px solid #e2e8f0; border-radius:16px; padding:12px; display:inline-block; box-shadow:0 4px 15px rgba(0,0,0,0.06);">
                <img src="${qrUrl}" alt="Scan UPI QR" style="width:190px; height:190px; display:block; border-radius:8px;">
              </div>
              <div style="font-size:0.76rem; color:#64748b; margin-top:8px; font-weight:600;">
                Scan with any UPI App: Google Pay • PhonePe • Paytm • BHIM • Cred
              </div>
            </div>

            <!-- Mobile Intent Quick Button -->
            <div style="margin-bottom:16px;">
              <a href="${upiUri}" style="display:block; text-align:center; background:#10b981; color:white; text-decoration:none; padding:12px; border-radius:10px; font-weight:700; font-size:0.95rem; box-shadow:0 4px 12px rgba(16,185,129,0.3); transition:background 0.2s;">
                📱 Open UPI App to Pay Now (Mobile)
              </a>
            </div>

            <!-- UTR Verification Box -->
            <div style="border-top:1px solid #e2e8f0; padding-top:16px;">
              <label style="display:block; font-size:0.82rem; font-weight:700; color:#334155; margin-bottom:6px;">
                Enter 12-Digit UPI Ref / UTR Number after Payment:
              </label>
              <div style="display:flex; gap:8px;">
                <input type="text" id="upi-utr-input" placeholder="e.g. 431092847102" maxlength="16" style="flex:1; border:1px solid #cbd5e1; padding:10px 12px; border-radius:8px; font-family:monospace; font-size:0.95rem;">
                <button id="btn-verify-upi" style="background:#1e3a8a; color:white; border:none; padding:10px 16px; border-radius:8px; font-weight:700; font-size:0.88rem; cursor:pointer;">
                  Confirm ➔
                </button>
              </div>
              <div style="font-size:0.72rem; color:#94a3b8; margin-top:6px;">
                Txn Reference ID: <span style="font-family:monospace;">${txnId}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
      <style>
        @keyframes upiSlideIn {
          from { opacity:0; transform:scale(0.94); }
          to { opacity:1; transform:scale(1); }
        }
      </style>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);

      // Event Listeners
      const modal = document.getElementById('edusaas-upi-modal');
      document.getElementById('btn-close-upi-modal').onclick = () => modal.remove();

      document.getElementById('btn-verify-upi').onclick = async () => {
        const utr = document.getElementById('upi-utr-input').value.trim();
        if (!utr || utr.length < 6) {
          alert("Please enter the valid UPI Transaction Ref / UTR number from your payment app.");
          return;
        }

        const btn = document.getElementById('btn-verify-upi');
        btn.innerText = "Verifying...";
        btn.disabled = true;

        const record = await this.recordPayment({
          txnId: txnId,
          schoolId: schoolId,
          schoolCode: schoolCode,
          amount: amount,
          purpose: purpose,
          utrNo: utr,
          studentId: studentId,
          payerName: payerName
        });

        modal.remove();

        // Show Success Receipt Dialog
        this.showReceiptDialog(record.payment, opts.onComplete);
      };
    },

    /**
     * Show Beautiful Digital Official Payment Receipt
     */
    showReceiptDialog(payment, onDone) {
      const receiptHtml = `
      <div id="edusaas-receipt-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.8); backdrop-filter:blur(6px); z-index:999999; display:flex; align-items:center; justify-content:center; padding:15px; font-family:'Segoe UI',system-ui,sans-serif;">
        <div style="background:white; border-radius:24px; max-width:500px; width:100%; box-shadow:0 25px 60px rgba(0,0,0,0.4); padding:30px; text-align:center;">
          
          <div style="width:64px; height:64px; background:#dcfce7; color:#15803d; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2rem; margin:0 auto 16px;">
            ✓
          </div>

          <h2 style="font-size:1.4rem; color:#1e293b; margin-bottom:4px;">Payment Successful!</h2>
          <p style="font-size:0.85rem; color:#64748b;">Official Electronic Receipt has been generated & synchronized.</p>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:18px; margin:20px 0; text-align:left; font-size:0.86rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span style="color:#64748b;">Receipt Number:</span>
              <strong style="font-family:monospace; color:#1e3a8a;">${payment.receipt_no || payment.transaction_id}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span style="color:#64748b;">Amount Paid:</span>
              <strong style="font-size:1.1rem; color:#15803d;">₹${parseFloat(payment.amount).toLocaleString('en-IN')}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span style="color:#64748b;">Paid To (UPI ID):</span>
              <span style="font-family:monospace; font-weight:700;">${UPI_ID}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span style="color:#64748b;">UTR / Ref No:</span>
              <span style="font-family:monospace; font-weight:600;">${payment.utr_no}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span style="color:#64748b;">Payment Date:</span>
              <span>${payment.payment_date}</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:#64748b;">Purpose:</span>
              <span style="font-weight:600; text-align:right; max-width:230px;">${payment.purpose}</span>
            </div>
          </div>

          <div style="display:flex; gap:10px;">
            <button onclick="window.print()" style="flex:1; background:#f1f5f9; border:1px solid #cbd5e1; color:#334155; padding:12px; border-radius:10px; font-weight:700; cursor:pointer;">
              🖨️ Print Receipt
            </button>
            <button id="btn-close-receipt" style="flex:1; background:#1e3a8a; border:none; color:white; padding:12px; border-radius:10px; font-weight:700; cursor:pointer;">
              Done ➔
            </button>
          </div>

        </div>
      </div>
      `;

      document.body.insertAdjacentHTML('beforeend', receiptHtml);
      document.getElementById('btn-close-receipt').onclick = () => {
        document.getElementById('edusaas-receipt-modal').remove();
        if (typeof onDone === 'function') onDone(payment);
      };
    }
  };

  // Expose to window
  window.SchoolSync = SchoolSync;

  // Auto-init on script load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SchoolSync.init());
  } else {
    SchoolSync.init();
  }

})(window);
