package com.prayaghudar.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class MedicalCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;

    private String disease;

    @Column(length = 5000)
    private String patientQuestion;

    @Column(length = 5000)
    private String doctorOpinion;

    private String doctorName;

    private String status;

    private LocalDateTime createdAt;

    public MedicalCase() {
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public String getPatientQuestion() {
        return patientQuestion;
    }

    public void setPatientQuestion(String patientQuestion) {
        this.patientQuestion = patientQuestion;
    }

    public String getDoctorOpinion() {
        return doctorOpinion;
    }

    public void setDoctorOpinion(String doctorOpinion) {
        this.doctorOpinion = doctorOpinion;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}