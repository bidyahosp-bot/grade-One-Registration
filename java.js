<script>

const MAX_BOOKINGS = 25;

const START_DAY = 5;

const END_DAY = 23;

const YEAR = 2026;

const MONTH = 6; // يوليو (0=يناير)

let bookings = {};

let selectedDate = "";

window.onload = function () {

    loadCalendar();

};

function loadCalendar() {

    document.getElementById("loader").style.display = "flex";

    google.script.run

        .withSuccessHandler(function (data) {

            bookings = data;

            drawCalendar();

            document.getElementById("loader").style.display = "none";

        })

        .withFailureHandler(function () {

            document.getElementById("loader").style.display = "none";

            showMessage("تعذر تحميل المواعيد.", false);

        })

        .getBookingsCount();

}

function drawCalendar() {

    const container = document.getElementById("calendarDays");

    container.innerHTML = "";

    const firstDay = new Date(YEAR, MONTH, 1).getDay();

    const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {

        const empty = document.createElement("div");

        container.appendChild(empty);

    }

    for (let day = 1; day <= daysInMonth; day++) {

        createDay(container, day);

    }

}

function createDay(container, day) {

    const cell = document.createElement("div");

    cell.className = "day";

    const dateString =

        YEAR +

        "-" +

        String(MONTH + 1).padStart(2, "0") +

        "-" +

        String(day).padStart(2, "0");

    const booked = bookings[dateString] || 0;

    const remaining = MAX_BOOKINGS - booked;

    const weekDay = new Date(YEAR, MONTH, day).getDay();

    let status = "";

    if (day < START_DAY || day > END_DAY) {

        status = "disabled";

    }

    else if (weekDay == 5 || weekDay == 6) {

        status = "weekend";

    }

    else if (remaining <= 0) {

        status = "full";

    }

    else if (remaining <= 10) {

        status = "warning";

    }

    else {

        status = "available";

    }

    cell.classList.add(status);

    cell.innerHTML = `
        <div>${day}</div>
        <small>${remaining > 0 ? remaining + " مقعد" : "مكتمل"}</small>
    `;

    if (status == "available" || status == "warning") {

        cell.onclick = function () {

            selectDate(cell, dateString);

        };

    }

    container.appendChild(cell);

}
function selectDate(element, date) {

    document
        .querySelectorAll(".selected")
        .forEach(e => e.classList.remove("selected"));

    element.classList.add("selected");

    selectedDate = date;

    document.getElementById("appointmentDate").value = date;

    document.getElementById("submitBtn").disabled = false;

    showMessage("تم اختيار الموعد: " + date, true);

}

function calculateAge() {

    const birth = document.getElementById("birthDate").value;

    if (!birth) return;

    const birthDate = new Date(birth);

    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();

    let months = today.getMonth() - birthDate.getMonth();

    if (today.getDate() < birthDate.getDate()) {

        months--;

    }

    if (months < 0) {

        years--;

        months += 12;

    }

    document.getElementById("childAge").value =
        years + " سنة و " + months + " شهر";

}

function showMessage(message, success) {

    const box = document.getElementById("message");

    box.style.display = "block";

    box.className = success
        ? "message success"
        : "message error";

    box.innerHTML = message;

}

document
.getElementById("appointmentForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    if(selectedDate==""){

        showMessage("يرجى اختيار موعد.",false);

        return;

    }

    document.getElementById("loader").style.display="flex";

    document.getElementById("submitBtn").disabled=true;

    const formData={

        childName:
        document.getElementById("childName").value.trim(),

        birthDate:
        document.getElementById("birthDate").value,

        childAge:
        document.getElementById("childAge").value,

        guardianPhone:
        document.getElementById("guardianPhone").value.trim(),

        region:
        document.getElementById("region").value.trim(),

        appointmentDate:
        selectedDate

    };

    google.script.run

    .withSuccessHandler(function(res){

        document.getElementById("loader").style.display="none";
                if (res.success) {

            showMessage(
                "✅ تم حجز الموعد بنجاح.<br>المقاعد المتبقية: " +
                res.remaining,
                true
            );

            document
                .getElementById("appointmentForm")
                .reset();

            document
                .getElementById("childAge")
                .value = "";

            document
                .querySelectorAll(".selected")
                .forEach(e => e.classList.remove("selected"));

            selectedDate = "";

            document
                .getElementById("submitBtn")
                .disabled = true;

            loadCalendar();

        } else {

            showMessage(
                "❌ " + res.message,
                false
            );

            document
                .getElementById("submitBtn")
                .disabled = false;

        }

    })

    .withFailureHandler(function(err){

        document.getElementById("loader").style.display="none";

        document.getElementById("submitBtn").disabled=false;

        showMessage(

            "حدث خطأ أثناء الاتصال بالخادم.",

            false

        );

        console.error(err);

    })

    .saveAppointmentData(formData);

});

</script>
