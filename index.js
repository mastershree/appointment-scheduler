import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import cors from "cors";
import moment from "moment";
import path from "path";

const app = express();

app.use(cors()); // Use this after the variable declaration
import mysql from "mysql";
import { emailRouter } from "./email.restRouter";

//create database connection

export const con = mysql.createPool({
  connectionLimit: 10,
  host: "sql12.freemysqlhosting.net",
  user: "sql12348970",
  password: "bKGtKL8YxX",
  database: "sql12348970",
  // socketPath: "/var/run/mysqld/mysqld.sock",
  port: 3306,
});
/*
const conn = mysql.createConnection(
  "mysql://sql12348970:bKGtKL8YxX@sql12.freemysqlhosting.net/sql12348970?debug=true"
);
*/

con.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  }
  if (connection) connection.release();
  return;
});

//const conn = mysql.createConnection(process.env.DATABASE_URL);

//connect to database
/* conn.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected...");
});
*/
const JWT_SECRET = "password";
// parse application/json
app.use(bodyParser.json());

console.log(__dirname);

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
/*
app.get("/app*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
*/
/*
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
*/

app.post("/auth/login", (req, res) => {
  let data = { email: req.body.email, password: req.body.password };
  let user;
  let sql =
    "SELECT name, email, password FROM users WHERE email='" + data.email + "'";
  let query2 = con.query(sql, (err, results) => {
    if (err) res.status(500).send("Error on the server.");
    user = results[0];
    if (!user) return res.status(404).send("No user found.");
    let passwordIsValid = bcrypt.compareSync(data.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send("Password is incorrect!!!");
    } else {
      res.send({ message: "Credentials shared are valid!!!", name: user.name });
    }
  });
});

//create user
app.post("/api/user/register", (req, res) => {
  let data = {
    name: req.body.name,
    email: req.body.email,
    password: "",
  };

  let password = "";
  console.log(req.body);

  let select = `select count(email) as count from users where email='${data.email}'`;
  let query1 = con.query(select, (err, results) => {
    if (err) res.status(500);
    let [row] = results;

    if (row.count === 1) {
      res.status(403).send("Email id already exist");
    } else {
      password = req.body.password;
      bcrypt.genSalt(10, function (err, salt) {
        if (err) throw err;
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) throw err;
          data.password = hash;
          let sql = "INSERT INTO users SET ?";
          let query2 = con.query(sql, data, (err, results) => {
            if (err) throw err;
            res.send(
              JSON.stringify({ status: 200, error: null, response: results })
            );
          });
        });
      });
    }
  });
});

//fetch event_types
app.get("/api/event_types/:user", (req, res) => {
  console.log("Api called");
  let select = `select id, title, durationMins as duration from EventTypes where createdBy='${req.params.user}'`;
  let query1 = con.query(select, (err, results) => {
    if (err) res.status(500);
    if (results) {
      res.send(results);
      //console.log("Event types: ", data);
    }
    //console.log("Show Event Types", results);
  });
});

//create event_type
app.post("/api/event_type/create", (req, res) => {
  let data = {
    title: req.body.title,
    durationMins: req.body.duration,
    createdBy: req.body.user,
  };

  // console.log(req.body);

  let select = `select count(title) as count from EventTypes 
  where title='${data.title}' and createdBy='${data.createdBy}'`;
  let query1 = con.query(select, (err, results) => {
    if (err) res.status(500);
    // console.log(results);
    let [row] = results;

    if (row.count === 1) {
      res.status(403).send("Event type already exists");
    } else {
      let sql = "INSERT INTO EventTypes SET ?";
      let query2 = con.query(sql, data, (err, results) => {
        if (err) res.status(500);
        if (results) {
          //    console.log(results);
          res.send("Event type created!!!");
        }
      });
    }
  });
});

//Edit event_type
app.put("/api/event_type/edit/:id", (req, res) => {
  // console.log("Editing");
  let sql =
    "UPDATE EventTypes SET title='" +
    req.body.title +
    "', durationMins='" +
    req.body.duration +
    "' WHERE id=" +
    req.params.id;
  let query = con.query(sql, (err, results) => {
    if (err) res.status(500);
    if (results) {
      //  console.log(results);
      res.send("Event type has been edited successfully!!!");
    }
  });
});

//Delete event_type
app.delete("/api/event_type/delete/:user/:title", (req, res) => {
  let sql =
    "DELETE FROM event_types WHERE title='" +
    req.params.title +
    "' and user='" +
    req.params.user +
    "'";
  let query = con.query(sql, (err, results) => {
    if (err) res.status(500);
    if (results) {
      //   console.log(results);
      res.send("Event type has been edited successfully!!!");
    }
  });
});

// Password reset

app.use("/reset_password", emailRouter);

// Get Schedule Events of user for current month

