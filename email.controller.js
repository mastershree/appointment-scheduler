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
  let user, token, url, emailTemplate;
  try {
    let sql =
      "SELECT name, email, password, createdAt FROM users where email='" +
      email +
      "';";
    con.query(sql, (err, results) => {
      if (err) throw err;
      user = { name: results[0].name, email: results[0].email };
      console.log(user);
      token = usePasswordHashToMakeToken(user);
      url = getPasswordResetURL(user, token);
      emailTemplate = resetPasswordTemplate(user, url);
      console.log("EmailTemplate ", emailTemplate.to);
      transporter.sendMail(emailTemplate, (err, info) => {
        if (err) {
          console.log(err);
          res.status(500).json("Error sending email");
        } else {
          console.log(`** Email sent **`, info);
        }
      });
    });
  } catch (err) {
    res.status(404).json("No user with that email");
  }
};

export const receiveNewPassword = (req, res) => {
  const { email, token } = req.params;
  const { password } = req.body;
  console.log(req.body);
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
      payload = jwt.decode(token, secret);

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
    res.status(404).json("No user with that email");
  }
};
