package com.prayaghudar.controller;

import com.prayaghudar.model.Profile;
import com.prayaghudar.model.Role;
import com.prayaghudar.model.User;
import com.prayaghudar.payload.UserProfileResponse;
import com.prayaghudar.repository.ProfileRepository;
import com.prayaghudar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @GetMapping
    public ResponseEntity<List<UserProfileResponse>> getAllDoctors() {
        List<User> doctors = userRepository.findByRole(Role.DOCTOR);

        List<UserProfileResponse> doctorProfiles = doctors.stream()
                .map(user -> {
                    Optional<Profile> profileOpt = profileRepository.findByUser(user);
                    UserProfileResponse response = new UserProfileResponse();
                    response.setUserId(user.getId());
                    response.setEmail(user.getEmail());
                    response.setRole(user.getRole().toString());
                    if (profileOpt.isPresent()) {
                        Profile profile = profileOpt.get();
                        response.setFullName(profile.getFullName());
                        response.setPhone(profile.getPhone());
                        response.setAddress(profile.getAddress());
                        response.setDateOfBirth(profile.getDateOfBirth());
                        response.setLicenseNumber(profile.getLicenseNumber());
                        response.setSpecialty(profile.getSpecialty());
                        response.setBio(profile.getBio());
                    }
                    return response;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(doctorProfiles);
    }
}