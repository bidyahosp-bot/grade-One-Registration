<script>
    function renderForm() {
        document.getElementById('app').innerHTML = `
            <form id="regForm">
                <input type="text" name="childName" placeholder="اسم الطفل الثلاثي" required>
                <input type="date" name="birthDate" required>
                <!-- المزيد من الحقول -->
                <div id="calendar" class="calendar-grid"></div>
                <button type="submit" class="btn-submit">تأكيد الحجز</button>
            </form>
        `;
    }
    // دالة لجلب التقويم وتحديث الحالات (متاح/ممتلئ)
    // دالة إرسال البيانات عبر google.script.run
</script>
