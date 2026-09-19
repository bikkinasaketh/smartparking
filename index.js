const searchBtn = document.getElementById("searchBtn");
const parkingResults = document.getElementById("parkingResults");

const locationInput = document.getElementById("location");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

const bookingParking = document.getElementById("bookingParking");
const bookingSlot = document.getElementById("bookingSlot");
const bookingDate = document.getElementById("bookingDate");
const bookingTime = document.getElementById("bookingTime");
const vehicleNumber = document.getElementById("vehicleNumber");

const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
const contactSubject = document.getElementById("contactSubject");
const contactMessage = document.getElementById("contactMessage");

const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");
const logoutButton = document.getElementById("logoutButton");

const parkingData = [
    {
        name: "City Center Parking",
        location: "Main Road",
        total: 24,
        price: 30
    },
    {
        name: "Tech Park Parking",
        location: "IT Road",
        total: 40,
        price: 40
    },
    {
        name: "Metro Parking",
        location: "Metro Station",
        total: 30,
        price: 25
    },
    {
        name: "Central Mall Parking",
        location: "Main Road",
        total: 30,
        price: 35
    },
    {
        name: "Business Hub Parking",
        location: "IT Road",
        total: 25,
        price: 45
    }
];

let selectedParking = null;
let selectedSlot = null;

let smartParkSlots =
    JSON.parse(localStorage.getItem("smartParkSlots")) || {};

parkingData.forEach(function (parking) {

    if (!Array.isArray(smartParkSlots[parking.name])) {
        smartParkSlots[parking.name] = [];
    }

    for (let i = 1; i <= parking.total; i++) {

        const slotName =
            `A${String(i).padStart(2, "0")}`;

        const existingSlot =
            smartParkSlots[parking.name].find(function (slot) {

                return slot.slot === slotName;

            });

        if (!existingSlot) {

            smartParkSlots[parking.name].push({
                slot: slotName,
                status: "available"
            });

        }

    }

});

localStorage.setItem(
    "smartParkSlots",
    JSON.stringify(smartParkSlots)
);

function getAvailableSlots(parkingName) {

    const slots =
        smartParkSlots[parkingName] || [];

    return slots.filter(function (slot) {

        return slot.status === "available";

    }).length;

}

function updateParkingAvailability() {

    document
        .querySelectorAll(".available-slots")
        .forEach(function (element) {

            const parkingName =
                element.getAttribute("data-parking");

            element.textContent =
                getAvailableSlots(parkingName);

        });

}

updateParkingAvailability();

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        function () {

            const location =
                locationInput.value.trim();

            const date =
                dateInput.value;

            const time =
                timeInput.value;

            if (location === "") {

                alert("Please select a location");
                return;

            }

            if (date === "") {

                alert("Please select a date");
                return;

            }

            if (time === "") {

                alert("Please select a time");
                return;

            }

            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];

            if (date < today) {

                alert(
                    "Please select a current or future date"
                );

                return;

            }

            const results =
                parkingData.filter(
                    function (parking) {

                        return parking.location
                            .toLowerCase() ===
                            location.toLowerCase();

                    }
                );

            parkingResults.innerHTML = "";

            if (results.length === 0) {

                parkingResults.innerHTML = `
                    <div class="no-results">
                        <h3>No Parking Found</h3>
                        <p>
                            No parking areas are available
                            at this location.
                        </p>
                    </div>
                `;

                return;

            }

            results.forEach(
                function (parking) {

                    const available =
                        getAvailableSlots(
                            parking.name
                        );

                    const card =
                        document.createElement("div");

                    card.className =
                        "parking-card";

                    card.innerHTML = `
                        <div class="parking-card-content">

                            <h3>${parking.name}</h3>

                            <p class="parking-location">
                                📍 ${parking.location}
                            </p>

                            <p class="parking-price">
                                ₹${parking.price} / hour
                            </p>

                            <p class="parking-availability">
                                <span
                                    class="available-slots"
                                    data-parking="${parking.name}"
                                >
                                    ${available}
                                </span>
                                slots available
                            </p>

                            <button
                                type="button"
                                class="view-slots-button"
                            >
                                View Slots
                            </button>

                        </div>
                    `;

                    const viewButton =
                        card.querySelector(
                            ".view-slots-button"
                        );

                    viewButton.addEventListener(
                        "click",
                        function () {

                            showSlots(
                                parking.name
                            );

                        }
                    );

                    parkingResults.appendChild(
                        card
                    );

                }
            );

            updateParkingAvailability();

            parkingResults.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}

