package com.prayaghudar.repository;

import com.prayaghudar.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserRole(
            String userRole
    );
}