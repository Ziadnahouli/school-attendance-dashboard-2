const firebaseConfig = { apiKey: "AIzaSyBX3-pcg4gCUzHdPuRhP9BPTKbJr4zM2Mc", authDomain: "school-attendance-81385.firebaseapp.com", projectId: "school-attendance-81385", storageBucket: "school-attendance-81385.firebasestorage.app", messagingSenderId: "232756214397", appId: "1:232756214397:web:67de1961741864be744f14" };

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let allClasses = [];

auth.onAuthStateChanged(async (user) => {
    if (!user) { window.location.href = "teacher_login.html"; return; }
    const teacherDocRef = db.collection("teachers").doc(user.uid);
    const teacherDocSnap = await teacherDocRef.get();
    if (!teacherDocSnap.exists) {
        alert("Access Denied: You do not have a teacher account.");
        await auth.signOut();
        window.location.href = "teacher_login.html";
        return;
    }
    document.body.style.display = "flex";
    document.getElementById("teacherName").innerText = user.email.split('@')[0];
    document.getElementById("currentDate").innerText = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    fetchClasses();
});

async function fetchClasses() {
    const divisionDropdown = document.getElementById('division');
    divisionDropdown.innerHTML = '<option value="" disabled selected>Loading divisions...</option>';
    divisionDropdown.disabled = true;

    try {
        const response = await fetch('https://ziad-school-app.onrender.com/classes');
        if (!response.ok) throw new Error('Could not fetch class list');
        allClasses = await response.json();

        divisionDropdown.innerHTML = '<option value="" disabled selected>-- Select a Division --</option>';
        const divisions = [...new Set(allClasses.map(c => c.division))];
        divisions.sort().forEach(div => {
            const option = document.createElement('option');
            option.value = div;
            option.textContent = div;
            divisionDropdown.appendChild(option);
        });
        divisionDropdown.disabled = false;
    } catch (error) {
        console.error("Error fetching classes:", error);
        divisionDropdown.innerHTML = '<option value="" disabled selected>Error loading divisions</option>';
        alert("Could not load class list from server.");
    }
}

document.getElementById('division').addEventListener('change', (event) => {
    const selectedDivision = event.target.value;
    const classDropdown = document.getElementById('className');
    const sectionDropdown = document.getElementById('section');
    classDropdown.innerHTML = '<option value="">-- Select a Class --</option>';
    sectionDropdown.innerHTML = '<option value="">-- First Select a Class --</option>';
    sectionDropdown.disabled = true;
    const classesInDivision = [...new Set(allClasses.filter(c => c.division === selectedDivision).map(c => c.name))];
    if (classesInDivision.length > 0) {
        classesInDivision.sort().forEach(className => {
            const option = document.createElement('option');
            option.value = className;
            option.textContent = className;
            classDropdown.appendChild(option);
        });
        classDropdown.disabled = false;
    } else {
        classDropdown.disabled = true;
    }
});

document.getElementById('className').addEventListener('change', (event) => {
    const selectedDivision = document.getElementById('division').value;
    const selectedClass = event.target.value;
    const sectionDropdown = document.getElementById('section');
    sectionDropdown.innerHTML = '<option value="">-- Select a Section --</option>';
    const sectionsForClass = allClasses.filter(c => c.division === selectedDivision && c.name === selectedClass).map(c => c.section);
    if (sectionsForClass.length > 0) {
        sectionsForClass.sort().forEach(sectionName => {
            const option = document.createElement('option');
            option.value = sectionName;
            option.textContent = sectionName;
            sectionDropdown.appendChild(option);
        });
        sectionDropdown.disabled = false;
    } else {
        sectionDropdown.disabled = true;
    }
});

