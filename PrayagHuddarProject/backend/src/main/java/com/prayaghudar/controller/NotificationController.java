package com.prayaghudar.controller;

import com.prayaghudar.model.Notification;
import com.prayaghudar.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository repository;

    @GetMapping("/{role}")
    public List<Notification> getNotifications(
            @PathVariable String role
    ) {
        return repository.findByUserRole(role);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(
            @PathVariable Long id
    ) {
        repository.deleteById(id);
    }
}