function showSlots(parkingName) {

    selectedParking =
        parkingData.find(
            function (parking) {

                return parking.name ===
                    parkingName;

            }
        );

    if (!selectedParking) {
        return;
    }

    selectedSlot = null;

    const slots =
        smartParkSlots[parkingName] || [];

    parkingResults.innerHTML = "";

    const slotSection =
        document.createElement("div");

    slotSection.className =
        "slot-section";

    slotSection.innerHTML = `
        <div class="slot-header">

            <div>
                <h2>
                    ${selectedParking.name}
                </h2>

                <p>
                    ${selectedParking.location}
                    • ₹${selectedParking.price} / hour
                </p>
            </div>

            <button
                type="button"
                class="back-slots-button"
                id="backSlotsButton"
            >
                ← Back
            </button>

        </div>

        <div class="slot-legend">

            <div>
                <span class="legend-box available"></span>
                Available
            </div>

            <div>
                <span class="legend-box occupied"></span>
                Occupied
            </div>

            <div>
                <span class="legend-box selected"></span>
                Selected
            </div>

        </div>

        <div
            class="slots-container"
            id="slotsContainer"
        ></div>
    `;

    parkingResults.appendChild(
        slotSection
    );

    const slotsContainer =
        document.getElementById(
            "slotsContainer"
        );

    slots.forEach(
        function (slot) {

            const slotButton =
                document.createElement(
                    "button"
                );

            slotButton.type =
                "button";

            slotButton.className =
                "parking-slot";

            slotButton.textContent =
                slot.slot;

            slotButton.dataset.slot =
                slot.slot;

            if (
                slot.status ===
                "occupied"
            ) {

                slotButton.classList.add(
                    "occupied"
                );

                slotButton.disabled =
                    true;

            } else {

                slotButton.classList.add(
                    "available"
                );

                slotButton.addEventListener(
                    "click",
                    function () {

                        selectSlot(
                            slot.slot
                        );

                    }
                );

            }

            slotsContainer.appendChild(
                slotButton
            );

        }
    );

    const backButton =
        document.getElementById(
            "backSlotsButton"
        );

    if (backButton) {

        backButton.addEventListener(
            "click",
            function () {

                searchBtn.click();

            }
        );

    }

    parkingResults.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

function selectSlot(slot) {

    selectedSlot =
        slot;

    document
        .querySelectorAll(
            ".parking-slot"
        )
        .forEach(
            function (button) {

                button.classList.remove(
                    "selected"
                );

            }
        );

    const selectedButton =
        document.querySelector(
            `.parking-slot[data-slot="${slot}"]`
        );

    if (selectedButton) {

        selectedButton.classList.add(
            "selected"
        );

    }

    if (bookingParking) {

        bookingParking.value =
            selectedParking.name;

    }

    if (bookingSlot) {

        bookingSlot.value =
            selectedSlot;

    }

    if (bookingDate) {

        bookingDate.value =
            dateInput.value;

    }

    if (bookingTime) {

        bookingTime.value =
            timeInput.value;

    }

    const bookingSection =
        document.getElementById(
            "Booking"
        );

    if (bookingSection) {

        setTimeout(
            function () {

                bookingSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            },
            200
        );

    }

}

const confirmButton =
    document.querySelector(
        ".confirm-button"
    );

if (confirmButton) {

    confirmButton.addEventListener(
        "click",
        function () {

            const parkingName =
                bookingParking.value.trim();

            const slotName =
                bookingSlot.value.trim();

            const date =
                bookingDate.value;

            const time =
                bookingTime.value;

            const vehicle =
                vehicleNumber.value
                    .trim()
                    .toUpperCase();

            if (parkingName === "") {

                alert(
                    "Please select parking"
                );

                return;

            }

            if (slotName === "") {

                alert(
                    "Please select a parking slot"
                );

                return;

            }

            if (date === "") {

                alert(
                    "Please select booking date"
                );

                return;

            }

            if (time === "") {

                alert(
                    "Please select booking time"
                );

                return;

            }

            if (vehicle === "") {

                alert(
                    "Please enter vehicle number"
                );

                return;

            }

            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];

            if (date < today) {

                alert(
                    "Please select a current or future date"
                );

                return;

            }

            const parking =
                parkingData.find(
                    function (item) {

                        return item.name ===
                            parkingName;

                    }
                );

            if (!parking) {

                alert(
                    "Parking not found"
                );

                return;

            }

            const slots =
                smartParkSlots[
                    parkingName
                ] || [];

            const selectedSlotData =
                slots.find(
                    function (slot) {

                        return slot.slot ===
                            slotName;

                    }
                );

            if (!selectedSlotData) {

                alert(
                    "Selected slot not found"
                );

                return;

            }

            if (
                selectedSlotData.status ===
                "occupied"
            ) {

                alert(
                    "This slot is already occupied"
                );

                return;

            }

            selectedSlotData.status =
                "occupied";

            smartParkSlots[
                parkingName
            ] = slots;

            localStorage.setItem(
                "smartParkSlots",
                JSON.stringify(
                    smartParkSlots
                )
            );

            const booking = {

                parking:
                    parking.name,

                location:
                    parking.location,

                slot:
                    slotName,

                date:
                    date,

                time:
                    time,

                vehicle:
                    vehicle,

                price:
                    parking.price,

                status:
                    "active"

            };

            localStorage.setItem(
                "smartParkBooking",
                JSON.stringify(
                    booking
                )
            );

            selectedParking =
                parking;

            selectedSlot =
                slotName;

            updateParkingAvailability();

            const confirmation =
                document.createElement(
                    "div"
                );

            confirmation.className =
                "booking-confirmation";

            confirmation.innerHTML = `
                <div class="confirmation-card">

                    <h2>
                        Booking Confirmed!
                    </h2>

                    <p>
                        Your parking slot has
                        been reserved successfully.
                    </p>

                    <div
                        class="confirmation-details"
                    >

                        <p>
                            <strong>
                                Parking:
                            </strong>
                            ${parking.name}
                        </p>

                        <p>
                            <strong>
                                Location:
                            </strong>
                            ${parking.location}
                        </p>

                        <p>
                            <strong>
                                Slot:
                            </strong>
                            ${slotName}
                        </p>

                        <p>
                            <strong>
                                Date:
                            </strong>
                            ${date}
                        </p>

                        <p>
                            <strong>
                                Time:
                            </strong>
                            ${time}
                        </p>

                        <p>
                            <strong>
                                Vehicle:
                            </strong>
                            ${vehicle}
                        </p>

                        <p>
                            <strong>
                                Price:
                            </strong>
                            ₹${parking.price} / hour
                        </p>

                    </div>

                    <div
                        class="confirmation-buttons"
                    >

                        <button
                            type="button"
                            id="dashboardButton"
                        >
                            Go to Dashboard
                        </button>

                        <button
                            type="button"
                            id="homeButton"
                        >
                            Back to Home
                        </button>

                    </div>

                </div>
            `;

            document.body.appendChild(
                confirmation
            );

            const dashboardButton =
                document.getElementById(
                    "dashboardButton"
                );

            if (dashboardButton) {

                dashboardButton.addEventListener(
                    "click",
                    function () {

                        window.location.href =
                            "dashboard.html";

                    }
                );

            }

            const homeButton =
                document.getElementById(
                    "homeButton"
                );

            if (homeButton) {

                homeButton.addEventListener(
                    "click",
                    function () {

                        confirmation.remove();

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });

                    }
                );

            }

            if (bookingParking) {
                bookingParking.value = "";
            }

            if (bookingSlot) {
                bookingSlot.value = "";
            }

            if (bookingDate) {
                bookingDate.value = "";
            }

            if (bookingTime) {
                bookingTime.value = "";
            }

            if (vehicleNumber) {
                vehicleNumber.value = "";
            }

        }
    );

}

