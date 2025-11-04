const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
 if (req.session.authorization) {
    const token = req.session.authorization.accessToken;

    // Verify the token (you can use jwt.verify if using JWT tokens)
    jwt.verify(token, "your_secret_key", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized access" });
      } else {
        next();
      }
    });
    
  } else {
    return res.status(403).json({ message: "No authorization token found" });
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