app.get("/api/schedule_events/:user", (req, res) => {
  let user = req.params.user;

  let cur_date = new Date();

  let curDate = cur_date.getDate();
  let curMonth = cur_date.getMonth() + 1;
  let curYear = cur_date.getFullYear();

  let nowDate = `${curYear}-${curMonth}-${curDate}`;

  let select1 = `select id from EventTypes where createdBy='${user}'`;

  let query1 = con.query(select1, (err, results) => {
    if (err) res.status(500);
    if (results) {
      //console.log(results);
      let events = "(";
      for (let a of results) {
        events = events + a.id + ",";
      }
      // console.log(events);

      events = events.substring(0, events.length - 1) + ")";

      console.log(events);

      let scheduled_events = {
        upcoming: [],
        past: [],
      };

      let select2 = `select e.title, DATE_FORMAT(date, '%W, %d %M %Y') as date, time_slot_start, time_slot_end, first_name, last_name 
 from ScheduledEvents s join EventTypes e on s.event=e.id where  event in ${events}
 and date >= '${nowDate}'`;

      console.log(select2);

      let query2 = con.query(select2, (err, results) => {
        if (err) res.status(500);
        if (results) {
          //   console.log("Upcoming:", results);
          // res.send(results);
          scheduled_events.upcoming = results;

          let select3 = `select e.title, DATE_FORMAT(date, '%W, %d %M %Y') as date, time_slot_start, time_slot_end, first_name, last_name 
          from ScheduledEvents s join EventTypes e on s.event=e.id where  event in ${events}
          and date < '${nowDate}'`;

          let query2 = con.query(select3, (err, results) => {
            if (err) res.status(500);
            if (results) {
              //  console.log("Past data:", results);
              scheduled_events.past = results;
              res.send(scheduled_events);
            }
          });
        }
      }); // End of second query
    }
  });
});

// Get time slots for given event
app.get("/api/schedule_events/:event/:duration", (req, res) => {
  //console.log("Getting scheduled events!!!");

  let eventId = req.params.event;

  let duration = req.params.duration;

  let timeSlot = [];

  let periodsInADay = moment.duration(1, "day").as("m");

  console.log("periodsInADay:", periodsInADay);

  let startTimeMoment = moment("10:00", "hh:mm");

  let stopTimeMoment = moment("19:00", "hh:mm");

  console.log("startTimeMoment", startTimeMoment);
  console.log("stopTimeMoment", stopTimeMoment);

  timeSlot.push(startTimeMoment.format("hh:mm A"));

  while (startTimeMoment < stopTimeMoment) {
    startTimeMoment.add(duration, "m");
    timeSlot.push(startTimeMoment.format("hh:mm A"));
  }
  /*
  for (let i = 0; i <= periodsInADay; i += duration) {
    startTimeMoment.add(i === 0 ? 0 : duration, "m");
    console.log(startTimeMoment);
    if (startTimeMoment < stopTimeMoment) {
      timeSlot.push(startTimeMoment.format("hh:mm A"));
    }
  }
*/

  console.log("Time slot:", timeSlot);

  let scheduled_events = [];
  /* [{
    "":{
    bookedSlot: [],
    availableSlot: [],
    
  }
  }
];
*/

  let cur_date = new Date();

  let curDate = cur_date.getDate();
  let curMonth = cur_date.getMonth() + 1;
  let curYear = cur_date.getFullYear();

  let nowDate = `${curYear}-${curMonth}-${curDate}`;

  let select = `select DATE_FORMAT(date,"%d/%m/%Y") as date, time_slot_start from ScheduledEvents where event=${eventId} 
 and date>=${nowDate} `;

  let query = con.query(select, (err, results) => {
    let events;
    if (err) res.status(500);
    if (results) {
      events = results.map((data) => {
        let date = data.date;
        console.log("date in db:", date);
        let time_slot = data.time_slot_start;

        let date_index = scheduled_events.findIndex((e) => e.date === date);

        if (date_index >= 0) {
          scheduled_events[date_index].bookedTimeSlots.push(time_slot);

          scheduled_events[date_index].availableTimeSlots = scheduled_events[
            date_index
          ].availableTimeSlots.filter((e) => e !== time_slot);

          if (scheduled_events[date_index].availableTimeSlots.length === 0) {
            scheduled_events.splice(date_index, 1);
          }
        } else {
          scheduled_events.push({
            date,
            bookedTimeSlots: [time_slot],
            availableTimeSlots: timeSlot.filter((e) => e !== time_slot),
          });
        }
      });
      Promise.all(events).then((rs) => {
        console.log("Array: ", scheduled_events);

        res.send({ dates: scheduled_events });
        //   res.send("Retrieved Scheduled Events Successfully !!!");
      });
    }
  });
});

app.post("/api/schedule_event/:eventId", (req, res) => {
  let eventId = req.params.eventId;

  let data = {
    event: eventId,
    date: req.body.selectDate,
    time_slot_start: req.body.selectedSlotStart,
    time_slot_end: req.body.selectedSlotEnd,
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email_address: req.body.emailAddress,
  };

  let select = `select count(*) as count from ScheduledEvents where event=${eventId}
  and date='${data.date}' and time_slot_start='${data.time_slot_start}'
  and time_slot_end='${data.time_slot_end}'
  `;

  let query1 = con.query(select, (err, results) => {
    if (err) res.status(500);
    console.log(results);
    let [row] = results;

    if (row.count === 1) {
      res.status(403).send("Event already scheduled on the given time slot");
    } else {
      let sql = "INSERT INTO ScheduledEvents SET ?";
      let query2 = con.query(sql, data, (err, results) => {
        if (err) res.status(500);
        if (results) {
          console.log(results);
          res.send("Event scheduled!!!");
        }
      });
    }
  });
});

//Server listening
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});
/*
con.end(function (err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
  if (err) console.log("err: ", err);
  else console.log("Terminated done: ");
});
*/
