import React, { useState } from "react";

function PatientCaseForm() {

    const [formData, setFormData] = useState({
        patientName: "",
        disease: "",
        patientQuestion: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:8080/api/cases",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (response.ok) {
                alert("Case Submitted Successfully!");

                setFormData({
                    patientName: "",
                    disease: "",
                    patientQuestion: ""
                });
            }

        } catch (error) {
            console.error(error);
            alert("Error submitting case");
        }
    };

    return (
        <div style={{ padding: "20px" }}>

            <h2>Patient Second Opinion Form</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="patientName"
                    placeholder="Patient Name"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="text"
                    name="disease"
                    placeholder="Disease"
                    value={formData.disease}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <textarea
                    name="patientQuestion"
                    placeholder="Describe your problem"
                    value={formData.patientQuestion}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <button type="submit">
                    Submit Case
                </button>

            </form>
        </div>
    );
}

export default PatientCaseForm;