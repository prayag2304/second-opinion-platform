package com.prayaghudar.repository;

import com.prayaghudar.model.MedicalCase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicalCaseRepository
        extends JpaRepository<MedicalCase, Long> {

}