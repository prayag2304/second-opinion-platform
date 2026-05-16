package com.prayaghudar.controller;

import com.prayaghudar.model.MedicalCase;
import com.prayaghudar.model.Notification;

import com.prayaghudar.repository.MedicalCaseRepository;
import com.prayaghudar.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cases")
@CrossOrigin(origins = "*")
public class MedicalCaseController {

    @Autowired
private MedicalCaseRepository repository;

@Autowired
private NotificationRepository notificationRepository;

    @PostMapping
public MedicalCase createCase(
        @RequestBody MedicalCase medicalCase) {

    notificationRepository.save(
            new Notification(
                    "New patient case received",
                    "doctor"
            )
    );

    return repository.save(medicalCase);
}

    @GetMapping
    public List<MedicalCase> getAllCases() {

        return repository.findAll();
    }

    @PutMapping("/{id}/opinion")
    public MedicalCase addOpinion(
            @PathVariable Long id,
            @RequestBody MedicalCase updatedCase) {

        Optional<MedicalCase> optionalCase =
                repository.findById(id);

        if (optionalCase.isPresent()) {

            MedicalCase medicalCase = optionalCase.get();

            medicalCase.setDoctorOpinion(
                    updatedCase.getDoctorOpinion());

            medicalCase.setDoctorName(
                    updatedCase.getDoctorName());

           medicalCase.setStatus("COMPLETED");

notificationRepository.save(
        new Notification(
                "Doctor has responded to your case",
                "patient"
        )
);

return repository.save(medicalCase);
        }

        return null;
    }

    @PutMapping("/{id}/reset")
    public MedicalCase resetOpinion(
            @PathVariable Long id
    ) {

        MedicalCase medicalCase =
                repository.findById(id).orElseThrow();

        medicalCase.setDoctorOpinion(null);
        medicalCase.setDoctorName(null);
        medicalCase.setStatus("PENDING");

        return repository.save(medicalCase);
    }

    @DeleteMapping("/{id}")
    public void deleteCase(
            @PathVariable Long id
    ) {
        repository.deleteById(id);
    }
}