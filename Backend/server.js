require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Doctor schema
const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  availability: String,
  experience: String,
  image: String,
});

const Doctor = mongoose.model("Doctor", doctorSchema);

// Appointment schema
const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientName: String,
  date: String,
  time: String,
  reason: String,
  phone: String,
  email: String,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

// Routes

// Get all doctors
app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// Get doctor by ID
app.get("/api/doctors/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: "Error fetching doctor" });
  }
});

// Book appointment
app.post("/api/appointments", async (req, res) => {
  const { doctorId, patientName, date, time, reason, phone, email } = req.body;

  if (!doctorId || !patientName || !date || !time || !reason) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newAppointment = new Appointment({
      doctorId,
      patientName,
      date,
      time,
      reason,
      phone,
      email,
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (err) {
    console.error("Appointment save error:", err);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

// Get all appointments with doctor details
app.get("/api/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctorId");
    
    // Transform the data to match frontend expectations
    const transformedAppointments = appointments.map(appt => ({
      _id: appt._id,
      patientName: appt.patientName,
      date: appt.date,
      time: appt.time,
      reason: appt.reason,
      phone: appt.phone,
      email: appt.email,
      doctor: {
        _id: appt.doctorId._id,
        name: appt.doctorId.name,
        specialization: appt.doctorId.specialization,
        experience: appt.doctorId.experience,
        image: appt.doctorId.image
      }
    }));

    res.json(transformedAppointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// Cancel appointment
app.delete("/api/appointments/:id", async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error("Error cancelling appointment:", err);
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});