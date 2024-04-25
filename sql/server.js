const app = require('../backend/app');
const dbSetup = require('../backend/dbSetup');
const cron = require('node-cron');
const pool = require('../backend/pool');



//initialize db tables
dbSetup.initializeAdminTable();
dbSetup.initializeReservations();

const port = 3000;
app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
});


cron.schedule( '0 0 * * *', function(){
const today = new Date();
const lastWeekSameDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
const cleanupQuery = 'DELETE FROM Reservations WHERE resDate = ?';

pool.query(cleanupQuery, [lastWeekSameDay.toISOString().slice(0,10)], (error, results) =>{
    if(error){
        console.error('Error deleting old reservations:',error);
    }
    else{
        console.log('Old reservations cleared:', results.affectedRows);
    }
});
});



 