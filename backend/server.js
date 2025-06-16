import { connectDB } from "./config/db.config.js";
import app from "./index.js";

const port = process.env.PORT || 8080;

// App listener.
app.listen(port, (err) => {
    if(!err) {
        try {
            console.log(`Server is hosted on ${port}.`);
            connectDB();
        } catch (error) {
            throw new Error("Server is not")
        }
    } else {
        console.log("Server is not hosted.");
    }
})