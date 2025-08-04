import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("upcoming");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/appointments");
        if (!res.ok) throw new Error("Failed to fetch appointments");
        
        const data = await res.json();
        
        // Transform the data to match expected structure
        const transformedData = data.map(appt => ({
          ...appt,
          // Ensure doctor data is properly structured
          doctor: appt.doctor || {
            _id: appt.doctorId,
            name: "Unknown Doctor",
            specialization: "Unknown Specialty"
          },
          // Ensure date is in correct format (YYYY-MM-DD)
          date: appt.date ? appt.date.split('T')[0] : "",
          // Ensure time is in correct format (HH:MM)
          time: appt.time || ""
        }));
        
        setAppointments(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    if (!appt.date || !appt.time) return false;
    
    const now = new Date();
    const apptDate = new Date(`${appt.date}T${appt.time}`);
    
    if (filter === "upcoming") return apptDate >= now;
    if (filter === "past") return apptDate < now;
    return true; // 'all'
  });

  const cancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setAppointments(appointments.filter(appt => appt._id !== id));
      } else {
        throw new Error("Failed to cancel appointment");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Loading and error states remain the same...

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded-md ${filter === "upcoming" ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`px-4 py-2 rounded-md ${filter === "past" ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
              Past
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md ${filter === "all" ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
              All
            </button>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
            No appointments found.
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {filteredAppointments.map((appt) => {
                const apptDateTime = new Date(`${appt.date}T${appt.time}`);
                const isPast = apptDateTime < new Date();
                
                return (
                  <li key={appt._id}>
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg
                              className="h-6 w-6 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                              {appt.doctor?.name || "Unknown Doctor"}
                              <span className="ml-2 text-sm font-normal text-gray-500">
                                ({appt.doctor?.specialization || "Unknown Specialty"})
                              </span>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {format(parseISO(appt.date), "MMMM do, yyyy")} at{" "}
                              {appt.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              isPast
                                ? "bg-gray-100 text-gray-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {isPast ? "Completed" : "Upcoming"}
                          </span>
                          <div className="mt-2 flex space-x-2">
                            {!isPast && (
                              <button
                                onClick={() => cancelAppointment(appt._id)}
                                className="text-sm text-red-600 hover:text-red-800"
                              >
                                Cancel
                              </button>
                            )}
                            {appt.doctor?._id && (
                              <button
                                onClick={() => navigate(`/doctors/${appt.doctor._id}`)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                View Doctor
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Patient:</span> {appt.patientName}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Reason:</span> {appt.reason || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Contact:</span> {appt.phone || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Email:</span> {appt.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;