const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change to your MySQL username
    password: 'S@i32002', // Change to your MySQL password
    database: 'dormitorysystem', // Change to your database name
    // waitForConnections: true,
    // connectionLimit: 10,
    // queueLimit: 0
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('MySQL connected');
});

// Registration endpoint
app.post('/api/tenantregister', async (req, res) => {
    const { username, gender, email, mobile, password} = req.body;

    // Validate input
    if (!username || !gender || !email || !mobile || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the user already exists
    db.query('SELECT * FROM tenant WHERE mobile = ?', [mobile], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error.' });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ message: 'Account already registered.' });
        }

        // if (password !== confirmPassword) {
        //     return res.status(400).json({ message: 'Passwords do not match.' });
        // }

        try {
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10); // Use a higher salt rounds for security

            // Insert new user
            db.query('INSERT INTO tenant (username, gender, email,mobile,password) VALUES (?, ?, ?, ?, ?)', 
                [username, gender, email,mobile,hashedPassword], 
                (err) => {
                    if (err) {
                        console.error('Error registering user:', err);
                        return res.status(500).json({ message: 'Error registering user.' });
                    }
                    res.status(201).json({ message: 'User registered successfully!' });
                });
        } catch (error) {
            console.error('Error hashing password:', error);
            res.status(500).json({ message: 'Error processing request.' });
        }
    });
});

// Login endpoint
app.post('/api/tenantlogin', async (req, res) => {
    const { mobileNumber, password } = req.body;

    // Validate input
    if (!mobileNumber || !password) {
        return res.status(400).json({ message: 'Mobile number and password are required.' });
    }

    // Check if the user exists
    db.query('SELECT * FROM tenant WHERE mobile = ?', [mobileNumber], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found. Please register.' });
        }

        const user = results[0];

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password. Please try again.' });
        }

        res.status(200).json({ message: 'Login successful!' });
    });
});




// Registration endpoint
app.post('/api/renterregister', async (req, res) => {
    const { username, gender, email, mobile, password} = req.body;

    // Validate input
    if (!username || !gender || !email || !mobile || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the user already exists
    db.query('SELECT * FROM renter WHERE mobile = ?', [mobile], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error.' });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ message: 'Account already registered.' });
        }

        // if (password !== confirmPassword) {
        //     return res.status(400).json({ message: 'Passwords do not match.' });
        // }

        try {
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10); // Use a higher salt rounds for security

            // Insert new user
            db.query('INSERT INTO renter (username, gender, email,mobile,password) VALUES (?, ?, ?, ?, ?)', 
                [username, gender, email,mobile,hashedPassword], 
                (err) => {
                    if (err) {
                        console.error('Error registering user:', err);
                        return res.status(500).json({ message: 'Error registering user.' });
                    }
                    res.status(201).json({ message: 'User registered successfully!' });
                });
        } catch (error) {
            console.error('Error hashing password:', error);
            res.status(500).json({ message: 'Error processing request.' });
        }
    });
});

// Login endpoint
app.post('/api/renterlogin', async (req, res) => {
    const { mobileNumber, password } = req.body;

    // Validate input
    if (!mobileNumber || !password) {
        return res.status(400).json({ message: 'Mobile number and password are required.' });
    }

    // Check if the user exists
    db.query('SELECT * FROM renter WHERE mobile = ?', [mobileNumber], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found. Please register.' });
        }

        const user = results[0];

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password. Please try again.' });
        }
        

        res.status(200).json({ message: 'Login successful!' });
    });
});




// Registration endpoint
app.post('/api/dormitoriesadd', (req, res) => {
    const { dormitoryId,
        dormitoryName,
        searchLocation,
        dormitoryGender,
        address,
        district,
        state,
        pincode,
        location,
        dormAvailable,
        mobileNumber} = req.body;

    // Validate input
    if (!dormitoryId||
        !dormitoryName ||
        !searchLocation||
        !dormitoryGender||
        !address||
        !district||
        !state||
        !pincode||
        !location||
        !dormAvailable||
    !mobileNumber) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the user already exists
    db.query('SELECT * FROM dormitorydetails WHERE dormitoryId = ?', [dormitoryId],(err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error.' });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ message: 'Account already registered.' });
        }

        // if (password !== confirmPassword) {
        //     return res.status(400).json({ message: 'Passwords do not match.' });
        // }
  
        
            // Hash the password before saving
            // const hashedPassword = await bcrypt.hash(password, 10); // Use a higher salt rounds for security

            // Insert new user
            db.query(`INSERT INTO dormitorydetails (dormitoryId,dormitoryName,searchLocation,dormitoryGender,address,district,state,pincode,location,dormAvailable,renter_mobile) VALUES (?,?,?,?,?,?,?,?,?,?,?)`, 
                [dormitoryId,
                    dormitoryName,
                    searchLocation,
                    dormitoryGender,
                    address,
                    district,
                    state,
                    pincode,
                    location,
                    dormAvailable,
                    mobileNumber,
                    ], 
                (err,result) => {
                    if (err) {
                        console.error('Error in uploading details:', err);
                        return res.status(500).json({ message: 'Error in uploading details.' });
                    }
                    res.status(201).json({ message: 'User details uploaded successfully!' });
                });
        
        });
    
});




