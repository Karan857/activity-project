import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const secret = "Fullstack-Login";
const saltRounds = 10;

//login
export const login = (req, res) => {
  const { username, password } = req.body;
  const q = `SELECT login.*, 
        COALESCE(st.login_ID, t.login_ID, a.login_ID) AS id
        FROM login
        LEFT JOIN student st ON login.username = st.login_ID
        LEFT JOIN teacher t ON login.login_ID = t.login_ID
        LEFT JOIN admin a ON login.login_ID = a.login_ID
        WHERE login.username = ?
`;

  db.query(q, username, (err, user) => {
    if (err) return res.status(500).json(err);
    if (user.length === 0) return res.status(404).json("user not found");

    bcrypt.compare(password, user[0].password, function (err, isLogin) {
      if (isLogin) {
        var token = jwt.sign(
          {
            username: user[0].username,
            role: user[0].role, // เพิ่มบทบาทใน token
          },
          secret,
          {
            expiresIn: "1h",
          }
        );
        if (user[0].role === "teacher" || user[0].role === "admin") {
          res.json({
            status: "ok",
            message: "Login Success",
            token,
            role: user[0].role,
            staff_ID: user[0].id, // ส่งบทบาทในการตอบกลับ
          });
        } else if (user[0].role === "student") {
          res.json({
            status: "ok",
            message: "Login Success",
            token,
            role: user[0].role,
            std_ID: user[0].id, // ส่งบทบาทในการตอบกลับ
          });
        }
      } else {
        res.json({
          status: "error",
          message: "Login Failed",
        });
      }
    });
  });
};

// create user  table login
export const register = async (req, res) => {
  try {
    const { username, password, role, fname, lname, email, mobile, sec_ID } =
      req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        message: "Required fields: username, password, and role",
      });
    }

    if (typeof password !== "string") {
      return res.status(400).json({
        message: "Password must be a string",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const q = "INSERT INTO login (username, password, role) VALUES (?, ?, ?)";

    db.query(q, [username, hashedPassword, role], (err, results) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({
          message: "Failed to register user",
          error: err,
        });
      }

      const loginID = results.insertId;

      let sql2;
      let values;

      if (role === "teacher") {
        sql2 =
          "INSERT INTO teacher (staff_fname, staff_lname, staff_mobile, staff_email, login_ID, sec_ID) VALUES (?, ?, ?, ?, ?, ?)";
        values = [fname, lname, mobile, email, loginID, sec_ID];
      } else if (role === "student") {
        sql2 =
          "INSERT INTO student (std_fname, std_lname, std_mobile, std_email, login_ID, sec_ID) VALUES (?, ?, ?, ?, ?, ?)";
        values = [fname, lname, mobile, email, username, sec_ID];
      } else {
        return res.status(400).json({
          message: "Invalid role",
        });
      }

      db.query(sql2, values, (err, result) => {
        if (err) {
          console.error(`Error inserting ${role}:`, err);
          return res.status(500).json({
            message: `Failed to register ${role}`,
            error: err,
          });
        }

        res.status(201).json({
          message: `${role} registered successfully`,
          status: "ok",
        });
      });
    });
  } catch (error) {
    console.error("Error in register function:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// create user  table login
export const arrayregister = async (req, res) => {
    try {
      console.log("Received request body:", req.body); // Log the received request body
  
      const users = req.body;
  
      if (!Array.isArray(users)) {
        return res.status(400).json({
          message: "Request body must be an array of users",
        });
      }
  
      const insertPromises = users.map(async (user) => {
        const { username, password, role, fname, lname, email, mobile, sec_ID } = user;
  
        if (!username || !password || !role) {
          throw new Error("Required fields: username, password, and role");
        }
  
        // Ensure password is a string before hashing
        if (typeof password !== "string") {
          throw new Error("Password must be a string");
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const q = "INSERT INTO login (username, password, role) VALUES (?, ?, ?)";
        return new Promise((resolve, reject) => {
          db.query(q, [username, hashedPassword, role], (err, results) => {
            if (err) {
              console.error("Error inserting user:", err);
              reject(new Error("Failed to register user"));
            } else {
              const loginID = results.insertId;
  
              let sql2;
              let values;
  
              if (role === "teacher") {
                sql2 = "INSERT INTO teacher (staff_fname, staff_lname, staff_mobile, staff_email, login_ID, sec_ID) VALUES (?, ?, ?, ?, ?, ?)";
                values = [fname, lname, mobile, email, loginID, sec_ID];
  
                db.query(sql2, values, (err, results) => {
                  if (err) {
                    console.error("Error inserting teacher:", err);
                    reject(new Error(`Failed to register ${role}`));
                  } else {
                    resolve({
                      status: 'ok',
                      message: `Registered ${role} successfully`,
                    });
                  }
                });
  
              } else if (role === 'student') {
                sql2 = "INSERT INTO student (std_fname, std_lname, std_mobile, std_email, login_ID, sec_ID) VALUES (?, ?, ?, ?, ?, ?)";
                values = [fname, lname, mobile, email, username, sec_ID];
  
                db.query(sql2, values, (err, results) => {
                  if (err) {
                    console.error("Error inserting student:", err);
                    reject(new Error(`Failed to register ${role}`));
                  } else {
                    resolve({
                      status: 'ok',
                      message: `Registered ${role} successfully`,
                    });
                  }
                });
              }
            }
          });
        });
      });
  
      const results = await Promise.all(insertPromises);
      res.status(201).json(results);
    } catch (error) {
      console.error("Error in register function:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };
