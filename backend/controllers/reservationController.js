const { head } = require('../app');
const pool = require('../pool');
const sanitizeHtml = require('sanitize-html');

exports.createReservation = (req, res) =>{

    let {  resDate, resTime, customerName, customerPhone, heads} = req.body;


customerName = sanitizeHtml(customerName);
customerPhone = sanitizeHtml(customerPhone);

    console.log('Request data:',req.body);
//say every res is 1h30mins, calc end time
let startTime = new Date(`${resDate}T${resTime}`);
let endTime = new Date(startTime.getTime() +90 *60000);

//convert endtime to sql
let endTimeFormatted = endTime.toISOString().slice(11,19);

//ensure res in 6 day time frame
const today = new Date();
const reservationDate = new Date(resDate);
const diffTime = Math.abs(reservationDate-today);
const diffDays =Math.ceil(diffTime / (1000*60*60*24));

if (diffDays > 6){
    return res.status(400).send('Reservations can only be made up to 6 days in advance.')
}
//query to check for total head in overlapping time
const overlapCheckQ = `SELECT SUM(heads) AS totalHeads FROM Reservations 
WHERE resDate = ? AND (resTime < DATE_ADD(?, INTERVAL 90 MINUTE) AND DATE_ADD(resTime, INTERVAL 90 MINUTE) > ?)`;

pool.query(overlapCheckQ, [resDate, resTime, resTime], (error, results) => {
    if (error) {
        console.error("Error during database query for overlap check:", error);
        return res.status(500).send('Error checking reservation availability.');
    }

    const currentHeads = results[0].totalHeads || 0;
    if (currentHeads + heads > 150) {
        return res.status(400).send('Cannot make reservation: Capacity exceeded.');
    }

    //insert res because is valid
    const sql = `INSERT INTO Reservations ( resDate, resTime, customerName, customerPhone,heads) 
    VALUES (?,?,?,?,?);`;

    pool.query(sql, [resDate, resTime, customerName, customerPhone, heads], (error, results) =>{
        if(error){
            return res.status(500).send('Error while making reservation.');
        }
        res.status(201).send({message: 'Reservation created successfully',reservationId: results.insertId});
    });
});
};



exports.getAllReservations = (req, res) =>{
    const sql = 'SELECT * FROM Reservations ORDER BY resDate ASC, resTime ASC';
    pool.query(sql, (error, results) =>{

    
    if(error){
        return res.status(500).send('Error retrieving reservations');
    }
    res.status(200).json(results);
});
};

exports.deleteReservation = (req, res) =>{
    const { id} = req.params;
    const sql = 'DELETE FROM Reservations WHERE resID = ?';

    pool.query(sql, [id], (error, results) =>{
        if(error){
            return res.status(500).send('Error deleted reservation.');
        }
        if(results.affectedRows === 0){
            return res.status(404).send('No reservation found with ID');
        }
        res.status(200).send({message: 'Reservation deleted successfully'});
    });
};

