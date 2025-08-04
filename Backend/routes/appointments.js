// routes/appointments.js

const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// POST: Book an appointment
router.post("/", async (req, res) => {
  const { doctorId, patientName, date, time, reason } = req.body;

  try {
    const newAppointment = new Appointment({
      doctorId,
      patientName,
      date,
      time,
      reason,
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

module.exports = router;
