
function fetchReservations(){
    fetch('http://localhost:3000/api/reservations',{
        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    })
    .then(response => response.json())
    .then(data => {
        const list = document.getElementById('reservationList');
        list.innerHTML = '';
        data.forEach(reservation =>{
            //get dates in better format
            const reservationDate = new Date(reservation.resDate);
            const formattedDate = reservationDate.toLocaleDateString('en-US',{
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            //get times in better format
            const reservationTime = reservation.resTime.split(':');
            const formattedTime = new Date();
            formattedTime.setHours(reservationTime[0],reservationTime[1],reservationTime[2]);
            const timeString = formattedTime.toLocaleTimeString('en-US',{
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });



            const li = document.createElement('li');
            li.textContent = `Reservation for ${reservation.customerName} at ${timeString} on ${formattedDate}, Party size: ${reservation.heads}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteReservation(reservation.resID);
            li.appendChild(deleteButton);
            list.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error fetching reservations:',error);
    });
}

function deleteReservation(resID){
    fetch(`http://localhost:3000/api/reservations/${resID}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`}
    })
    .then(response =>{
        if(response.ok){
            console.log('Reservation successfully deleted');
            fetchReservations()
        }else{
            throw new Error('Failed to delete reservation.');
        }
    })
    .catch(error =>{
        console.error('Error deleting reservation:', error);
    });
}
document.addEventListener('DOMContentLoaded',fetchReservations);