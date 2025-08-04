const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// Seed dummy doctors (optional for testing)
router.post("/seed", async (req, res) => {
  const dummyDoctors = [
    {
      name: "Dr. Priya Sharma",
      specialization: "Cardiologist",
      availability: "Available Today",
      experience: "12 years",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200",
    },
    {
      name: "Dr. Ravi Kumar",
      specialization: "Neurologist",
      availability: "Fully Booked",
      experience: "15 years",
      image: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=200",
    },
    {
      name: "Dr. Meera Joshi",
      specialization: "Dermatologist",
      availability: "On Leave",
      experience: "8 years",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200",
    },
  ];

  await Doctor.insertMany(dummyDoctors);
  res.send("Seeded");
});

// GET all doctors
router.get("/", async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
});

// GET a single doctor
router.get("/:id", async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).send("Doctor not found");
  res.json(doctor);
});

module.exports = router;
