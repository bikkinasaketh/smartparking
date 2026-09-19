
let userName = document.getElementById("userName");
let logoutButton = document.getElementById("logoutButton");

let viewBookingButton = document.getElementById("viewBookingButton");
let returnCarButton = document.getElementById("returnCarButton");

let bookingDetails = document.getElementById("bookingDetails");

let profileButton = document.getElementById("profileButton");
let profileDetails = document.getElementById("profileDetails");

let profileFirstName = document.getElementById("profileFirstName");
let profileLastName = document.getElementById("profileLastName");
let profileEmail = document.getElementById("profileEmail");

let returnSection = document.getElementById("returnSection");
let returnForm = document.getElementById("returnForm");


let loggedIn = localStorage.getItem("smartParkLoggedIn");
let savedUser = localStorage.getItem("smartParkUser");


if (loggedIn !== "true" || savedUser === null) {

    window.location.href = "login.html";

}


let user = JSON.parse(savedUser);


userName.textContent = user.firstName;


profileFirstName.textContent = user.firstName;
profileLastName.textContent = user.lastName;
profileEmail.textContent = user.email;


function getBooking() {

    let savedBooking =
        localStorage.getItem("smartParkBooking");

    if (savedBooking === null) {
        return null;
    }

    return JSON.parse(savedBooking);

}


function showBooking() {

    let booking = getBooking();

    if (booking === null || booking.status === "completed") {

        bookingDetails.innerHTML = `
            <div class="no-booking">
                <h3>No Active Booking</h3>
                <p>You don't have an active parking booking.</p>
            </div>
        `;

        return;
    }


    bookingDetails.innerHTML = `
        <div class="booking-card">

            <h3>Active Parking Booking</h3>

            <p>
                <strong>Parking Area:</strong>
                ${booking.parking}
            </p>

            <p>
                <strong>Location:</strong>
                ${booking.location}
            </p>

            <p>
                <strong>Parking Slot:</strong>
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
                <strong>Vehicle Number:</strong>
                ${booking.vehicle}
            </p>

            <p>
                <strong>Price:</strong>
                ₹${booking.price} / hour
            </p>

            <p class="booking-status">
                Status: Active
            </p>

        </div>
    `;

}


if (viewBookingButton) {

    viewBookingButton.addEventListener("click", function () {

        showBooking();

        document.getElementById("bookingSummary")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

}


if (returnCarButton) {

    returnCarButton.addEventListener("click", function () {

        let booking = getBooking();

        if (booking === null || booking.status === "completed") {

            alert("You don't have an active booking.");

            return;
        }


        returnForm.innerHTML = `

            <div class="return-card">

                <h2>Return Your Car</h2>

                <p>
                    Enter your booking details to release your parking slot.
                </p>


                <div class="return-field">

                    <label for="returnVehicle">
                        Vehicle Number
                    </label>

                    <input
                        type="text"
                        id="returnVehicle"
                        placeholder="Enter vehicle number"
                    >

                </div>


                <div class="return-field">

                    <label for="returnSlot">
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
                    class="return-button"
                >
                    Release Slot
                </button>

                <p id="returnMessage"></p>

            </div>

        `;


        returnSection.scrollIntoView({
            behavior: "smooth"
        });


        let releaseSlotButton =
            document.getElementById("releaseSlotButton");


        releaseSlotButton.addEventListener("click", function () {

            releaseParkingSlot();

        });

    });

}


function releaseParkingSlot() {

    let vehicle =
        document.getElementById("returnVehicle")
            .value
            .trim();

    let slot =
        document.getElementById("returnSlot")
            .value
            .trim()
            .toUpperCase();


    if (vehicle === "") {

        alert("Please enter vehicle number");

        return;

    }


    if (slot === "") {

        alert("Please enter parking slot");

        return;

    }


    let booking = getBooking();


    if (booking === null) {

        alert("No booking found");

        return;

    }


    if (booking.status === "completed") {

        alert("This booking is already completed");

        return;

    }


    if (
        vehicle.toLowerCase() !==
        booking.vehicle.toLowerCase()
    ) {

        alert("Vehicle number does not match");

        return;

    }


    if (
        slot.toLowerCase() !==
        booking.slot.toLowerCase()
    ) {

        alert("Parking slot does not match");

        return;

    }


    let savedSlots =
        localStorage.getItem("smartParkSlots");


    if (savedSlots === null) {

        alert("Parking slot data not found");

        return;

    }


    let slotData =
        JSON.parse(savedSlots);


    let parkingSlots =
        slotData[booking.parking];


    if (!parkingSlots) {

        alert("Parking area not found");

        return;

    }


    for (let i = 0; i < parkingSlots.length; i++) {

        if (
            parkingSlots[i].number ===
            booking.slot
        ) {

            parkingSlots[i].status = "available";

            break;

        }

    }


    localStorage.setItem(
        "smartParkSlots",
        JSON.stringify(slotData)
    );


    booking.status = "completed";


    localStorage.setItem(
        "smartParkBooking",
        JSON.stringify(booking)
    );


    returnForm.innerHTML = `

        <div class="success-card">

            <h2>Car Returned Successfully!</h2>

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


    showBooking();

}


if (profileButton) {

    profileButton.addEventListener("click", function () {

        profileDetails.scrollIntoView({
            behavior: "smooth"
        });

    });

}


if (logoutButton) {

    logoutButton.addEventListener("click", function () {

        localStorage.removeItem("smartParkLoggedIn");
        localStorage.removeItem("smartParkUserName");

        window.location.href = "login.html";

    });

}



