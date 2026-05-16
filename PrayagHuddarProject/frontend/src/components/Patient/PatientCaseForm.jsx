import React, { useState } from "react";

function PatientCaseForm() {

    const [formData, setFormData] = useState({
    patientName: "",
    disease: "",
    patientQuestion: ""
});

const [showPayment, setShowPayment] = useState(false);
const [paymentSuccess, setPaymentSuccess] = useState(false);

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

    setShowPayment(false);

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

                <button
    type="button"
    onClick={() => setShowPayment(true)}
>
    Proceed To Payment
</button>

            </form>
            {showPayment && (

    <div
        style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999
        }}
    >

        <div
            style={{
                width: "420px",
                background: "white",
                borderRadius: "18px",
                padding: "30px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
                fontFamily: "Arial"
            }}
        >

            <div style={{ textAlign: "center", marginBottom: "20px" }}>

                <h2 style={{ marginBottom: "5px" }}>
                    Secure Payment
                </h2>

                <p style={{ color: "gray" }}>
                    Complete payment to request second opinion
                </p>

            </div>

            <div
                style={{
                    background: "#f5f7ff",
                    padding: "15px",
                    borderRadius: "10px",
                    marginBottom: "20px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px"
                    }}
                >
                    <span>Consultation Fee</span>
                    <strong>₹499</strong>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                    <span>Platform Fee</span>
                    <strong>₹0</strong>
                </div>

                <hr />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "18px"
                    }}
                >
                    <strong>Total</strong>
                    <strong style={{ color: "#2563eb" }}>
                        ₹499
                    </strong>
                </div>

            </div>

            <input
                type="text"
                placeholder="Card Holder Name"
                style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc"
                }}
            />

            <input
                type="text"
                placeholder="Card Number"
                style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc"
                }}
            />

            <div style={{ display: "flex", gap: "10px" }}>

                <input
                    type="text"
                    placeholder="MM/YY"
                    style={{
                        width: "50%",
                        padding: "12px",
                        marginBottom: "12px",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}
                />

                <input
                    type="password"
                    placeholder="CVV"
                    style={{
                        width: "50%",
                        padding: "12px",
                        marginBottom: "12px",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}
                />

            </div>

            <button
                onClick={() => {

                    setPaymentSuccess(true);

                    setTimeout(() => {

                        setShowPayment(false);

                        document.querySelector("form").requestSubmit();

                        setPaymentSuccess(false);

                    }, 1500);

                }}
                style={{
                    width: "100%",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "14px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginTop: "10px"
                }}
            >
                {paymentSuccess ? "Payment Successful ✓" : "Pay ₹499"}
            </button>

            <button
                onClick={() => setShowPayment(false)}
                style={{
                    width: "100%",
                    marginTop: "10px",
                    background: "#f3f4f6",
                    border: "none",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer"
                }}
            >
                Cancel
            </button>

        </div>

    </div>

)}
        </div>
    );
}

export default PatientCaseForm;