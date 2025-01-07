const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Replace this with your actual MongoDB URI
const mongoURI = "mongodb+srv://abdullah:Iamabdullah%40mongodb@bustracking.4o1nf.mongodb.net/IOT_Project";

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

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

// API endpoint to handle updating GPS data with PUT
app.put("/api/location/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from URL parameters
    const { latitude, longitude } = req.body; // Extract latitude and longitude from request body

    if (!latitude || !longitude) {
      return res.status(400).send("Latitude and longitude are required");
    }

    // Find and update the document by ID
    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      { latitude, longitude, timestamp: Date.now() }, // Update the fields
      { new: true } // Return the updated document
    );

    if (!updatedLocation) {
      return res.status(404).send("Location not found");
    }

    res.status(200).send("Location updated successfully");
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).send("Internal server error");
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
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
