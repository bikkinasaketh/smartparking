const searchBtn = document.getElementById("searchBtn");
const parkingResults = document.getElementById("parkingResults");

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

parkingData.forEach(parking => {

    if (!Array.isArray(smartParkSlots[parking.name])) {
        smartParkSlots[parking.name] = [];
    }

    for (let i = 1; i <= parking.total; i++) {

        const slotName =
            `A${String(i).padStart(2, "0")}`;

        const existingSlot =
            smartParkSlots[parking.name].find(
                slot => slot.slot === slotName
            );

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

    return slots.filter(
        slot => slot.status === "available"
    ).length;
}

function showSearchResults() {

    const location =
        document.getElementById("location").value;

    const date =
        document.getElementById("date").value;

    const time =
        document.getElementById("time").value;

    if (location === "") {
        alert("Please select location");
        return;
    }

    if (date === "") {
        alert("Please select date");
        return;
    }

    if (time === "") {
        alert("Please select time");
        return;
    }

    const results =
        parkingData.filter(
            parking =>
                parking.location === location
        );

    if (results.length === 0) {

        parkingResults.innerHTML = `
            <div class="parking-card">
                <h3>No Parking Found</h3>
                <p>No parking available at this location.</p>
            </div>
        `;

        return;
    }

    parkingResults.innerHTML = "";

    results.forEach(parking => {

        const availableCount =
            getAvailableSlots(parking.name);

        const status =
            availableCount > 0
                ? "Available"
                : "Full";

        parkingResults.innerHTML += `

            <div class="parking-card">

                <div class="parking-card-top">

                    <div>
                        <span>Parking Area</span>

                        <h3>
                            ${parking.name}
                        </h3>
                    </div>

                    <span class="available">
                        ${status}
                    </span>

                </div>

                <p class="parking-location">
                    ${parking.location}
                </p>

                <div class="parking-info">

                    <div>
                        <strong>
                            ${parking.total}
                        </strong>

                        <span>
                            Total Slots
                        </span>
                    </div>

                    <div>
                        <strong>
                            ${availableCount}
                        </strong>

                        <span>
                            Available
                        </span>
                    </div>

                    <div>
                        <strong>
                            ₹${parking.price}
                        </strong>

                        <span>
                            Per Hour
                        </span>
                    </div>

                </div>

                <button
                    class="park-button"
                    data-parking="${parking.name}"
                >
                    View Slots
                </button>

            </div>
        `;
    });

    document
        .querySelectorAll(".park-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const parkingName =
                        this.getAttribute(
                            "data-parking"
                        );

                    showSlots(parkingName);
                }
            );
        });

    parkingResults.scrollIntoView({
        behavior: "smooth"
    });
}

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        showSearchResults
    );
}

function showSlots(parkingName) {

    selectedParking =
        parkingData.find(
            parking =>
                parking.name === parkingName
        );

    selectedSlot = null;

    if (!selectedParking) {
        return;
    }

    const slots =
        smartParkSlots[selectedParking.name];

    let slotsHTML = "";

    slots.forEach(slot => {

        if (slot.status === "occupied") {

            slotsHTML += `
                <button
                    class="slot occupied"
                    disabled
                >
                    ${slot.slot}
                </button>
            `;

        } else {

            slotsHTML += `
                <button
                    class="slot available-slot"
                    data-slot="${slot.slot}"
                >
                    ${slot.slot}
                </button>
            `;
        }
    });

    parkingResults.innerHTML = `

        <div class="slot-section">

            <h2>
                ${selectedParking.name}
            </h2>

            <p>
                Select an available parking slot
            </p>

            <div class="slot-container">
                ${slotsHTML}
            </div>

        </div>
    `;

    document
        .querySelectorAll(".available-slot")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    selectSlot(
                        this.getAttribute("data-slot")
                    );
                }
            );
        });

    parkingResults.scrollIntoView({
        behavior: "smooth"
    });
}

function selectSlot(slot) {

    selectedSlot = slot;

    document
        .querySelectorAll(".available-slot")
        .forEach(button => {

            button.classList.remove("selected");

            if (
                button.getAttribute("data-slot") ===
                slot
            ) {
                button.classList.add("selected");
            }
        });

    const bookingSection =
        document.getElementById("Booking");

    if (bookingSection) {

        bookingSection.scrollIntoView({
            behavior: "smooth"
        });
    }

    const bookingParking =
        document.getElementById("bookingParking");

    const bookingSlot =
        document.getElementById("bookingSlot");

    if (bookingParking) {
        bookingParking.value =
            selectedParking.name;
    }

    if (bookingSlot) {
        bookingSlot.innerHTML = `
            <option value="${selectedSlot}">
                ${selectedSlot}
            </option>
        `;

        bookingSlot.value =
            selectedSlot;
    }
}

