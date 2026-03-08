const firebaseConfig = {
  apiKey: "AIzaSyAft_RV4oxTLJrmKJ6URmPjILJW7pF3rhs",
  authDomain: "movietickectbooking.firebaseapp.com",
  databaseURL: "https://movietickectbooking-default-rtdb.firebaseio.com",
  projectId: "movietickectbooking",
  storageBucket: "movietickectbooking.firebasestorage.app",
  messagingSenderId: "626045559812",
  appId: "1:626045559812:web:6ede63b169ce098d98c151",
  measurementId: "G-SRKHT6MR4N"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
 
 
const seatContainer = document.getElementById("seat-container");
const totalSeats = 40;
let selectedSeats = [];
const pricePerSeat = 20;
 
const movieSelect = document.getElementById("movie");
const timeSelect = document.getElementById("time");
const dateSelect=document.getElementById("date");
 
   
    // Create seats
    function createSeats() {
      seatContainer.innerHTML = "";
      selectedSeats = [];
      for (let i = 1; i <= totalSeats; i++) {
        const seat = document.createElement("button");
        seat.id = `seat-${i}`;
        seat.innerText = i;
        seat.classList.add("seat");
        seat.addEventListener("click", handleSeatClick);
        seatContainer.appendChild(seat);
      }
    }
 
    // Check booked seats for movie & time
    function loadBookedSeats() {
      const path = `bookings/${movieSelect.value}/${timeSelect.value}/${dateSelect.value}`;
      db.ref(path).once("value", snapshot => {
        const booked = snapshot.val();
        if (booked) {
          Object.keys(booked).forEach(seatId => {
            const seat = document.getElementById(seatId);
            if (seat) {
              seat.classList.add("booked");
              seat.disabled = true;
              seat.removeEventListener("click", handleSeatClick);
            }
          });
        }
      });
    }
 
    function handleSeatClick(e) {
      const seat = e.target;
      const seatId = seat.id;
      if (seat.classList.contains("booked")) return;
 
      if (seat.classList.contains("selected")) {
        seat.classList.remove("selected");
        selectedSeats = selectedSeats.filter(id => id !== seatId);
      } else {
        seat.classList.add("selected");
        selectedSeats.push(seatId);
      }
    }
 
    function showBill() {
      if (selectedSeats.length === 0) {
        alert("Please select at least one seat.");
        return;
      }
 
      const total = selectedSeats.length * pricePerSeat;
      const movie = movieSelect.value;
      const time = timeSelect.value;
      const date=dateSelect.value;
 
      document.getElementById("bill-details").innerHTML = `
        <strong>Movie:</strong> ${movie}<br>
        <strong>Show Time:</strong> ${time}<br>
        <strong>Show Date:</strong> ${date}<br>
        <strong>Seats:</strong> ${selectedSeats.join(", ")}<br>
        <strong>Price per seat:</strong> USD${pricePerSeat}<br>
        <strong>Total:</strong> USD${total}
      `;
 
      document.getElementById("overlay").style.display = "block";
      document.getElementById("bill-popup").style.display = "block";
    }
 
    function closePopup() {
      document.getElementById("overlay").style.display = "none";
      document.getElementById("bill-popup").style.display = "none";
    }
 
   
        // Reload on movie/time change
    movieSelect.addEventListener("change", () => {
      createSeats();
      loadBookedSeats();
    });
 
    timeSelect.addEventListener("change", () => {
      createSeats();
      loadBookedSeats();
    });
 
    // Initial Load
    createSeats();
    loadBookedSeats();

    function makePayment() {
      closePopup();
      setTimeout(() =>{
        alert("Payment succesful");
        const userEmail = localStorage.getItem("email");
        const userName = localStorage.getItem("sanvinayak148@gmail.com");
        const total=selectedSeats.length*pricePerSeat;

      const emailParams = {
        user_name: userName,
        to_email: userEmail,
        movie_name: movieSelect.value,
        show_date: dateSelect.value,
        show_time: timeSelect.value,
        seat_list: selectedSeats.join(", "),
        amount: total
      };
      console.log("sending with:", emailParams);

      emailjs.send("service_m6h9pdr", "template_thpgypq", emailParams)
      .then(() => {
        alert("booking email sent");
        window.location.href = "thankyou.html"
      })
      .catch(() =>{
        alert("failed to send email:", error);
        
      });

      const bookingId = Date.now();
      db.ref("bookings/" + bookingId).set({
        ...emailParams,
        status:"confirmed"
      });

      const movie = movieSelect.value;
      const time =timeSelect.value;
      const date= dateSelect.value;
      const path = `bookings/${movie}/${time}/${date}`;

      selectedSeats.forEach(seatId =>{
        db.ref(`${path}/${seatId}`).set(true);
        seat.classList.remove("selected");
        seat.classList.add("booked");
        seat.disabled=true;
        seat.removeEventListener("click", handleSeatClick);
      });

      selectedSeats=[];
      }, 1000);
    }

    movieSelect.addEventListener("change", () =>{
      createSeats();
      loadBookedSeats();
    });

    timeSelect.addEventListener("change", () =>{
      createSeats();
      loadBookedSeats();
    });

    createSeats();
    loadBookedSeats();