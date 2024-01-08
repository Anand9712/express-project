const express = require("express");
const errorHandler = require("./middlewear/errorHandler");
const connectdb = require("./config/dbConnect");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

connectdb();

app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen (port, () => {
    console.log(`server running on port ${port}`);
});