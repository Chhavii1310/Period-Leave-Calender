const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

const selectedDays = document.getElementById("selectedDays");
const leaveCount = document.getElementById("leaveCount");

const remainingCount =
    document.getElementById("remainingCount");

const periodStartDisplay =
    document.getElementById("periodStartDisplay");

const startPeriodBtn =
    document.getElementById("startPeriodBtn");

const startDateText =
    document.getElementById("startDateText");

const testExpiryBtn =
    document.getElementById("testExpiryBtn");

const newPeriodBtn =
    document.getElementById("newPeriodBtn");


let currentMonth = 7;
let currentYear = 2026;

let selectedDates = [];

let periodStartDate = null;

let selectingStartDate = false;

let leaveWindow = [];


const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


// ------------------------------------
// GENERATE CALENDAR
// ------------------------------------

function generateCalendar() {

    calendar.innerHTML = "";

    monthYear.innerText =
        months[currentMonth] + " " + currentYear;


    const firstDay =
        new Date(
            currentYear,
            currentMonth,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();


    // Empty spaces before first date

    for (let i = 0; i < firstDay; i++) {

        const emptyCell =
            document.createElement("div");

        calendar.appendChild(emptyCell);
    }


    // Create dates

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            document.createElement("div");

        date.classList.add("date");


        const currentDate =
            new Date(
                currentYear,
                currentMonth,
                day
            );


        const dateKey =
            currentYear +
            "-" +
            (currentMonth + 1) +
            "-" +
            day;


        // Check 5-day window

        if (
            leaveWindow.some(
                windowDate =>
                    sameDate(
                        windowDate,
                        currentDate
                    )
            )
        ) {

            date.classList.add("window");
        }


        date.innerText = day;


        // Check selected date

        if (
            selectedDates.includes(dateKey)
        ) {

            date.classList.add("selected");
        }


        if (
            periodStartDate !== null &&
            sameDate(periodStartDate, currentDate)
        ) {

            date.classList.add("period-start-date");
        }


        // Date click

        date.addEventListener(
            "click",
            function () {

                const clickedDate =
                    new Date(
                        currentYear,
                        currentMonth,
                        day
                    );


                const clickedDateKey =
                    currentYear +
                    "-" +
                    (currentMonth + 1) +
                    "-" +
                    day;


                // -------------------------
                // SELECT PERIOD START DATE
                // -------------------------

                if (selectingStartDate) {

                    periodStartDate =
                        clickedDate;

                    createLeaveWindow();

                    selectedDates = [];

                    selectingStartDate = false;


                    startDateText.innerText =
                        "Period started on: " +
                        formatDate(
                            periodStartDate
                        );


                    generateCalendar();

                    updateLeaveInfo();

                    return;
                }


                // -------------------------
                // CHECK START DATE
                // -------------------------

                if (
                    periodStartDate === null
                ) {

                    alert(
                        "Please select your period start date first."
                    );

                    return;
                }


                // -------------------------
                // CHECK 5-DAY WINDOW
                // -------------------------

                if (
                    !isDateInLeaveWindow(
                        clickedDate
                    )
                ) {

                    alert(
                        "You can select leave only within your 5-day period window."
                    );

                    return;
                }


                // -------------------------
                // REMOVE DATE
                // -------------------------

                if (
                    selectedDates.includes(
                        clickedDateKey
                    )
                ) {

                    selectedDates =
                        selectedDates.filter(
                            item =>
                                item !==
                                clickedDateKey
                        );
                }


                // -------------------------
                // ADD DATE
                // -------------------------

                else {

                    if (
                        selectedDates.length >= 3
                    ) {

                        alert(
                            "You have already selected 3 period leave days."
                        );

                        return;
                    }


                    selectedDates.push(
                        clickedDateKey
                    );
                }


                generateCalendar();

                updateLeaveInfo();
            }
        );


        calendar.appendChild(date);
    }
}


// ------------------------------------
// UPDATE LEAVE INFORMATION
// ------------------------------------

