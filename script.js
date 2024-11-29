class GradeManager {
    constructor() {
        this.gradeData = {
            1: [
                // 1학년 기본 데이터
                {
                    courseType: "교양",
                    requirement: "필수",
                    name: "국어",
                    credits: 3,
                    attendance: 18,
                    assignment: 17,
                    midterm: 25,
                    final: 28,
                    total: 88
                },
                {
                    courseType: "전공",
                    requirement: "선택",
                    name: "수학",
                    credits: 3,
                    attendance: 19,
                    assignment: 18,
                    midterm: 27,
                    final: 25,
                    total: 89
                }
            ],
            2: [
                // 2학년 기본 데이터
                {
                    courseType: "전공",
                    requirement: "필수",
                    name: "자료구조",
                    credits: 3,
                    attendance: 17,
                    assignment: 16,
                    midterm: 26,
                    final: 27,
                    total: 86
                }
            ],
            3: [
                // 3학년 기본 데이터
                {
                    courseType: "전공",
                    requirement: "선택",
                    name: "알고리즘",
                    credits: 3,
                    attendance: 18,
                    assignment: 17,
                    midterm: 25,
                    final: 28,
                    total: 88
                }
            ]
        };
        this.currentGrade = 1; // 현재 선택된 학년

        // 학년 선택 이벤트 리스너 등록
        document.getElementById('gradeSelect').addEventListener('change', (e) => {
            this.changeGrade(e.target.value);
        });

        // 페이지 로드 시 테이블 업데이트
        this.updateTableView();
    }

    // 학년 변경 함수
    changeGrade(grade) {
        this.currentGrade = parseInt(grade);
        this.updateTableView();
    }

    // 현재 학년의 데이터 가져오기
    getCurrentGradeData() {
        return this.gradeData[this.currentGrade];
    }

    // 테이블 뷰 업데이트
    updateTableView() {
        const tbody = document.getElementById('gradeTableBody');
        tbody.innerHTML = '';

        const currentData = this.getCurrentGradeData();

        // 데이터 정렬
        this.sortData(currentData);

        currentData.forEach(subject => {
            const row = this.createTableRow(subject);
            tbody.appendChild(row);
        });

        this.calculateTotals();
    }

    // 데이터 정렬 함수
    sortData(data) {
        data.sort((a, b) => {
            // 1. 이수 비교 (교양이 먼저)
            if (a.type !== b.type) {
                return a.type.localeCompare(b.type);
            }
            // 2. 필수 비교 (필수가 먼저)
            if (a.required !== b.required) {
                return a.required.localeCompare(b.required);
            }
            // 3. 과목명 비교
            return a.name.localeCompare(b.name);
        });
    }

    // 과목 추가
    addSubject(subject) {
        if (this.isDuplicateSubject(subject)) {
            alert('이미 존재하는 과목입니다! (F학점 제외)');
            return false;
        }
        this.getCurrentGradeData().push(subject);
        return true;
    }

    // 중복 과목 체크
    isDuplicateSubject(newSubject) {
        return this.getCurrentGradeData().some(subject =>
            subject.name === newSubject.name &&
            this.calculateGrade(subject) !== 'F' &&
            this.calculateGrade(subject) !== 'NP'
        );
    }

    // 테이블 행 생성
    createTableRow(subject) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><input type="checkbox" class="row-select"></td>
            <td>${subject.courseType}</td>
            <td>${subject.requirement}</td>
            <td>${subject.name}</td>
            <td>${subject.credits}</td>
            <td>${subject.attendance}</td>
            <td>${subject.assignment}</td>
            <td>${subject.midterm}</td>
            <td>${subject.final}</td>
            <td>${subject.total}</td>
            <td></td>
            <td>${this.calculateGrade(subject)}</td>
        `;

        // 'F' 또는 'NP' 학점인 경우 빨간색 표시
        const gradeCell = row.querySelector('td:last-child');
        if (gradeCell.textContent === 'F' || gradeCell.textContent === 'NP') {
            gradeCell.classList.add('fail-grade');
        }

        return row;
    }

    // 과목 데이터 추출
    getSubjectFromRow(row) {
        // 이수 구분 가져오기
        let courseTypeElement = row.querySelector('.course-type');
        let courseType = '';

        if (courseTypeElement) {
            courseType = courseTypeElement.value;
        } else {
            courseType = row.cells[1].textContent.trim();
        }

        // 필수 구분 가져오기
        let requirementElement = row.querySelector('.requirement');
        let requirement = '';

        if (requirementElement) {
            requirement = requirementElement.value;
        } else {
            requirement = row.cells[2].textContent.trim();
        }

        // 과목명 가져오기
        let nameElement = row.querySelector('.subject-name');
        let name = '';

        if (nameElement) {
            name = nameElement.value;
        } else {
            name = row.cells[3].textContent.trim();
        }

        // 학점 가져오기
        let creditsElement = row.querySelector('.credits');
        let credits = 0;

        if (creditsElement) {
            credits = parseInt(creditsElement.value) || 0;
        } else {
            credits = parseInt(row.cells[4].textContent.trim()) || 0;
        }

        // 출석 점수 가져오기
        let attendanceElement = row.querySelector('.attendance');
        let attendance = 0;

        if (attendanceElement) {
            attendance = parseInt(attendanceElement.value) || 0;
        } else {
            attendance = parseInt(row.cells[5].textContent.trim()) || 0;
        }

        // **과제 점수 가져오기**
        let assignmentElement = row.querySelector('.assignment');
        let assignment = 0;

        if (assignmentElement) {
            assignment = parseInt(assignmentElement.value) || 0;
        } else {
            assignment = parseInt(row.cells[6].textContent.trim()) || 0;
        }

        // **중간고사 점수 가져오기**
        let midtermElement = row.querySelector('.midterm');
        let midterm = 0;

        if (midtermElement) {
            midterm = parseInt(midtermElement.value) || 0;
        } else {
            midterm = parseInt(row.cells[7].textContent.trim()) || 0;
        }

        // **기말고사 점수 가져오기**
        let finalElement = row.querySelector('.final');
        let final = 0;

        if (finalElement) {
            final = parseInt(finalElement.value) || 0;
        } else {
            final = parseInt(row.cells[8].textContent.trim()) || 0;
        }

        // 총점 계산
        let total = attendance + assignment + midterm + final;

        // 반환할 객체 생성
        return {
            courseType: courseType,
            requirement: requirement,
            name: name,
            credits: credits,
            attendance: attendance,
            assignment: assignment,
            midterm: midterm,
            final: final,
            total: total
        };
    }

    // 성적 계산 함수
    calculateGrade(subject) {
        const total = subject.attendance + subject.assignment + subject.midterm + subject.final;

        // 학점이 1학점인 경우 Pass/Non Pass 처리
        if (subject.credits === 1) {
            return total >= 60 ? 'P' : 'NP';
        }

        if (total >= 95) return 'A+';
        if (total >= 90) return 'A0';
        if (total >= 85) return 'B+';
        if (total >= 80) return 'B0';
        if (total >= 75) return 'C+';
        if (total >= 70) return 'C0';
        if (total >= 65) return 'D+';
        if (total >= 60) return 'D0';
        return 'F';
    }

    // 합계 계산 함수
    calculateTotals() {
        const data = this.getCurrentGradeData();
        let totalCredits = 0;
        let totalAttendance = 0;
        let totalAssignment = 0;
        let totalMidterm = 0;
        let totalFinal = 0;
        let totalScore = 0;
        let validSubjects = 0;

        data.forEach(subject => {
            totalCredits += subject.credits;

            // 학점이 1인 Pass/Non Pass 과목은 점수 계산에서 제외
            if (subject.credits === 1) {
                return;
            }

            totalAttendance += subject.attendance;
            totalAssignment += subject.assignment;
            totalMidterm += subject.midterm;
            totalFinal += subject.final;
            totalScore += subject.total;
            validSubjects++;
        });

        // 결과 표시
        document.getElementById('totalCredits').textContent = totalCredits;
        document.getElementById('totalAttendance').textContent = totalAttendance;
        document.getElementById('totalAssignment').textContent = totalAssignment;
        document.getElementById('totalMidterm').textContent = totalMidterm;
        document.getElementById('totalFinal').textContent = totalFinal;
        document.getElementById('totalScore').textContent = totalScore;

        const averageScore = validSubjects > 0 ? (totalScore / validSubjects).toFixed(1) : '0';
        document.getElementById('averageScore').textContent = averageScore;
        document.getElementById('averageGrade').textContent = this.calculateAverageGrade(averageScore);
    }

    // 평균 성적 계산
    calculateAverageGrade(averageScore) {
        const score = parseFloat(averageScore);

        if (score >= 95) return 'A+';
        if (score >= 90) return 'A0';
        if (score >= 85) return 'B+';
        if (score >= 80) return 'B0';
        if (score >= 75) return 'C+';
        if (score >= 70) return 'C0';
        if (score >= 65) return 'D+';
        if (score >= 60) return 'D0';
        return 'F';
    }
}


function addRow() {
    const tbody = document.getElementById('gradeTableBody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td><input type="checkbox" class="row-select"></td>
        <td>
            <select class="course-type">
                <option value="교양">교양</option>
                <option value="전공">전공</option>
            </select>
        </td>
        <td>
            <select class="requirement">
                <option value="필수">필수</option>
                <option value="선택">선택</option>
            </select>
        </td>
        <td><input type="text" class="subject-name"></td>
        <td><input type="number" class="credits" min="1" max="3" value="3"></td>
        <td><input type="number" class="attendance" min="0" max="20" value="0"></td>
        <td><input type="number" class="assignment" min="0" max="20" value="0"></td>
        <td><input type="number" class="midterm" min="0" max="30" value="0"></td>
        <td><input type="number" class="final" min="0" max="30" value="0"></td>
        <td class="total">0</td>
        <td class="average">-</td>
        <td class="grade">-</td>
    `;

    tbody.appendChild(row);
    // addEventListenersToRow(row); 호출 제거
}

