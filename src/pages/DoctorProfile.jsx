import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/doctors/${id}`);
        if (!res.ok) throw new Error("Doctor not found");
        const data = await res.json();
        setDoctor(data);
      } catch (err) {
        console.error("Failed to fetch doctor:", err);
        setError(err.message);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">Doctor Not Found</h3>
          <p className="mt-2 text-gray-500">{error || "The requested doctor profile could not be loaded."}</p>
          <div className="mt-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Doctors
        </button>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gray-100 p-6 flex items-center justify-center">
              <img
                src={doctor.image || "https://via.placeholder.com/400x400"}
                alt={doctor.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x400";
                }}
                className="w-64 h-64 object-cover rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <div className="md:w-2/3 p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
                  <p className="text-xl text-blue-600 font-medium mt-1">
                    {doctor.specialization}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    doctor.availability === "Available Today"
                      ? "bg-green-100 text-green-800"
                      : doctor.availability === "Fully Booked"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {doctor.availability}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Experience</h3>
                  <p className="mt-1 text-lg text-gray-900">{doctor.experience}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">About</h3>
                  <p className="mt-1 text-gray-700">
                    {doctor.bio || "Dr. " + doctor.name + " is a highly qualified " + 
                    doctor.specialization + " with extensive experience in the field."}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Languages Spoken</h3>
                  <p className="mt-1 text-gray-700">
                    {doctor.languages || "English, Spanish"}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => navigate(`/book/${doctor._id}`)}
                  disabled={doctor.availability === "Fully Booked"}
                  className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium text-lg ${
                    doctor.availability === "Fully Booked"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  }`}
                >
                  {doctor.availability === "Fully Booked" 
                    ? "Currently Unavailable" 
                    : "Book Appointment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;