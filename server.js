const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Replace this with your actual MongoDB URI
const mongoURI =
  "mongodb+srv://abdullah:Iamabdullah%40mongodb@bustracking.4o1nf.mongodb.net/IOT_Project";

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define a schema for storing GPS data
const LocationSchema = new mongoose.Schema({
  latitude: String,
  longitude: String,
  timestamp: { type: Date, default: Date.now },
});

// Create a model for the schema
const Location = mongoose.model("Location", LocationSchema);

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// API endpoint to handle incoming GPS data
app.put("/api/location", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Latitude and Longitude are required" });
    }

    // Find the latest location (you can modify this logic to search by other criteria if needed)
    let location = await Location.findOne().sort({ updatedAt: -1 });

    if (location) {
      // If a location exists, update the latitude, longitude, and timestamp
      location.latitude = latitude;
      location.longitude = longitude;
      location.updatedAt = new Date(); // Set the updatedAt timestamp
    } else {
      // If no location exists, create a new one
      location = new Location({ latitude, longitude });
    }

    // Save the location (whether updated or newly created)
    await location.save();

    res.status(200).json({
      message: "Location updated successfully",
      location,
    });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to retrieve all GPS data
app.get("/api/location", async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error("Error retrieving locations:", error);
    res.status(500).send("Internal server error");
  }
});

// Start the server
const PORT = 3000; // You can change this port if needed
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