function saveAndCalculate() {
    const rows = document.querySelectorAll('#gradeTableBody tr');
    const subjects = [];
    const subjectNames = new Set();
    const validationErrors = [];
    let hasValidationError = false;

    rows.forEach((row, index) => {
        const subject = gradeManager.getSubjectFromRow(row);

        // 유효성 검사
        const validationResult = validateSubject(subject);
        if (!validationResult.isValid) {
            validationErrors.push(`${index + 1}번째 행: ${validationResult.message}`);
            hasValidationError = true;
            return;
        }

        if (!subject.name) {
            validationErrors.push(`${index + 1}번째 행: 과목명이 입력되지 않았습니다.`);
            hasValidationError = true;
            return;
        }

        // 성적 및 총점 계산
        subject.total = subject.attendance + subject.assignment + subject.midterm + subject.final;
        subject.grade = gradeManager.calculateGrade(subject);

        // 중복 과목명 검사 ('F'와 'NP'는 제외)
        if (
            subject.grade !== 'F' && subject.grade !== 'NP' &&
            subjectNames.has(subject.name)
        ) {
            validationErrors.push(`${index + 1}번째 행: 이미 존재하는 과목입니다! (F학점 제외)`);
            hasValidationError = true;
            return;
        }

        // 유효한 과목명 추가 ('F'와 'NP'는 제외)
        if (subject.grade !== 'F' && subject.grade !== 'NP') {
            subjectNames.add(subject.name);
        }

        subjects.push(subject);
    });

    if (hasValidationError) {
        alert(validationErrors.join('\n'));
        return; // 유효성 검사 실패 시 저장 중단
    }

    // 현재 학년 데이터에 유효한 데이터 저장
    gradeManager.gradeData[gradeManager.currentGrade] = subjects;

    // 데이터 정렬
    gradeManager.sortData(subjects);

    // 테이블 갱신
    const tbody = document.getElementById('gradeTableBody');
    tbody.innerHTML = '';

    // 행 추가
    subjects.forEach(subject => {
        const row = gradeManager.createTableRow(subject);
        tbody.appendChild(row);
    });

    // 합계 계산
    gradeManager.calculateTotals();
}

