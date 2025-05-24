document.addEventListener('DOMContentLoaded', function() {
    const studentForm = document.getElementById('studentForm');
    const studentTableBody = document.getElementById('studentTableBody');
    
    let students = [];
    let nextId = 1;

    // Load existing students
    loadStudents();

    studentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;

        const student = {
            id: nextId++,
            name: name,
            age: parseInt(age),
            gender: gender
        };

        students.push(student);
        saveStudents();
        addStudentToTable(student);
        studentForm.reset();
    });

    function addStudentToTable(student) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.gender}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        `;
        studentTableBody.appendChild(row);
    }

    function loadStudents() {
        const savedStudents = localStorage.getItem('students');
        if (savedStudents) {
            students = JSON.parse(savedStudents);
            nextId = Math.max(...students.map(s => s.id)) + 1;
            students.forEach(student => addStudentToTable(student));
        }
    }

    function saveStudents() {
        localStorage.setItem('students', JSON.stringify(students));
    }

    window.deleteStudent = function(id) {
        students = students.filter(s => s.id !== id);
        saveStudents();
        refreshTable();
    }

    function refreshTable() {
        studentTableBody.innerHTML = '';
        students.forEach(student => addStudentToTable(student));
    }
});