//addroom
app.post('/api/addroom', async (req, res) => {
    const { roomNumber, capacity, currentAvailability, availableFrom, monthlyRate, roomType, depositRequired, duration, description, amenities, dormitoryId } = req.body;

    // Validate input
    if (!roomNumber || !capacity || !currentAvailability || !availableFrom || !monthlyRate || !roomType || !depositRequired || !duration || !description || !amenities || !dormitoryId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // 1️⃣ Check if the room number already exists in the same dormitory
        db.query('SELECT * FROM addroom WHERE dormitoryId = ? AND roomNumber = ?', [dormitoryId, roomNumber], (err, roomResults) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ message: 'Database error while checking room number.' });
            }

            if (roomResults.length > 0) {
                return res.status(400).json({ message: 'Room number already exists in this dormitory.' });
            }

            // 2️⃣ Insert the new room
            db.query('INSERT INTO addroom (roomNumber, capacity, currentAvailability, availableFrom, monthlyRate, roomType, depositRequired, duration, descriptions, amenities, dormitoryId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [roomNumber, capacity, currentAvailability, availableFrom, monthlyRate, roomType, depositRequired, duration, description, amenities, dormitoryId], 
                (err) => {
                    if (err) {
                        console.error('Error in uploading details:', err);
                        return res.status(500).json({ message: 'Error in uploading details.' });
                    }
                    res.status(201).json({ message: 'Room details uploaded successfully!' });
                }
            );
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Error processing request.' });
    }
});

 



// // GET: Retrieve a specific dormitory by ID
app.get('/api/dormitoriesList', async (req, res) => {
    const dormitoryId = req.params.id;
    const query = 'SELECT * FROM dormitorydetails WHERE dormAvailable = "Available"';
    db.query(query, [dormitoryId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error retrieving dormitory details', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Dormitory not found' });
        return res.json(results);
    });
});


// app.post('/api/dormitoriesavailable', async(req) => {
//         const {mobileNumber} = req.body;
//         let number={mobileNumber};  
//  });

// app.get('/api/dormitoriesavailable', async (req, res) => {
    
//     const dormitoryId = req.params.id;
//     const query = 'SELECT * FROM dormitorydetails WHERE dormAvailable = "Available"';
//     db.query(query, [dormitoryId], (err, results) => {
//         if (err) return res.status(500).json({ message: 'Error retrieving dormitory details', error: err });
//         if (results.length === 0) return res.status(404).json({ message: 'Dormitory not found' });
//         return res.json(results);
//     });
// });


// app.get('/api/dormitoriesavaialble', async (req, res) => {
//     const dormitoryId = req.params.id;
//     const query = 'SELECT * FROM dormitorydetails WHERE dormAvailable = "Available"';
//     db.query(query, [dormitoryId], (err, results) => {
//         if (err) return res.status(500).json({ message: 'Error retrieving dormitory details', error: err });
//         if (results.length === 0) return res.status(404).json({ message: 'Dormitory not found' });
//         return res.json(results);
//     });
// });

app.get('/api/dormitoriesavailable', async (req, res) => {
    const { mobileNumber } = req.query; // Get mobileNumber from query parameters
    console.log("mobile:",mobileNumber);
    if (!mobileNumber) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    const query = `SELECT * FROM dormitorydetails WHERE renter_mobile = ${mobileNumber}`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving dormitory details:', err);
            return res.status(500).json({ message: 'Error retrieving dormitory details', error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No available dormitories found' });
        }
        return res.json(results);
    });
});
// // POST: Add new dormitory details
// app.post('/api/dormitoriesadd', (req, res) => {
//     const { dormitoryId, dormitoryName, searchLocation, dormitoryGender, address, district, state, pincode, location } = req.body;
//     const query = 'INSERT INTO dormitorydetails SET ?';
//     const values = { dormitoryId, dormitoryName, searchLocation, dormitoryGender, address, district, state, pincode, location };

