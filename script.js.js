// දත්ත ගබඩාව (Admin: මෙහි ලකුණු වෙනස් කරන්න)
const studentData = {
    sanskrit: [
        { name: "අමිල", marks: [40, 55, 78], current: 78 },
        { name: "කසුන්", marks: [30, 32, 34], current: 34 },
        { name: "නිමල්", marks: [50, 60, 70], current: 70 }
    ],
    pali: [
        { name: "සුනිල්", marks: [60, 62, 66], current: 66 },
        { name: "කමල්", marks: [20, 25, 30], current: 30 }
    ]
};

function getRank(m) {
    if (m >= 75) return { title: "ශ්‍රී රාවණා", color: "#FF4500" };
    if (m >= 65) return { title: "අර්ජුන්", color: "#FFD700" };
    if (m >= 55) return { title: "අශෝඛ", color: "#ADFF2F" };
    if (m >= 35) return { title: "භීම", color: "#87CEEB" };
    return { title: "හනුමා", color: "#FFA07A" };
}

function showSubject(subject) {
    const list = studentData[subject];
    document.getElementById('subject-title').innerText = subject.toUpperCase() + " ලකුණු පුවරුව";
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = "";

    // Sort by marks
    list.sort((a, b) => b.current - a.current);

    list.forEach(student => {
        const rank = getRank(student.current);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.name}</td>
            <td>${student.current}</td>
            <td style="color:${rank.color}; font-weight:bold;">${rank.title}</td>
            <td><button onclick="showProgress('${student.name}', '${subject}')">බලන්න</button></td>
        `;
        
        // Fireworks effect if clicked and rank is Sri Ravana
        tr.onclick = () => {
            if(student.current >= 75) {
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            }
        };
        tbody.appendChild(tr);
    });
    updatePieChart(list);
}

let myChart;
function showProgress(name, subject) {
    const student = studentData[subject].find(s => s.name === name);
    document.getElementById('individual-stat').style.display = "block";
    document.getElementById('student-name-display').innerText = name + " ගේ ප්‍රගතිය";
    
    const remaining = 75 - student.current;
    document.getElementById('target-info').innerText = 
        remaining > 0 ? `ශ්‍රී රාවණා මට්ටමට ඒමට තව ලකුණු ${remaining} ක් අවශ්‍යයි.` : "ඔබ ප්‍රවීණ මට්ටමේ පසුවේ!";

    if (myChart) myChart.destroy();
    const ctx = document.getElementById('progressChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['සතිය 1', 'සතිය 2', 'සතිය 3'], // ඔබට අවශ්‍ය පරිදි වෙනස් කරන්න
            datasets: [{
                label: 'ලකුණු',
                data: student.marks,
                borderColor: 'blue',
                fill: false
            }]
        }
    });
}

let pieChart;
function updatePieChart(list) {
    const counts = { Hanuma: 0, Bhima: 0, Ashok: 0, Arjun: 0, Ravana: 0 };
    list.forEach(s => {
        const r = getRank(s.current).title;
        if (r === "හනුමා") counts.Hanuma++;
        else if (r === "භීම") counts.Bhima++;
        else if (r === "අශෝඛ") counts.Ashok++;
        else if (r === "අර්ජුන්") counts.Arjun++;
        else counts.Ravana++;
    });

    if (pieChart) pieChart.destroy();
    const ctx = document.getElementById('overallPieChart').getContext('2d');
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['හනුමා', 'භීම', 'අශෝඛ', 'අර්ජුන්', 'ශ්‍රී රාවණා'],
            datasets: [{
                data: Object.values(counts),
                backgroundColor: ['#FFA07A', '#87CEEB', '#ADFF2F', '#FFD700', '#FF4500']
            }]
        }
    });
}

// Initial Load
showSubject('sanskrit');