const contactButton =
    document.querySelector(
        ".contact-button"
    );

if (contactButton) {

    contactButton.addEventListener(
        "click",
        function () {

            const name =
                contactName.value.trim();

            const email =
                contactEmail.value.trim();

            const subject =
                contactSubject.value.trim();

            const message =
                contactMessage.value.trim();

            if (name === "") {

                alert(
                    "Please enter your name"
                );

                return;

            }

            if (email === "") {

                alert(
                    "Please enter your email"
                );

                return;

            }

            if (
                !email.includes("@")
            ) {

                alert(
                    "Please enter a valid email"
                );

                return;

            }

            if (subject === "") {

                alert(
                    "Please enter subject"
                );

                return;

            }

            if (message === "") {

                alert(
                    "Please enter your message"
                );

                return;

            }

            const contactData = {

                name:
                    name,

                email:
                    email,

                subject:
                    subject,

                message:
                    message,

                date:
                    new Date()
                        .toLocaleString()

            };

            const oldMessages =
                JSON.parse(
                    localStorage.getItem(
                        "smartParkContacts"
                    )
                ) || [];

            oldMessages.push(
                contactData
            );

            localStorage.setItem(
                "smartParkContacts",
                JSON.stringify(
                    oldMessages
                )
            );

            alert(
                "Your message has been sent successfully!"
            );

            contactName.value = "";
            contactEmail.value = "";
            contactSubject.value = "";
            contactMessage.value = "";

        }
    );

}

const loggedIn =
    localStorage.getItem(
        "smartParkLoggedIn"
    );

if (loggedIn === "true") {

    if (loginButton) {

        loginButton.style.display =
            "none";

    }

    if (signupButton) {

        signupButton.style.display =
            "none";

    }

    if (logoutButton) {

        logoutButton.style.display =
            "block";

    }

} else {

    if (loginButton) {

        loginButton.style.display =
            "inline-block";

    }

    if (signupButton) {

        signupButton.style.display =
            "inline-block";

    }

    if (logoutButton) {

        logoutButton.style.display =
            "none";

    }

}

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "smartParkLoggedIn"
            );

            localStorage.removeItem(
                "smartParkUserName"
            );

            window.location.href =
                "login.html";

        }
    );

}

const myBookingButton =
    document.getElementById(
        "myBookingButton"
    );

if (myBookingButton) {

    myBookingButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "dashboard.html";

        }
    );

}
