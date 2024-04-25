

//populate dropdown menus
document.addEventListener('DOMContentLoaded', function(){
    populateDates();
    populateTimes();
    populateHeads();
});
//heads dropdown
function populateHeads(){
    const headsSelect = document.getElementById('heads');
    for(let i =1; i<=10;i++){
        headsSelect.options[headsSelect.options.length] = new Option(i,i);
    }
}
//dates dropdown
function populateDates(){
    const dateSelect = document.getElementById('resDate');
    const today = new Date();
    for(let i = 0;i<=6;i++){
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() +i);
        const option = new Date(futureDate).toISOString().split('T')[0];
        dateSelect.options[dateSelect.options.length] = new Option(option, option);
    }
}

//time dropdown
function populateTimes(){
    const timeSelect = document.getElementById('resTime');
    const openingTime = 15; //3pm
    const closingTIme = 21.5 //9:30pm
    for(let hour = openingTime; hour<=closingTIme;hour+=0.5){
        const time = hour<10 ? `0${hour}:00` : `${hour}:00`;
        if(hour != Math.floor(hour)){
            const prevHour = Math.floor(hour);
            timeSelect.options[timeSelect.options.length] = new Option(`${prevHour}:30`, `${prevHour}:30`);
        }else{
            timeSelect.options[timeSelect.options.length] = new Option(time, time);
        }
    }
}

//form submission
function submitReservation(formData){
    fetch('http://localhost:3000/api/reservations',{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(formData),
        mode: 'cors'
    })
    .then(response =>{
        if(response.ok) return response.json();
        throw new Error('Network response was not ok');
    })
    .then(data =>{
        console.log('Success:',data);
        alert('Reservation submitted successfully');
        document.getElementById('reservationForm').reset();
    })
    .catch(error =>{
        console.error('Error:',error);
        alert('Error making reservation');
    })
}
//eventlistener for submit
document.getElementById('reservationForm').addEventListener('submit', function(event){
    event.preventDefault();

    //collect data from form
    const formData = {
        customerName: document.getElementById('customerName').value,
        customerPhone: document.getElementById('customerNumber').value,
        resDate: document.getElementById('resDate').value,
        resTime: document.getElementById('resTime').value,
        heads: document.getElementById('heads').value
    };
    submitReservation(formData);
});