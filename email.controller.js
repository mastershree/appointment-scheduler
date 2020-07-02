import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import request from "request";
import {
  transporter,
  getPasswordResetURL,
  resetPasswordTemplate,
} from "./email";
import { con } from "./index";

//create database connection
/*
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "restful_db",
});


//connect to database
conn.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected...");
});
*/

export const usePasswordHashToMakeToken = ({ email, password, createdAt }) => {
  const secret = password + "-" + createdAt;
  const token = jwt.sign({ email }, secret, {
    expiresIn: 3600, // 1 hour
  });
  return token;
};

export const sendPasswordResetEmail = (req, res) => {
  const { email } = req.params;
  console.log("email id received", email);
  let user, token, url, emailTemplate;

  let sql =
    "SELECT name, email, password, createdAt FROM users where email='" +
    email +
    "';";
  con.query(sql, (err, results) => {
    if (err) res.status(500);
    console.log(results);
    if (results.length > 0) {
      user = results[0];
      console.log(user);
      token = usePasswordHashToMakeToken({
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
      });

      url = getPasswordResetURL({ name: user.name, email: user.email }, token);
      emailTemplate = resetPasswordTemplate(
        { name: user.name, email: user.email },
        url
      );
      console.log("EmailTemplate ", emailTemplate.to);
      transporter.sendMail(emailTemplate, (err, info) => {
        if (err) {
          console.log(err);
          res.status(500);
        } else {
          res.send("Email Sent");
          console.log(`** Email sent **`, info);
        }
      });
    } else {
      res.status(404);
    }
  });
};

export const receiveNewPassword = (req, res) => {
  const { email, token } = req.params;
  const { password } = req.body;
  console.log("received token:", token);
  let user, secret, payload;
  try {
    let sql =
      "SELECT name, email, password, createdAt FROM users where email='" +
      email +
      "';";
    con.query(sql, (err, results) => {
      if (err) throw err;
      user = results[0];
      console.log(user);
      secret = user.password + "-" + user.createdAt;
      payload = jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          return res
            .status(400)
            .send("Token expired. Kindly make request for new link.");
        } else {
          return decoded;
        }
      });

      if (payload.email === user.email) {
        bcrypt.genSalt(10, function (err, salt) {
          if (err) throw err;
          bcrypt.hash(password, salt, function (err, hash) {
            if (err) throw err;
            let sql = `Update users set password='${hash}' where email='${email}';`;
            con.query(sql, (err, results) => {
              if (err) throw err;
              res.status(202).json("Password changed accepted");
            });
          });
        });
      }
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(404).json("No user with that email");
  }
};
