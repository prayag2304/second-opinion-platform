package com.prayaghudar.controller;

import com.prayaghudar.model.Profile;
import com.prayaghudar.model.Role;
import com.prayaghudar.model.User;
import com.prayaghudar.repository.ProfileRepository;
import com.prayaghudar.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "https://second-opinion-platform.vercel.app",
        "https://second-opinion-platform-pqfpzlrh5.vercel.app"
    }
)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UserRepository userRepository, ProfileRepository profileRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "") String role,
            @RequestParam(defaultValue = "") String status,
            @RequestParam(defaultValue = "") String search) {

        List<Map<String, Object>> filteredUsers = userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getId))
                .filter(user -> matchesRole(user, role))
                .filter(user -> matchesStatus(user, status))
                .map(this::toUserResponse)
                .filter(user -> matchesSearch(user, search))
                .toList();

        int safeLimit = Math.max(limit, 1);
        int safePage = Math.max(page, 1);
        int totalCount = filteredUsers.size();
        int totalPages = Math.max((int) Math.ceil((double) totalCount / safeLimit), 1);
        int fromIndex = Math.min((safePage - 1) * safeLimit, totalCount);
        int toIndex = Math.min(fromIndex + safeLimit, totalCount);

        Map<String, Object> response = new HashMap<>();
        response.put("users", filteredUsers.subList(fromIndex, toIndex));
        response.put("totalPages", totalPages);
        response.put("totalCount", totalCount);
        response.put("currentPage", safePage);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctors/pending")
    public ResponseEntity<Map<String, Object>> getPendingDoctors(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {

        List<Map<String, Object>> pendingDoctors = userRepository.findByRole(Role.DOCTOR).stream()
                .filter(user -> !user.isVerified())
                .map(this::toDoctorResponse)
                .toList();

        Map<String, Object> response = paginatedResponse("doctors", pendingDoctors, page, limit);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/doctors/approve")
    public ResponseEntity<Map<String, Object>> approveDoctor(@RequestBody Map<String, Object> request) {
        Long doctorId = toLong(request.get("doctorId"));
        User doctor = userRepository.findById(doctorId).orElseThrow();
        doctor.setVerified(true);
        userRepository.save(doctor);
        return ResponseEntity.ok(Map.of("message", "Doctor approved successfully"));
    }

    @PostMapping("/doctors/reject")
    public ResponseEntity<Map<String, Object>> rejectDoctor(@RequestBody Map<String, Object> request) {
        Long doctorId = toLong(request.get("doctorId"));
        User doctor = userRepository.findById(doctorId).orElseThrow();
        doctor.setVerified(false);
        userRepository.save(doctor);
        return ResponseEntity.ok(Map.of("message", "Doctor rejected successfully"));
    }

    @PostMapping("/doctors/bulk")
    public ResponseEntity<Map<String, Object>> bulkDoctorAction(@RequestBody Map<String, Object> request) {
        String action = String.valueOf(request.getOrDefault("action", ""));
        Object doctorIds = request.get("doctorIds");

        if (doctorIds instanceof List<?> ids) {
            for (Object id : ids) {
                userRepository.findById(toLong(id)).ifPresent(doctor -> {
                    doctor.setVerified("approve".equalsIgnoreCase(action));
                    userRepository.save(doctor);
                });
            }
        }

        return ResponseEntity.ok(Map.of("message", "Bulk action completed"));
    }

    @PostMapping("/analytics")
    public ResponseEntity<Void> trackAdminAction(@RequestBody Map<String, Object> request) {
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<Map<String, Object>> updateUserStatus(@PathVariable Long id,
            @RequestBody Map<String, String> request) {
        User user = userRepository.findById(id).orElseThrow();
        String status = request.getOrDefault("status", "active");
        user.setVerified(!"suspended".equalsIgnoreCase(status) && !"rejected".equalsIgnoreCase(status));
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(toUserResponse(savedUser));
    }

    @PostMapping("/users")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody Map<String, String> request) {
        String email = request.getOrDefault("email", "").trim().toLowerCase(Locale.ROOT);
        if (email.isBlank() || userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required or already exists"));
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("password"));
        user.setRole(parseRole(request.get("role")));
        user.setVerified(!"suspended".equalsIgnoreCase(request.getOrDefault("status", "active")));
        User savedUser = userRepository.save(user);

        Profile profile = new Profile();
        profile.setUser(savedUser);
        profile.setFullName(request.getOrDefault("name", email));
        profile.setPhone(request.get("phoneNumber"));
        profile.setSpecialty(request.get("specialty"));
        profileRepository.save(profile);

        return ResponseEntity.ok(toUserResponse(savedUser));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable Long id,
            @RequestBody Map<String, String> request) {
        User user = userRepository.findById(id).orElseThrow();
        user.setRole(parseRole(request.get("role")));
        user.setVerified(!"suspended".equalsIgnoreCase(request.getOrDefault("status", "active")));
        User savedUser = userRepository.save(user);

        Profile profile = profileRepository.findByUser(savedUser).orElseGet(() -> {
            Profile newProfile = new Profile();
            newProfile.setUser(savedUser);
            return newProfile;
        });
        profile.setFullName(request.getOrDefault("name", savedUser.getEmail()));
        profile.setPhone(request.get("phoneNumber"));
        profile.setSpecialty(request.get("specialty"));
        profileRepository.save(profile);

        return ResponseEntity.ok(toUserResponse(savedUser));
    }

    private Map<String, Object> toUserResponse(User user) {
        Optional<Profile> profile = profileRepository.findByUser(user);
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name().toLowerCase(Locale.ROOT));
        response.put("status", statusFor(user));
        response.put("lastLogin", null);
        response.put("name", profile.map(Profile::getFullName).orElse(user.getEmail()));
        response.put("phoneNumber", profile.map(Profile::getPhone).orElse(null));
        response.put("specialty", profile.map(Profile::getSpecialty).orElse(null));
        return response;
    }

    private Map<String, Object> toDoctorResponse(User user) {
        Map<String, Object> response = toUserResponse(user);
        Optional<Profile> profile = profileRepository.findByUser(user);
        response.put("licenseNumber", profile.map(Profile::getLicenseNumber).orElse(null));
        response.put("credentials", null);
        response.put("yearsOfExperience", null);
        return response;
    }

    private Map<String, Object> paginatedResponse(String key, List<Map<String, Object>> items, int page, int limit) {
        int safeLimit = Math.max(limit, 1);
        int safePage = Math.max(page, 1);
        int totalCount = items.size();
        int totalPages = Math.max((int) Math.ceil((double) totalCount / safeLimit), 1);
        int fromIndex = Math.min((safePage - 1) * safeLimit, totalCount);
        int toIndex = Math.min(fromIndex + safeLimit, totalCount);

        Map<String, Object> response = new HashMap<>();
        response.put(key, items.subList(fromIndex, toIndex));
        response.put("totalPages", totalPages);
        response.put("totalCount", totalCount);
        response.put("currentPage", safePage);
        return response;
    }

    private boolean matchesRole(User user, String role) {
        return role == null || role.isBlank() || user.getRole().name().equalsIgnoreCase(role);
    }

    private boolean matchesStatus(User user, String status) {
        return status == null || status.isBlank() || statusFor(user).equalsIgnoreCase(status);
    }

    private boolean matchesSearch(Map<String, Object> user, String search) {
        if (search == null || search.isBlank()) {
            return true;
        }
        String term = search.toLowerCase(Locale.ROOT);
        return String.valueOf(user.get("name")).toLowerCase(Locale.ROOT).contains(term)
                || String.valueOf(user.get("email")).toLowerCase(Locale.ROOT).contains(term);
    }

    private String statusFor(User user) {
        if (!user.isVerified()) {
            return user.getRole() == Role.DOCTOR ? "pending" : "suspended";
        }
        return user.getRole() == Role.DOCTOR ? "approved" : "active";
    }

    private Role parseRole(String role) {
        try {
            return Role.valueOf(String.valueOf(role).toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            return Role.PATIENT;
        }
    }

    private Long toLong(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        return Long.parseLong(String.valueOf(value));
    }
}