//     db.query(query, values, (err, results) => {
//         if (err) return res.status(400).json({ message: 'Error saving dormitory details', error: err });
//         res.status(201).json({ message: 'Dormitory details saved successfully' });
//     });
// });

// // PUT: Update existing dormitory details
// app.put('/api/dormitoriesadd', (req, res) => {
//     const dormitoryId = req.params.id;
//     const { dormitoryName, searchLocation, dormitoryGender, address, district, state, pincode, location } = req.body;
//     const query = `
//         UPDATE dormitorydetails
//         SET dormitoryName = ?, searchLocation = ?, dormitoryGender = ?, address = ?, district = ?, state = ?, pincode = ?, location = ?
//         WHERE dormitoryId = ?
//     `;
//     const values = [dormitoryName, searchLocation, dormitoryGender, address, district, state, pincode, location, dormitoryId];

//     db.query(query, values, (err, results) => {
//         if (err) return res.status(400).json({ message: 'Error updating dormitory details', error: err });
//         if (results.affectedRows === 0) return res.status(404).json({ message: 'Dormitory not found' });
//         res.json({ message: 'Dormitory details updated successfully' });
//     });
// });





app.get('/api/dormitories/:dormitoryId', (req, res) => {
    const dormitoryId = req.params.dormitoryId; // Ensure dormitoryId is defined here
    const query = 'SELECT * FROM dormitorydetails WHERE dormitoryId = ?';

    db.query(query, [dormitoryId], (err, results) => {
        if (err) {
            console.error('Error fetching dormitory details:', err);
            return res.status(500).json({ error: 'Database query failed.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Dormitory not found.' });
        }
        res.json(results[0]);
    });
});






app.put('/api/dormitories/:dormitoryId', (req, res) => {
    const dormitoryId = req.params.dormitoryId; // Ensure dormitoryId is defined here
    const {
        dormitoryName,
        searchLocation,
        dormitoryGender,
        address,
        district,
        state,
        pincode,
        location,
        dormAvailable
    } = req.body;

    const query = `
        UPDATE dormitorydetails SET
        dormitoryName = ?,
        searchLocation = ?,
        dormitoryGender = ?,
        address = ?,
        district = ?,
        state = ?,
        pincode = ?,
        location = ?,
        dormAvailable = ?
        WHERE dormitoryId = ?`;

    db.query(query, [
        dormitoryName,
        searchLocation,
        dormitoryGender,
        address,
        district,
        state,
        pincode,
        location,
        dormAvailable,
        dormitoryId // Use dormitoryId as the last parameter
    ], (err, results) => {
        if (err) {
            console.error('Error updating dormitory:', err);
            return res.status(500).json({ error: 'Database update failed.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Dormitory not found.' });
        }
        res.status(200).json({ message: 'Dormitory details updated successfully.' });
    });
});