function validateSubject(subject) {
    // 학점 범위 검사
    if (subject.credits < 1 || subject.credits > 3) {
        return { isValid: false, message: '학점은 1~3 사이여야 합니다.' };
    }

    // 점수 범위 검사
    if (subject.attendance < 0 || subject.attendance > 20 ||
        subject.assignment < 0 || subject.assignment > 20 ||
        subject.midterm < 0 || subject.midterm > 30 ||
        subject.final < 0 || subject.final > 30) {
        return { isValid: false, message: '점수는 지정된 범위 내에서 입력해야 합니다.' };
    }

    const total = subject.attendance + subject.assignment + subject.midterm + subject.final;
    if (total < 0 || total > 100) {
        return { isValid: false, message: '총점은 0~100 사이여야 합니다.' };
    }

    return { isValid: true };
}

function deleteSelected() {
    const rows = document.querySelectorAll('#gradeTableBody tr');
    rows.forEach(row => {
        const checkbox = row.querySelector('.row-select');
        if (checkbox && !checkbox.disabled && checkbox.checked) {
            row.remove();
        }
    });
}

// GradeManager 인스턴스 생성
const gradeManager = new GradeManager();

// 초기화 함수
function initializeGradeSystem() {
    // 필요 시 초기 데이터 로드 또는 설정
}

// 페이지 로드 시 초기화
window.onload = initializeGradeSystem;

function convertRowToText(row, subject) {
    // 체크박스를 비활성화하지 않음
    // const checkbox = row.querySelector('.row-select');
    // checkbox.disabled = true;

    // 행 내용을 텍스트로 변경 (체크박스 셀은 유지)
    row.innerHTML = `
        <td><input type="checkbox" class="row-select"></td>
        <td>${subject.courseType}</td>
        <td>${subject.requirement}</td>
        <td>${subject.name}</td>
        <td>${subject.credits}</td>
        <td>${subject.attendance}</td>
        <td>${subject.assignment}</td>
        <td>${subject.midterm}</td>
        <td>${subject.final}</td>
        <td>${subject.total}</td>
        <td>${(subject.total / subject.credits).toFixed(1)}</td>
        <td>${gradeManager.calculateGrade(subject)}</td>
    `;

    // 'F' 또는 'NP' 학점인 경우 빨간색 표시
    const gradeCell = row.querySelector('td:last-child');
    if (gradeCell.textContent === 'F' || gradeCell.textContent === 'NP') {
        gradeCell.classList.add('fail-grade');
    }
}

function toggleAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('#gradeTableBody .row-select');

    checkboxes.forEach(checkbox => {
        if (!checkbox.disabled) {
            checkbox.checked = selectAllCheckbox.checked;
        }
    });
}