package com.prayaghudar.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    private String userRole;

    private boolean isRead = false;

    private LocalDateTime createdAt =
            LocalDateTime.now();

    public Notification() {
    }

    public Notification(
            String message,
            String userRole
    ) {
        this.message = message;
        this.userRole = userRole;
    }

    public Long getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public String getUserRole() {
        return userRole;
    }

    public boolean isRead() {
        return isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setRead(boolean read) {
        isRead = read;
    }
}