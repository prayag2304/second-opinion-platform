package com.prayaghudar.service;

import com.prayaghudar.config.JwtTokenProvider;
import com.prayaghudar.model.Profile;
import com.prayaghudar.model.Role;
import com.prayaghudar.model.User;
import com.prayaghudar.payload.AuthResponse;
import com.prayaghudar.payload.LoginRequest;
import com.prayaghudar.payload.RegisterRequest;
import com.prayaghudar.payload.UserProfileResponse;
import com.prayaghudar.repository.ProfileRepository;
import com.prayaghudar.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
            ProfileRepository profileRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("Email is already in use");
        }

        Role role = Role.PATIENT;
        if (request.getRole() != null && !request.getRole().isBlank()) {
            try {
                role = Role.valueOf(request.getRole().trim().toUpperCase());
                if (role == Role.ADMIN) {
                    role = Role.PATIENT;
                }
            } catch (IllegalArgumentException ignored) {
                role = Role.PATIENT;
            }
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setVerified(true);
        User savedUser = userRepository.save(user);

        Profile profile = new Profile();
        profile.setUser(savedUser);

        if (request.getProfile() != null) {
            profile.setFullName(request.getProfile().getFullName());
            profile.setPhone(request.getProfile().getPhone());
            profile.setAddress(request.getProfile().getAddress());
            profile.setDateOfBirth(request.getProfile().getDateOfBirth());
            profile.setLicenseNumber(request.getProfile().getLicenseNumber());
            profile.setSpecialty(request.getProfile().getSpecialty());
            profile.setBio(request.getProfile().getBio());
        }

        profileRepository.save(profile);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String token = tokenProvider.generateToken(authentication);
        UserProfileResponse profileResponse = createProfileResponse(savedUser, profile);

        return new AuthResponse(token, "Bearer", savedUser.getEmail(), savedUser.getRole().name(), profileResponse);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(),
                        request.getPassword()));

        User user = (User) authentication.getPrincipal();
        String token = tokenProvider.generateToken(authentication);
        Profile profile = profileRepository.findByUser(user).orElse(null);
        UserProfileResponse profileResponse = createProfileResponse(user, profile);

        return new AuthResponse(token, "Bearer", user.getEmail(), user.getRole().name(), profileResponse);
    }

    public AuthResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof User)) {
            throw new IllegalStateException("No authenticated user found");
        }

        User user = (User) authentication.getPrincipal();
        Profile profile = profileRepository.findByUser(user).orElse(null);
        UserProfileResponse profileResponse = createProfileResponse(user, profile);

        return new AuthResponse(null, "Bearer", user.getEmail(), user.getRole().name(), profileResponse);
    }

    private UserProfileResponse createProfileResponse(User user, Profile profile) {
        if (profile == null) {
            return new UserProfileResponse(user.getId(), user.getEmail(), user.getRole().name(), null, null, null, null,
                    null, null, null);
        }

        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                profile.getFullName(),
                profile.getPhone(),
                profile.getAddress(),
                profile.getDateOfBirth(),
                profile.getLicenseNumber(),
                profile.getSpecialty(),
                profile.getBio());
    }
}