const confirmButton =
    document.querySelector(".confirm-button");

if (confirmButton) {

    confirmButton.addEventListener(
        "click",
        function () {

            if (!selectedParking) {
                alert("Please select parking");
                return;
            }

            if (!selectedSlot) {
                alert("Please select parking slot");
                return;
            }

            const date =
                document.getElementById(
                    "bookingDate"
                ).value;

            const time =
                document.getElementById(
                    "bookingTime"
                ).value;

            const vehicle =
                document.getElementById(
                    "vehicleNumber"
                ).value.trim();

            if (!date) {
                alert("Please select booking date");
                return;
            }

            if (!time) {
                alert("Please select booking time");
                return;
            }

            if (!vehicle) {
                alert("Please enter vehicle number");
                return;
            }

            const slots =
                smartParkSlots[
                    selectedParking.name
                ];

            const selectedSlotData =
                slots.find(
                    slot =>
                        slot.slot === selectedSlot
                );

            if (!selectedSlotData) {
                alert("Slot not found");
                return;
            }

            selectedSlotData.status =
                "occupied";

            localStorage.setItem(
                "smartParkSlots",
                JSON.stringify(smartParkSlots)
            );

            const booking = {

                parking: selectedParking.name,

                location: selectedParking.location,

                slot: selectedSlot,

                date: date,

                time: time,

                vehicle: vehicle,

                price: selectedParking.price,

                status: "active"
            };

            localStorage.setItem(
                "smartParkBooking",
                JSON.stringify(booking)
            );

            showBookingConfirmation(booking);
        }
    );
}

function showBookingConfirmation(booking) {

    parkingResults.innerHTML = `

        <div class="booking-confirmation">

            <h2>
                Booking Confirmed!
            </h2>

            <p>
                Your parking slot has been
                successfully reserved.
            </p>

            <p>
                <strong>Parking:</strong>
                ${booking.parking}
            </p>

            <p>
                <strong>Location:</strong>
                ${booking.location}
            </p>

            <p>
                <strong>Slot:</strong>
                ${booking.slot}
            </p>

            <p>
                <strong>Date:</strong>
                ${booking.date}
            </p>

            <p>
                <strong>Time:</strong>
                ${booking.time}
            </p>

            <p>
                <strong>Vehicle:</strong>
                ${booking.vehicle}
            </p>

            <p>
                <strong>Price:</strong>
                ₹${booking.price} / hour
            </p>

            <button
                class="dashboard-button"
                onclick="window.location.href='dashboard.html'"
            >
                Go To Dashboard
            </button>

        </div>
    `;

    parkingResults.scrollIntoView({
        behavior: "smooth"
    });
}

const contactButton =
    document.querySelector(".contact-button");

if (contactButton) {

    contactButton.addEventListener(
        "click",
        function () {

            const name =
                document.getElementById(
                    "contactName"
                ).value.trim();

            const email =
                document.getElementById(
                    "contactEmail"
                ).value.trim();

            const subject =
                document.getElementById(
                    "contactSubject"
                ).value.trim();

            const message =
                document.getElementById(
                    "contactMessage"
                ).value.trim();

            if (!name) {
                alert("Please enter your name");
                return;
            }

            if (!email) {
                alert("Please enter your email");
                return;
            }

            if (!subject) {
                alert("Please enter subject");
                return;
            }

            if (!message) {
                alert("Please enter your message");
                return;
            }

            alert(
                "Your message has been sent successfully!"
            );

            document.getElementById(
                "contactName"
            ).value = "";

            document.getElementById(
                "contactEmail"
            ).value = "";

            document.getElementById(
                "contactSubject"
            ).value = "";

            document.getElementById(
                "contactMessage"
            ).value = "";
        }
    );
}

const loginButton =
    document.getElementById("loginButton");

const signupButton =
    document.getElementById("signupButton");

const logoutButton =
    document.getElementById("logoutButton");

const loggedIn =
    localStorage.getItem(
        "smartParkLoggedIn"
    );

if (loggedIn === "true") {

    if (loginButton) {
        loginButton.style.display = "none";
    }

    if (signupButton) {
        signupButton.style.display = "none";
    }

    if (logoutButton) {
        logoutButton.style.display = "block";
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
                "smartParkUser"
            );

            localStorage.removeItem(
                "smartParkUserName"
            );

            window.location.href =
                "login.html";
        }
    );
}
