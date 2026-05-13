package com.prayaghudar.controller;

import com.prayaghudar.model.MedicalCase;
import com.prayaghudar.repository.MedicalCaseRepository;

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

    @PostMapping
    public MedicalCase createCase(
            @RequestBody MedicalCase medicalCase) {

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

            return repository.save(medicalCase);
        }

        return null;
    }
}