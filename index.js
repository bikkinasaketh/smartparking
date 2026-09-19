const searchBtn =
    document.getElementById("searchBtn");

const parkingResults =
    document.getElementById("parkingResults");


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
    JSON.parse(
        localStorage.getItem("smartParkSlots")
    ) || {};


parkingData.forEach(parking => {

    if (!smartParkSlots[parking.name]) {

        smartParkSlots[parking.name] = [];

        for (
            let i = 1;
            i <= parking.total;
            i++
        ) {

            smartParkSlots[parking.name].push({

                slot:
                    `A${String(i).padStart(2, "0")}`,

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


function updateParkingAvailability() {

    const availabilityElements =
        document.querySelectorAll(
            ".available-slots"
        );


    availabilityElements.forEach(element => {

        const parkingName =
            element.dataset.parking;


        element.textContent =
            getAvailableSlots(parkingName);

    });

}


updateParkingAvailability();


if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        function () {

            const locationInput =
                document.getElementById(
                    "location"
                ).value;


            const dateInput =
                document.getElementById(
                    "date"
                ).value;


            const timeInput =
                document.getElementById(
                    "time"
                ).value;


            if (!locationInput) {

                alert(
                    "Please select parking location"
                );

                return;

            }


            if (!dateInput) {

                alert(
                    "Please select date"
                );

                return;

            }


            if (!timeInput) {

                alert(
                    "Please select time"
                );

                return;

            }


            const results =
                parkingData.filter(
                    parking =>
                        parking.location ===
                        locationInput
                );


            parkingResults.innerHTML = "";


            if (results.length === 0) {

                parkingResults.innerHTML = `

                    <div class="no-result">

                        <h3>
                            No Parking Found
                        </h3>

                        <p>
                            Please try another location.
                        </p>

                    </div>

                `;

                return;

            }


            results.forEach(parking => {

                const available =
                    getAvailableSlots(
                        parking.name
                    );


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "parking-card";


                card.innerHTML = `

                    <h3>
                        ${parking.name}
                    </h3>

                    <p>
                        <strong>
                            Location:
                        </strong>
                        ${parking.location}
                    </p>

                    <p>
                        <strong>
                            Total Slots:
                        </strong>
                        ${parking.total}
                    </p>

                    <p>
                        <strong>
                            Available Slots:
                        </strong>
                        <span
                            class="search-available-slots"
                        >
                            ${available}
                        </span>
                    </p>

                    <p>
                        <strong>
                            Price:
                        </strong>
                        ₹${parking.price}/hour
                    </p>

                    <button
                        class="view-slots-button"
                    >
                        View Slots
                    </button>

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

            });


            parkingResults.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

}


function showSlots(parkingName) {

    selectedParking =
        parkingData.find(
            parking =>
                parking.name === parkingName
        );


    if (!selectedParking) {
        return;
    }


    const slots =
        smartParkSlots[parkingName] || [];


    parkingResults.innerHTML = `

        <div class="slots-container">

            <h2>
                ${parkingName}
            </h2>

            <p>
                Location:
                ${selectedParking.location}
            </p>

            <p>
                Price:
                ₹${selectedParking.price}/hour
            </p>

            <p>
                Available Slots:
                <strong>
                    ${getAvailableSlots(parkingName)}
                </strong>
            </p>

            <div class="slot-grid"></div>

            <button
                class="back-button"
                onclick="backToParkingResults()"
            >
                Back
            </button>

        </div>

    `;


    const slotGrid =
        document.querySelector(
            ".slot-grid"
        );


    slots.forEach(slotData => {

        const slotButton =
            document.createElement(
                "button"
            );


        slotButton.textContent =
            slotData.slot;


        slotButton.className =
            slotData.status === "occupied"
                ? "slot occupied"
                : "slot available";


        if (
            slotData.status === "occupied"
        ) {

            slotButton.disabled = true;

        } else {

            slotButton.addEventListener(
                "click",
                function () {

                    selectSlot(
                        parkingName,
                        slotData.slot
                    );

                }
            );

        }


        slotGrid.appendChild(
            slotButton
        );

    });


    parkingResults.scrollIntoView({
        behavior: "smooth"
    });

}


function backToParkingResults() {

    const locationInput =
        document.getElementById(
            "location"
        ).value;


    const dateInput =
        document.getElementById(
            "date"
        ).value;


    const timeInput =
        document.getElementById(
            "time"
        ).value;


    if (
        locationInput &&
        dateInput &&
        timeInput
    ) {

        searchBtn.click();

    }

}


function selectSlot(
    parkingName,
    slotNumber
) {

    selectedParking =
        parkingData.find(
            parking =>
                parking.name === parkingName
        );


    selectedSlot =
        slotNumber;


    const bookingParking =
        document.getElementById(
            "bookingParking"
        );


    const bookingSlot =
        document.getElementById(
            "bookingSlot"
        );


    if (bookingParking) {

        bookingParking.innerHTML = `

            <option value="${parkingName}">
                ${parkingName}
            </option>

        `;

        bookingParking.value =
            parkingName;

    }


    if (bookingSlot) {

        bookingSlot.innerHTML = `

            <option value="${slotNumber}">
                ${slotNumber}
            </option>

        `;

        bookingSlot.value =
            slotNumber;

    }


    const searchDate =
        document.getElementById(
            "date"
        ).value;


    const searchTime =
        document.getElementById(
            "time"
        ).value;


    const bookingDate =
        document.getElementById(
            "bookingDate"
        );


    const bookingTime =
        document.getElementById(
            "bookingTime"
        );


    if (
        bookingDate &&
        searchDate
    ) {

        bookingDate.value =
            searchDate;

    }


    if (
        bookingTime &&
        searchTime
    ) {

        bookingTime.value =
            searchTime;

    }


    const bookingSection =
        document.getElementById(
            "Booking"
        );


    if (bookingSection) {

        bookingSection.scrollIntoView({
            behavior: "smooth"
        });

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

            const bookingParking =
                document.getElementById(
                    "bookingParking"
                );


            const bookingSlot =
                document.getElementById(
                    "bookingSlot"
                );


            const bookingDate =
                document.getElementById(
                    "bookingDate"
                );


            const bookingTime =
                document.getElementById(
                    "bookingTime"
                );


            const vehicleNumber =
                document.getElementById(
                    "vehicleNumber"
                );


            const parking =
                bookingParking.value;


            const slot =
                bookingSlot.value;


            const date =
                bookingDate.value;


            const time =
                bookingTime.value;


            const vehicle =
                vehicleNumber.value
                    .trim()
                    .toUpperCase();


            if (!parking) {

                alert(
                    "Please select parking"
                );

                return;

            }


            if (!slot) {

                alert(
                    "Please select slot"
                );

                return;

            }


            if (!date) {

                alert(
                    "Please select date"
                );

                return;

            }


            if (!time) {

                alert(
                    "Please select time"
                );

                return;

            }


            if (!vehicle) {

                alert(
                    "Please enter vehicle number"
                );

                return;

            }


            const parkingDetails =
                parkingData.find(
                    item =>
                        item.name === parking
                );


            if (!parkingDetails) {

                alert(
                    "Parking not found"
                );

                return;

            }


            if (!smartParkSlots[parking]) {

                alert(
                    "Parking slots not found"
                );

                return;

            }


            const selectedSlotData =
                smartParkSlots[parking].find(
                    item =>
                        item.slot === slot
                );


            if (!selectedSlotData) {

                alert(
                    "Slot not found"
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


            localStorage.setItem(
                "smartParkSlots",
                JSON.stringify(
                    smartParkSlots
                )
            );


            updateParkingAvailability();


            const booking = {

                parking:
                    parkingDetails.name,

                location:
                    parkingDetails.location,

                slot:
                    slot,

                date:
                    date,

                time:
                    time,

                vehicle:
                    vehicle,

                price:
                    parkingDetails.price,

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
                parkingDetails;


            selectedSlot =
                slot;


            showBookingConfirmation(
                booking
            );

        }
    );

}


function showBookingConfirmation(
    booking
) {

    const bookingSection =
        document.getElementById(
            "Booking"
        );


    if (!bookingSection) {
        return;
    }


    bookingSection.innerHTML = `

        <div class="booking-confirmation">

            <h2>
                Booking Confirmed
            </h2>

            <p>
                <strong>
                    Parking:
                </strong>
                ${booking.parking}
            </p>

            <p>
                <strong>
                    Location:
                </strong>
                ${booking.location}
            </p>

            <p>
                <strong>
                    Slot:
                </strong>
                ${booking.slot}
            </p>

            <p>
                <strong>
                    Date:
                </strong>
                ${booking.date}
            </p>

            <p>
                <strong>
                    Time:
                </strong>
                ${booking.time}
            </p>

            <p>
                <strong>
                    Vehicle Number:
                </strong>
                ${booking.vehicle}
            </p>

            <p>
                <strong>
                    Price:
                </strong>
                ₹${booking.price}/hour
            </p>

            <p>
                <strong>
                    Status:
                </strong>
                Active
            </p>

            <a
                href="dashboard.html"
                class="dashboard-button"
            >
                Go to Dashboard
            </a>

        </div>

    `;


    bookingSection.scrollIntoView({
        behavior: "smooth"
    });

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
                document.getElementById(
                    "contactName"
                );


            const email =
                document.getElementById(
                    "contactEmail"
                );


            const subject =
                document.getElementById(
                    "contactSubject"
                );


            const message =
                document.getElementById(
                    "contactMessage"
                );


            if (!name.value.trim()) {

                alert(
                    "Please enter your name"
                );

                return;

            }


            if (!email.value.trim()) {

                alert(
                    "Please enter your email"
                );

                return;

            }


            if (!subject.value.trim()) {

                alert(
                    "Please enter subject"
                );

                return;

            }


            if (!message.value.trim()) {

                alert(
                    "Please enter your message"
                );

                return;

            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    email.value.trim()
                )
            ) {

                alert(
                    "Please enter a valid email"
                );

                return;

            }


            alert(
                "Thank you! Your message has been submitted successfully."
            );


            name.value = "";
            email.value = "";
            subject.value = "";
            message.value = "";

        }
    );

}


const loginButton =
    document.getElementById(
        "loginButton"
    );


const signupButton =
    document.getElementById(
        "signupButton"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


const loggedIn =
    localStorage.getItem(
        "smartParkLoggedIn"
    );


if (
    loggedIn === "true"
) {

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