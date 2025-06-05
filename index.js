const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));


// Creating connection with database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'new',
    password: 'Atharva@2004',
});

app.get("/", (req, res) => {
    let q = "SELECT COUNT(*) FROM user";

    try {
        connection.query(q, (err, result) => {
            if (err) throw err
            let count = result[0]["COUNT(*)"];
            res.send(count);
        })
    } catch (err) {
        console.log("Error")
    };
});

app.get('/user', (req, res) => {
    let q1 = "SELECT COUNT(*) FROM user";
    let q2 = "SELECT * FROM user";

    connection.query(q1, (err1,result) => {
        if(err1){
            console.log("error in Count query.")
        };
        let count = result[0]["COUNT(*)"]; // OR result1[0].total
        
        connection.query(q2,(err2,users) => {
            if(err2)
                console.log("Error in User query", err2);

            res.render("user.ejs",{count, users});
        })


    })

});

app.get("/user/new", (req,res) => {
    res.render("new.ejs");
});

app.post("/user", (req,res) => {
    let {username, email, password} = req.body;
    let id = uuidv4();;

    let q = 'INSERT INTO user (id, username, email, password) VALUES (?,?,?,?)';
    let data = [id, username, email, password];
    try {
        connection.query(q, data, (err, result) => {
            res.redirect("/user");
        })
    } catch (err) {
        console.log("Error")
    };
})

app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("edit.ejs", { user });
            console.log(user.password);
        })
    } catch (err) {
        console.log("Error")
    };
});

app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password: newPass, username: newUsername } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;


    try {
        connection.query(q, (err, result) => {
            if (err) throw err
            let user = result[0];

            if (newPass != user.password) {
                console.log("Wrong Password");
            } else {
                let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
                try {
                    connection.query(q2, (err, result) => {
                        if (err) throw err
                        res.redirect("/user");
                    })
                } catch (err) {
                    console.log("Error")
                };
            }
        })
    } catch (err) {
        console.log("Error")
    };
});

app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err
            let user = result[0];
            res.render("delete.ejs", { user });
            console.log(user.username);
            console.log(user.password);
        })
    } catch (err) {
        console.log("Error")
    };
})

app.delete("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password: newPass, username: newUsername } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];

            if (newPass != user.password) {
                console.log("Wrong Password");
            } else if (newUsername != user.username) {
                console.log("Wrong Username")
            } else {
                q2 = `DELETE FROM user WHERE id='${user.id}'`;
                try {
                    connection.query(q2, (err, result) => {
                        if (err) throw err;
                        res.redirect("/user");
                    })
                } catch (err) {
                    console.log("Error Found: ", err);
                }
            };

        })
    } catch (err) {
        console.log("Error Found: ", err);
    }
});


app.listen(port, () => {
    console.log("Listening on port 8080");
});


// let q = "INSERT INTO user (id, username, email, password) VALUES ?";

// try {
//     connection.query(q, (err, result) => {
//         if(err) throw err
//         console.log(result);
//     })
// } catch (err) {
//     console.log("Error")
// };

// connection.end();