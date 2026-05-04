package com.prayaghudar.payload;

public class AuthResponse {

    private String accessToken;
    private String token;
    private String tokenType;
    private String email;
    private String role;
    private UserProfileResponse user;
    private UserProfileResponse profile;

    public AuthResponse() {
    }

    public AuthResponse(String accessToken, String tokenType, String email, String role, UserProfileResponse profile) {
        this.accessToken = accessToken;
        this.token = accessToken;
        this.tokenType = tokenType;
        this.email = email;
        this.role = role;
        this.user = profile;
        this.profile = profile;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
        this.token = accessToken;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
        this.accessToken = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
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

    public UserProfileResponse getUser() {
        return user;
    }

    public void setUser(UserProfileResponse user) {
        this.user = user;
        this.profile = user;
    }

    public UserProfileResponse getProfile() {
        return profile;
    }

    public void setProfile(UserProfileResponse profile) {
        this.profile = profile;
        this.user = profile;
    }
}
