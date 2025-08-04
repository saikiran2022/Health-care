import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  return (
    <Link
      to={`/doctors/${doctor._id}`}
      className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
    >
      <img
        src={doctor.image}
        alt={doctor.name}
        className="w-full h-40 object-cover rounded mb-4"
      />
      <h3 className="text-lg font-semibold">{doctor.name}</h3>
      <p className="text-sm text-gray-600">{doctor.specialization}</p>
      <p className="text-sm text-gray-500 mb-2">{doctor.experience}</p>
      <p
        className={`text-sm font-medium ${
          doctor.availability === "Available Today"
            ? "text-green-600"
            : doctor.availability === "Fully Booked"
            ? "text-red-600"
            : "text-yellow-600"
        }`}
      >
        {doctor.availability}
      </p>
    </Link>
  );
};

export default DoctorCard;
