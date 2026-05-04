package com.prayaghudar.payload;

import java.time.LocalDate;

public class UserProfileResponse {

    private Long userId;
    private String email;
    private String role;
    private String fullName;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private String licenseNumber;
    private String specialty;
    private String bio;

    public UserProfileResponse() {
    }

    public UserProfileResponse(Long userId, String email, String role, String fullName, String phone, String address, LocalDate dateOfBirth, String licenseNumber, String specialty, String bio) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
        this.phone = phone;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
        this.licenseNumber = licenseNumber;
        this.specialty = specialty;
        this.bio = bio;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}
