package com.prayaghudar.repository;

import com.prayaghudar.model.Profile;
import com.prayaghudar.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findByUser(User user);

    Optional<Profile> findByUserId(Long userId);
}