app.put('/api/updateDormitory', (req, res) => {
    const dormitoryData = req.body;

    const {
        dormitoryId,
        dormitoryName,
        searchLocation,
        dormitoryGender,
        address,
        district,
        state,
        pincode,
        location,
        dormAvailable
    } = dormitoryData;

    // Update query
    const updateQuery = `
        UPDATE dormitorydetails 
        SET dormitoryName = ?, 
            searchLocation = ?, 
            dormitoryGender = ?, 
            address = ?, 
            district = ?, 
            state = ?, 
            pincode = ?, 
            location = ?, 
            dormAvailable = ? 
        WHERE dormitoryId = ?;
    `;

    const values = [
        dormitoryName,
        searchLocation,
        dormitoryGender,
        address,
        district,
        state,
        pincode,
        location,
        dormAvailable,
        dormitoryId
    ];

    db.query(updateQuery, values, (err, result) => {
        if (err) {
            console.error("Error updating dormitory data:", err);
            return res.status(500).json({ message: "Database update failed", error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Dormitory not found" });
        }

        res.status(200).json({ message: "Dormitory updated successfully" });
    });
});




app.put('/api/updateroom', (req, res) => {
    const roomData = req.body;
    const dormitoryId= req.query.dormitoryId;

    const {
        roomNumber,
        capacity,
        currentAvailability,
        availableFrom,
        monthlyRate,
        roomType,
        depositRequired,
        duration,
        descriptions,
        amenities
    } = roomData;

    if (!dormitoryId || !roomNumber) {
        return res.status(400).json({ message: "Missing dormitoryId or roomNumber in request" });
    }

    // Convert amenities to JSON or comma-separated string
    const formattedAmenities = JSON.stringify(amenities);

    // Update query
    const updateQuery = `
        UPDATE addroom 
        SET 
            capacity = ?,
            currentAvailability = ?,
            availableFrom = ?,
            monthlyRate = ?,
            roomType = ?,
            depositRequired = ?,
            duration = ?,
            descriptions = ?,
            amenities = ?
        WHERE dormitoryId = ? AND roomNumber = ?;
    `;

    const values = [
        capacity,
        currentAvailability,
        availableFrom,
        monthlyRate,
        roomType,
        depositRequired,
        duration,
        descriptions,
        formattedAmenities, // Correctly formatted amenities
        dormitoryId,
        roomNumber
    ];

    db.query(updateQuery, values, (err, result) => {
        if (err) {
            console.error("Error updating room data:", err);
            return res.status(500).json({ message: "Database update failed", error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json({ message: "Room updated successfully" });
    });
});






app.get('/api/tenantrooms', (req, res) => {
    const dormitoryId = req.query.dormitoryId;

    if (!dormitoryId) {
        return res.status(400).json({ error: 'Dormitory ID is required.' });
    }

    const query = `
        SELECT *
        FROM addroom
        WHERE dormitoryId = ? AND currentAvailability > 0
    `;

    db.query(query, [dormitoryId], (err, results) => {
        if (err) {
            console.error('Error fetching rooms:', err);
            return res.status(500).json({ error: 'Failed to fetch rooms' });
        }
        res.json(results);
    });
});

app.get('/api/rooms/:roomNumber/:dormitoryId', (req, res) => {
    const { roomNumber, dormitoryId } = req.params;
  
    // Query to fetch room details by roomNumber and dormitoryId
    const query = 'SELECT * FROM addroom WHERE roomNumber = ? AND dormitoryId = ?';
    db.query(query, [roomNumber, dormitoryId], (err, results) => {
      if (err) {
        console.error('Error fetching room details:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      res.json(results[0]);  // Return the room details as a JSON response
    });
  });



app.get('/api/roomsavailable', async (req, res) => {
    const { dormitoryId } = req.query;
    console.log(dormitoryId);

    if (!dormitoryId) {
        return res.status(400).json({ error: 'Dormitory ID is required' });
    }

    const query = `SELECT * FROM addroom WHERE dormitoryId=${dormitoryId}`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving rooms details:', err);
            return res.status(500).json({ message: 'Error retrieving room details', error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No rooms available dormitories found' });
        }
        return res.json(results);
    });
});



//deleting rooms
app.delete('/api/deleteroom', (req, res) => {
    const { dormitoryId, roomNumber } = req.query;

    // Validate inputs
    if (!dormitoryId || !roomNumber) {
        return res.status(400).json({ error: 'Dormitory ID and Room Number are required.' });
    }

    if (isNaN(dormitoryId)) {
        return res.status(400).json({ error: 'Invalid Dormitory ID. It must be a number.' });
    }

    const deleteQuery = `
        DELETE FROM addroom 
        WHERE dormitoryId = ? AND roomNumber = ?
    `;

    db.query(deleteQuery, [dormitoryId, roomNumber], (err, result) => {
        if (err) {
            console.error('Error deleting room:', err);
            return res.status(500).json({ error: 'Failed to delete room. Please try again later.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Room not found. Please check the inputs.' });
        }

        res.status(200).json({ message: 'Room deleted successfully.' });
    });
});



//deleting dormitory

app.delete('/api/deletedormitory', (req, res) => {
    const { dormitoryId } = req.query;  // req.query if it's in URL params, req.body if in the body

    // Validate inputs
    if (!dormitoryId) {
        return res.status(400).json({ error: 'Dormitory ID is required.' });
    }

    if (isNaN(dormitoryId)) {
        return res.status(400).json({ error: 'Invalid Dormitory ID. It must be a number.' });
    }

    // Use two separate delete queries for each table
    const deleteRoomQuery = 'DELETE FROM addroom WHERE dormitoryId = ?';
    const deleteDormQuery = 'DELETE FROM dormitorydetails WHERE dormitoryId = ?';

    // Begin a transaction to ensure both deletes are executed together
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to start transaction.' });
        }

        db.query(deleteRoomQuery, [dormitoryId], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ error: 'Failed to delete room. Please try again later.' });
                });
            }

            db.query(deleteDormQuery, [dormitoryId], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: 'Failed to delete dormitory details. Please try again later.' });
                    });
                }

                // Commit the transaction if both deletes were successful
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: 'Transaction commit failed.' });
                        });
                    }
                    res.status(200).json({ message: 'Dormitory and associated room deleted successfully.' });
                });
            });
        });
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