function updateLeaveInfo() {

    leaveCount.innerText =
        selectedDates.length;

    remainingCount.innerText =
        3 - selectedDates.length;


        if (periodStartDate === null) {

    periodStartDisplay.innerText =
        "Not Selected";

} else {

    periodStartDisplay.innerText =
        formatDate(periodStartDate);
}


    if (
        selectedDates.length === 0
    ) {

        selectedDays.innerText =
            "None";

        return;
    }


    const formattedDates =
        selectedDates.map(
            dateString => {

                const parts =
                    dateString.split("-");


                const year =
                    Number(parts[0]);


                const month =
                    Number(parts[1]) - 1;


                const day =
                    Number(parts[2]);


                const date =
                    new Date(
                        year,
                        month,
                        day
                    );


                return formatDate(date);
            }
        );


    selectedDays.innerText =
        formattedDates.join(", ");
}


// ------------------------------------
// PREVIOUS MONTH
// ------------------------------------

prevMonth.addEventListener(
    "click",
    function () {

        currentMonth--;


        if (currentMonth < 0) {

            currentMonth = 11;

            currentYear--;
        }


        generateCalendar();
    }
);


// ------------------------------------
// NEXT MONTH
// ------------------------------------

nextMonth.addEventListener(
    "click",
    function () {

        currentMonth++;


        if (currentMonth > 11) {

            currentMonth = 0;

            currentYear++;
        }


        generateCalendar();
    }
);


// ------------------------------------
// PERIOD START BUTTON
// ------------------------------------

startPeriodBtn.addEventListener(
    "click",
    function () {

        selectingStartDate = true;


        startDateText.innerText =
            "Now select the first day of your period from the calendar.";
    }
);


testExpiryBtn.addEventListener(
    "click",
    function () {

        testExpiry();
    }
);


newPeriodBtn.addEventListener(
    "click",
    function () {

        startNewPeriod();

    }
);


// ------------------------------------
// CREATE 5-DAY WINDOW
// ------------------------------------

function createLeaveWindow() {

    leaveWindow = [];


    for (let i = 0; i < 5; i++) {

        const date =
            new Date(
                periodStartDate
            );


        date.setDate(
            periodStartDate.getDate() + i
        );


        leaveWindow.push(date);
    }
}


// ------------------------------------
// COMPARE TWO DATES
// ------------------------------------

function sameDate(
    date1,
    date2
) {

    return (
        date1.getFullYear() ===
            date2.getFullYear() &&

        date1.getMonth() ===
            date2.getMonth() &&

        date1.getDate() ===
            date2.getDate()
    );
}


// ------------------------------------
// FORMAT DATE
// ------------------------------------

function formatDate(date) {

    return (
        date.getDate() +
        " " +
        months[date.getMonth()] +
        " " +
        date.getFullYear()
    );
}


// ------------------------------------
// CHECK 5-DAY WINDOW
// ------------------------------------

function isDateInLeaveWindow(
    clickedDate
) {

    if (
        leaveWindow.length === 0
    ) {

        return false;
    }


    return leaveWindow.some(
        date => {

            return sameDate(
                date,
                clickedDate
            );
        }
    );
}


// ------------------------------------
// CHECK WINDOW EXPIRY
// ------------------------------------

function checkWindowExpiry() {

    if (periodStartDate === null) {
        return;
    }

    const today = new Date();

    const windowEndDate =
        new Date(periodStartDate);

    windowEndDate.setDate(
        periodStartDate.getDate() + 4
    );

    if (today > windowEndDate) {

        selectedDates = [];

        leaveWindow = [];

        periodStartDate = null;

        startDateText.innerText =
            "Your 5-day leave window has expired.";

        updateLeaveInfo();

        generateCalendar();
    }
}


// ------------------------------------
// TEST WINDOW EXPIRY
// ------------------------------------

function testExpiry() {

    if (periodStartDate === null) {

        alert(
            "Please select a period start date first."
        );

        return;
    }

    selectedDates = [];

    leaveWindow = [];

    periodStartDate = null;

    selectingStartDate = false;

    startDateText.innerText =
        "Leave window expired. Please start a new period.";

    updateLeaveInfo();

    generateCalendar();

    alert(
        "5-day leave window has been expired for testing."
    );
}


// ------------------------------------
// START NEW PERIOD
// ------------------------------------

function startNewPeriod() {

    periodStartDate = null;

    leaveWindow = [];

    selectedDates = [];

    selectingStartDate = true;

    startDateText.innerText =
        "Select the first day of your new period.";

    updateLeaveInfo();

    generateCalendar();
}


// ------------------------------------
// START CALENDAR
// ------------------------------------

checkWindowExpiry();

generateCalendar();

updateLeaveInfo();