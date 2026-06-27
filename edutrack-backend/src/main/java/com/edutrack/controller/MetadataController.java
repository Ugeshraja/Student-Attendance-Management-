package com.edutrack.controller;

import com.edutrack.entity.ClassEntity;
import com.edutrack.entity.Section;
import com.edutrack.repository.ClassRepository;
import com.edutrack.repository.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/metadata")
public class MetadataController {

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @GetMapping("/classes")
    public ResponseEntity<List<ClassEntity>> getClasses() {
        return ResponseEntity.ok(classRepository.findAll());
    }

    @GetMapping("/sections")
    public ResponseEntity<List<Section>> getSections() {
        return ResponseEntity.ok(sectionRepository.findAll());
    }
}
