const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000
;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.gjrmpdl.mongodb.net/registrationFormDB`,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err.message);
});

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cpassword: String
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/htmlpages/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password, cpassword } = req.body;

        const existingUser = await Registration.findOne({ email: email });
        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password,
                cpassword
            });
            await registrationData.save();
            res.redirect("/successful"); // Redirect to the correct path
        } else {
            res.redirect("/error");// Send a message to the client
        }

    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/successful", (req, res) => {
    res.sendFile(__dirname + "/htmlpages/successful.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/htmlpages/error.html"); // Correct the path
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
