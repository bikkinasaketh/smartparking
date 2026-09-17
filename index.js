let searchBtn = document.getElementById("searchBtn");
let parkingResults = document.getElementById("parkingResults");

let parkingData = [
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

let savedSlots = localStorage.getItem("smartParkSlots");

let slotData = savedSlots
    ? JSON.parse(savedSlots)
    : {};

for (let i = 0; i < parkingData.length; i++) {

    let parkingName = parkingData[i].name;

    if (!slotData[parkingName]) {

        slotData[parkingName] = [];

        for (let j = 1; j <= parkingData[i].total; j++) {

            slotData[parkingName].push({
                number: "A" + String(j).padStart(2, "0"),
                status: "available"
            });
        }
    }
}

localStorage.setItem(
    "smartParkSlots",
    JSON.stringify(slotData)
);


if (searchBtn) {

    searchBtn.addEventListener("click", function () {

        let location =
            document.getElementById("location").value.trim();

        let date =
            document.getElementById("date").value;

        let time =
            document.getElementById("time").value;


        if (location === "") {

            alert("Please enter your location");
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


        let results = [];


        for (let i = 0; i < parkingData.length; i++) {

            if (
                parkingData[i].location.toLowerCase() ===
                location.toLowerCase()
            ) {

                results.push(parkingData[i]);

            }
        }


        if (results.length === 0) {

            parkingResults.innerHTML = `
                <p>No parking found for this location.</p>
            `;

            return;

        }


        parkingResults.innerHTML = "";


        for (let i = 0; i < results.length; i++) {

            let parking = results[i];

            let slots =
                slotData[parking.name];

            let availableCount = 0;


            for (let j = 0; j < slots.length; j++) {

                if (slots[j].status === "available") {

                    availableCount++;

                }
            }


            let status =
                availableCount > 0
                    ? "Available"
                    : "Full";


            parkingResults.innerHTML += `

                <div class="parking-card">

                    <div class="parking-card-top">

                        <div>

                            <span>
                                Parking Area
                            </span>

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
                        data-name="${parking.name}"
                    >
                        View Slots
                    </button>

                </div>

            `;
        }


        let viewButtons =
            document.querySelectorAll(".park-button");


        for (let i = 0; i < viewButtons.length; i++) {

            viewButtons[i].addEventListener(
                "click",
                function () {

                    let parkingName =
                        this.getAttribute("data-name");

                    showSlots(parkingName);

                }
            );
        }

    });
}


function showSlots(parkingName) {

    selectedParking = null;
    selectedSlot = null;


    for (let i = 0; i < parkingData.length; i++) {

        if (parkingData[i].name === parkingName) {

            selectedParking =
                parkingData[i];

            break;
        }
    }


    if (selectedParking === null) {

        return;

    }


    let slots =
        slotData[selectedParking.name];


    let slotsHTML = "";


    for (let i = 0; i < slots.length; i++) {

        if (slots[i].status === "occupied") {

            slotsHTML += `

                <button
                    class="slot occupied"
                    disabled
                >
                    ${slots[i].number}
                </button>

            `;

        } else {

            slotsHTML += `

                <button
                    class="slot available-slot"
                    data-slot="${slots[i].number}"
                >
                    ${slots[i].number}
                </button>

            `;
        }
    }


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


    let slotButtons =
        document.querySelectorAll(".available-slot");


    for (let i = 0; i < slotButtons.length; i++) {

        slotButtons[i].addEventListener(
            "click",
            function () {

                selectSlot(this);

            }
        );
    }

}


function selectSlot(slotButton) {

    let allSlots =
        document.querySelectorAll(".available-slot");


    for (let i = 0; i < allSlots.length; i++) {

        allSlots[i].classList.remove("selected");

    }


    slotButton.classList.add("selected");


    selectedSlot =
        slotButton.getAttribute("data-slot");


    let bookingSection =
        document.getElementById("Booking");


    if (bookingSection) {

        bookingSection.scrollIntoView({
            behavior: "smooth"
        });

    }


    let bookingSelect =
        document.querySelector(".booking-field select");


    if (bookingSelect) {

        bookingSelect.value =
            selectedParking.name;

    }

}


let confirmButton =
    document.querySelector(".confirm-button");


if (confirmButton) {

    confirmButton.addEventListener(
        "click",
        function () {

            if (selectedParking === null) {

                alert(
                    "Please select a parking area"
                );

                return;

            }


            if (selectedSlot === null) {

                alert(
                    "Please select a parking slot"
                );

                return;

            }


            let bookingFields =
                document.querySelectorAll(
                    ".booking-field input"
                );


            let date =
                bookingFields[0].value;

            let time =
                bookingFields[1].value;

            let vehicle =
                bookingFields[2].value.trim();


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


            let slots =
                slotData[selectedParking.name];


            for (let i = 0; i < slots.length; i++) {

                if (
                    slots[i].number ===
                    selectedSlot
                ) {

                    slots[i].status =
                        "occupied";

                    break;

                }
            }


            localStorage.setItem(
                "smartParkSlots",
                JSON.stringify(slotData)
            );


            let booking = {

                parking:
                    selectedParking.name,

                location:
                    selectedParking.location,

                slot:
                    selectedSlot,

                date:
                    date,

                time:
                    time,

                vehicle:
                    vehicle,

                price:
                    selectedParking.price,

                status:
                    "active"

            };


            localStorage.setItem(
                "smartParkBooking",
                JSON.stringify(booking)
            );


            alert(
                "Booking Confirmed Successfully!"
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

            <div>
                <strong>Parking:</strong>
                ${booking.parking}
            </div>

            <div>
                <strong>Location:</strong>
                ${booking.location}
            </div>

            <div>
                <strong>Slot:</strong>
                ${booking.slot}
            </div>

            <div>
                <strong>Date:</strong>
                ${booking.date}
            </div>

            <div>
                <strong>Time:</strong>
                ${booking.time}
            </div>

            <div>
                <strong>Vehicle:</strong>
                ${booking.vehicle}
            </div>

            <div>
                <strong>Price:</strong>
                ₹${booking.price} / hour
            </div>

        </div>

    `;


    parkingResults.scrollIntoView({
        behavior: "smooth"
    });

}


let contactButton =
    document.querySelector(".contact-button");


if (contactButton) {

    contactButton.addEventListener(
        "click",
        function () {

            let contactInputs =
                document.querySelectorAll(
                    ".contact-field input"
                );


            let name =
                contactInputs[0]
                    .value
                    .trim();

            let email =
                contactInputs[1]
                    .value
                    .trim();

            let subject =
                contactInputs[2]
                    .value
                    .trim();

            let message =
                document.querySelector(
                    ".contact-field textarea"
                )
                    .value
                    .trim();


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


            alert(
                "Your message has been sent successfully!"
            );


            contactInputs[0].value = "";
            contactInputs[1].value = "";
            contactInputs[2].value = "";


            document.querySelector(
                ".contact-field textarea"
            ).value = "";

        }
    );
}


function showMyBooking() {

    let savedBooking =
        localStorage.getItem("smartParkBooking");


    if (savedBooking === null) {

        parkingResults.innerHTML = `

            <div class="booking-confirmation">

                <h2>
                    No Active Booking
                </h2>

                <p>
                    You don't have an active parking booking.
                </p>

            </div>

        `;

        return;

    }


    let booking =
        JSON.parse(savedBooking);


    if (booking.status === "completed") {

        parkingResults.innerHTML = `

            <div class="booking-confirmation">

                <h2>
                    No Active Booking
                </h2>

                <p>
                    Your previous parking booking is completed.
                </p>

            </div>

        `;

        return;

    }


    parkingResults.innerHTML = `

        <div class="booking-confirmation">

            <h2>
                My Booking
            </h2>

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
                id="returnCarButton"
                class="return-car-button"
            >
                Return Car
            </button>

        </div>

    `;


    let returnCarButton =
        document.getElementById(
            "returnCarButton"
        );


    returnCarButton.addEventListener(
        "click",
        function () {

            showReturnForm();

        }
    );


    parkingResults.scrollIntoView({
        behavior: "smooth"
    });

}


function showReturnForm() {

    parkingResults.innerHTML = `

        <div class="booking-confirmation">

            <h2>
                Return Your Car
            </h2>

            <p>
                Enter your booking details to release the parking slot.
            </p>


            <div class="return-field">

                <label>
                    Vehicle Number
                </label>

                <input
                    type="text"
                    id="returnVehicle"
                    placeholder="Enter vehicle number"
                >

            </div>


            <div class="return-field">

                <label>
                    Parking Slot
                </label>

                <input
                    type="text"
                    id="returnSlot"
                    placeholder="Enter slot number"
                >

            </div>


            <button
                id="releaseSlotButton"
                class="return-car-button"
            >
                Release Slot
            </button>

        </div>

    `;


    let releaseSlotButton =
        document.getElementById(
            "releaseSlotButton"
        );


    releaseSlotButton.addEventListener(
        "click",
        function () {

            releaseParkingSlot();

        }
    );

}


function releaseParkingSlot() {

    let vehicle =
        document
            .getElementById("returnVehicle")
            .value
            .trim();

    let slot =
        document
            .getElementById("returnSlot")
            .value
            .trim()
            .toUpperCase();


    if (vehicle === "") {

        alert(
            "Please enter vehicle number"
        );

        return;

    }


    if (slot === "") {

        alert(
            "Please enter parking slot"
        );

        return;

    }


    let savedBooking =
        localStorage.getItem("smartParkBooking");


    if (savedBooking === null) {

        alert(
            "No booking found"
        );

        return;

    }


    let booking =
        JSON.parse(savedBooking);


    if (booking.status === "completed") {

        alert(
            "This booking is already completed"
        );

        return;

    }


    if (
        vehicle.toLowerCase() !==
        booking.vehicle.toLowerCase()
    ) {

        alert(
            "Vehicle number does not match"
        );

        return;

    }


    if (
        slot.toLowerCase() !==
        booking.slot.toLowerCase()
    ) {

        alert(
            "Parking slot does not match"
        );

        return;

    }


    let slots =
        slotData[booking.parking];


    for (let i = 0; i < slots.length; i++) {

        if (
            slots[i].number ===
            booking.slot
        ) {

            slots[i].status =
                "available";

            break;

        }

    }


    localStorage.setItem(
        "smartParkSlots",
        JSON.stringify(slotData)
    );


    booking.status =
        "completed";


    localStorage.setItem(
        "smartParkBooking",
        JSON.stringify(booking)
    );


    alert(
        "Car returned successfully. Slot is now available!"
    );


    parkingResults.innerHTML = `

        <div class="booking-confirmation">

            <h2>
                Car Returned Successfully!
            </h2>

            <p>
                Your parking slot
                <strong>${booking.slot}</strong>
                is now available.
            </p>

            <p>
                Thank you for using SmartPark.
            </p>

        </div>

    `;


    parkingResults.scrollIntoView({
        behavior: "smooth"
    });

}


let myBookingButton =
    document.getElementById("myBookingButton");


if (myBookingButton) {

    myBookingButton.addEventListener(
        "click",
        function () {

            showMyBooking();

        }
    );

}