const mysql = require('mysql');
const bcrypt = require('bcryptjs');
//setup connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'reservations',
    connectionLimit: 10
});



//make sure connected
 pool.getConnection((error, connection) => {
    if (error){
        console.error("Failed to connect to db:", error);
        return;
    }
    console.log("Db connection established.");
    connection.release();
 });

initializeAdminTable();
initializeReservations();


//funtion to initialize an Admin table
 function initializeAdminTable(){
    const adminTableQ = `CREATE TABLE IF NOT EXISTS Admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
    );`

    //get a connection from the pool
    pool.getConnection((error, connection) => {
        if(error){
            console.error("Error getting connection from the pool:", error);
            return;
        }
        //use the connection from the pool to query db
        connection.query(adminTableQ, (error, results) =>{
            if(error){
                console.error("Problem creating the Admin table", error);
                connection.release();
                return;
            }
            console.log("Admin table has been created or it already exists.");

            //insert initial admin user with user: admin , and a hashed password: password, if admin alr exists, update pass
            const passwordHash = bcrypt.hashSync('password', 10);
            const insertAdminQ = `INSERT INTO Admin (username, password_hash) VALUES ('admin','${passwordHash}') ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);`;

            //use connection from pool to query db and add admin user
            connection.query(insertAdminQ, (error, results) =>{
                if(error){
                    console.error("Error adding or updating Admin user:", error);
                }
                else{
                    console.log('Admin user created or updated successfully.');
                }
                ///release connnection
                connection.release();
            });
        });
    });
 }


 //function to initialize a monday table
 function initializeReservations(){
    const createResQ = `CREATE TABLE IF NOT EXISTS Reservations(
        resID INT AUTO_INCREMENT PRIMARY KEY,
        resDay ENUM('Monday', 'Tuesday', 'Wednesday','Thursday','Friday','Saturday', 'Sunday') NOT NULL,
        resDate DATE NOT NULL,
        resTime TIME NOT NULL,
        customerName VARCHAR(255) NOT NULL,
        customerPhone BIGINT NOT NULL,
        heads INT NOT NULL
    );`;

    //get connection from pool
    pool.getConnection((error, connection) =>{
        if(error){
            console.error("Error getting connection from pool:",error);
            return;
        }
        //use connection to query db
        connection.query(createResQ, (error, results)=>{
            //release connection back to pool
            connection.release();

            if(error){
                console.error("Problem creating the Reservation table.")
                return;
            }else{
            console.log("Reservation table has been created or already exists.");
            }
        });
    });
 }