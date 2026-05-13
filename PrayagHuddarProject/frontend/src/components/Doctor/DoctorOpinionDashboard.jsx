import React, { useEffect, useState } from "react";

function DoctorOpinionDashboard() {

    const [cases, setCases] = useState([]);

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {

        const response = await fetch(
            "http://localhost:8080/api/cases"
        );

        const data = await response.json();

        setCases(data);
    };

    const submitOpinion = async (
        id,
        doctorName,
        doctorOpinion
    ) => {

        await fetch(
            `http://localhost:8080/api/cases/${id}/opinion`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    doctorName,
                    doctorOpinion
                })
            }
        );

        alert("Opinion Submitted!");

        fetchCases();
    };

    const pendingCases = cases.filter(
        (medicalCase) =>
            medicalCase.status === "PENDING"
    );

    const completedCases = cases.filter(
        (medicalCase) =>
            medicalCase.status === "COMPLETED"
    );

    return (
        <div style={{ padding: "20px" }}>

            <h2>Pending Cases</h2>

            {
                pendingCases.map((medicalCase) => (

                    <div
                        key={medicalCase.id}
                        style={{
                            border: "1px solid gray",
                            padding: "15px",
                            marginBottom: "20px"
                        }}
                    >

                        <h3>{medicalCase.patientName}</h3>

                        <p>
                            <b>Disease:</b>
                            {medicalCase.disease}
                        </p>

                        <p>
                            <b>Question:</b>
                            {" "}
                            {medicalCase.patientQuestion}
                        </p>

                        <DoctorOpinionForm
                            id={medicalCase.id}
                            onSubmit={submitOpinion}
                        />

                    </div>

                ))
            }

            <h2>Completed Opinions</h2>

            {
                completedCases.map((medicalCase) => (

                    <div
                        key={medicalCase.id}
                        style={{
                            border: "1px solid green",
                            padding: "15px",
                            marginBottom: "20px"
                        }}
                    >

                        <h3>{medicalCase.patientName}</h3>

                        <p>
                            <b>Disease:</b>
                            {medicalCase.disease}
                        </p>

                        <p>
                            <b>Question:</b>
                            {" "}
                            {medicalCase.patientQuestion}
                        </p>

                        <p>
                            <b>Doctor:</b>
                            {" "}
                            {medicalCase.doctorName}
                        </p>

                        <p>
                            <b>Opinion:</b>
                            {" "}
                            {medicalCase.doctorOpinion}
                        </p>

                    </div>

                ))
            }

        </div>
    );
}

function DoctorOpinionForm({ id, onSubmit }) {

    const [doctorName, setDoctorName] = useState("");
    const [doctorOpinion, setDoctorOpinion] = useState("");

    return (
        <div>

            <input
                type="text"
                placeholder="Doctor Name"
                value={doctorName}
                onChange={(e) =>
                    setDoctorName(e.target.value)
                }
            />

            <br /><br />

            <textarea
                placeholder="Write Opinion"
                value={doctorOpinion}
                onChange={(e) =>
                    setDoctorOpinion(e.target.value)
                }
            />

            <br /><br />

            <button
                onClick={() =>
                    onSubmit(
                        id,
                        doctorName,
                        doctorOpinion
                    )
                }
            >
                Submit Opinion
            </button>

        </div>
    );
}

export default DoctorOpinionDashboard;
