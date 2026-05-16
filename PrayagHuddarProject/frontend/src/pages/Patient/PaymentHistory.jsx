import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';

const PaymentHistory = () => {

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch("http://localhost:8080/api/cases")
            .then((res) => res.json())
            .then((data) => {

                const completedPayments = data.filter(
                    (item) => item.status === "COMPLETED"
                );

                setPayments(completedPayments);

                setLoading(false);

            });

    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div style={{ padding: "20px" }}>
                    <h2>Loading Payment History...</h2>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <div style={{ padding: "20px" }}>

                <h1>Payment History</h1>

                {payments.length === 0 ? (

                    <p>No payments found</p>

                ) : (

                    payments.map((payment, index) => (

                        <div
                            key={index}
                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                marginBottom: "15px",
                                borderRadius: "8px",
                                backgroundColor: "#fff"
                            }}
                        >

                            <h3>
                                {payment.patientName}
                            </h3>

                            <p>
                                Disease: {payment.disease}
                            </p>

                            <p>
                                Amount Paid: ₹499
                            </p>

                            <p>
                                Transaction ID: TXN{payment.id}
                            </p>

                            <p
                                style={{
                                    color: "green",
                                    fontWeight: "bold"
                                }}
                            >
                                Payment Status: SUCCESS
                            </p>

                        </div>

                    ))

                )}

            </div>

        </DashboardLayout>
    );
};

export default PaymentHistory;