async function submitAbsence() {
    const division = document.getElementById("division").value;
    const className = document.getElementById("className").value;
    const section = document.getElementById("section").value;
    const chips = Array.from(document.querySelectorAll('#studentChips .chip[data-name]'));
    // Prefer chips (structured list). Fallback to textarea if no chips present
    const chipsNames = chips.map(c => (c.dataset.name||'').trim()).filter(Boolean);
    const absentList = chipsNames.join(', ');
    // Build students array if chips present
    const students = chips.map(c => ({
        name: (c.dataset.name||'').trim(),
        status: (c.dataset.status||'Unexcused').trim(),
        reason: (c.dataset.reason||'').trim()
    }));
    // Legacy top-level fields preserved for backward compatibility (take first if available)
    const attendanceStatus = students[0]?.status || 'Unexcused';
    const reason = students[0]?.reason || '';

    if (!division || !className || !section || !absentList) { alert("Please fill out all fields."); return; }

    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    try {
        const response = await fetch('https://ziad-school-app.onrender.com/absences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                division: division,
                class: className,
                section: section,
                absentees: absentList,
                attendanceStatus: attendanceStatus,
                reason: reason,
                students: students,
            }),
        });
        if (!response.ok) { throw new Error(`Server responded with status: ${response.status}`); }
        alert("Absence report submitted successfully!");

        document.getElementById("division").value = "";
        document.getElementById("className").value = "";
        document.getElementById("className").innerHTML = '<option value="">-- First Select a Division --</option>';
        document.getElementById("className").disabled = true;
        document.getElementById("section").value = "";
        document.getElementById("section").disabled = true;
        var legacyTextarea = document.getElementById("absentList");
        if (legacyTextarea) legacyTextarea.value = "";
        // Clear student chips
        const chipsWrap = document.getElementById('studentChips');
        if (chipsWrap) chipsWrap.innerHTML = '';
        var legacyStatusEl = document.getElementById("attendanceStatus");
        if (legacyStatusEl) legacyStatusEl.value = 'Unexcused';
        var legacyReasonEl = document.getElementById("reason");
        if (legacyReasonEl) legacyReasonEl.value = "";

    } catch (error) {
        alert("Error submitting report: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Absence';
    }
}

window.submitAbsence = submitAbsence;
window.logout = async function() { await auth.signOut(); window.location.href = "teacher_login.html"; }
window.goAbout = function() { window.open("about_us.html", "_blank"); }

// Enhance "Reason" UI with chips interactions
document.addEventListener('DOMContentLoaded', () => {
    // Student chips add/remove
    const studentInput = document.getElementById('studentName');
    const addBtn = document.getElementById('addStudentBtn');
    const chipsWrap = document.getElementById('studentChips');
    const textarea = document.getElementById('absentList');
    const studentStatus = document.getElementById('studentStatus');
    const studentReason = document.getElementById('studentReason');
    function syncTextarea(){
        if(!textarea) return;
        const names = Array.from(chipsWrap.querySelectorAll('.chip[data-name]')).map(c => c.dataset.name);
        textarea.value = names.join(', ');
    }
    function addStudent(name, status, reason){
        const n = String(name||'').trim();
        if(!n) return;
        // avoid duplicates (case-insensitive)
        const exists = Array.from(chipsWrap.querySelectorAll('.chip[data-name]')).some(c => (c.dataset.name||'').toLowerCase() === n.toLowerCase());
        if(exists) { studentInput.value=''; return; }
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.dataset.name = n;
        chip.dataset.status = (status||studentStatus?.value||'Unexcused');
        chip.dataset.reason = (reason||studentReason?.value||'');
        const tag = chip.dataset.reason ? `${chip.dataset.status} · ${chip.dataset.reason}` : chip.dataset.status;
        chip.innerHTML = `<span>${n}</span> <span class=\"badge\" style=\"margin-left:6px;\">${tag}</span> <span class=\"chip-remove\" aria-label=\"Remove\">×</span>`;
        chip.addEventListener('click', (e)=>{
            if(e.target && e.target.classList.contains('chip-remove')){
                chip.remove();
                syncTextarea();
            }
        });
        chipsWrap.appendChild(chip);
        studentInput.value = '';
        if(studentReason) studentReason.value = '';
        if(studentStatus) studentStatus.value = 'Unexcused';
        syncTextarea();
    }
    if(addBtn && studentInput && chipsWrap){
        addBtn.addEventListener('click', ()=> addStudent(studentInput.value, studentStatus?.value, studentReason?.value));
        studentInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter'){ e.preventDefault(); addStudent(studentInput.value, studentStatus?.value, studentReason?.value); }});
        // No initial parse since legacy textarea is removed
    }
    const reasonChips = document.querySelectorAll('#reasonChips .chip');
    const reasonInput = document.getElementById('reason');
    if (reasonChips && reasonInput) {
        reasonChips.forEach(chip => {
            chip.addEventListener('click', () => {
                reasonChips.forEach(c => c.classList.remove('active'));
                reasonInput.value = chip.dataset.reason || '';
                chip.classList.add('active');
                reasonInput.focus();
            });
        });
        reasonInput.addEventListener('input', () => {
            const val = (reasonInput.value || '').trim().toLowerCase();
            reasonChips.forEach(c => c.classList.toggle('active', val === (c.dataset.reason||'').toLowerCase()));
        });
    }
});
