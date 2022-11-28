// package edu.ucsb.cs156.happiercows.jobs;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;


// import lombok.extern.slf4j.Slf4j;

// @Service
// @Slf4j
// public class UpdateCowHealthJobFactory  {

//     @Autowired
//     private UCSBCurriculumService ucsbCurriculumService;

//     @Autowired
//     private ConvertedSectionCollection convertedSectionCollection;

//     public UpdateCourseDataJob create(String subjectArea, String quarterYYYYQ) {
//         log.info("ucsbCurriculumService = " + ucsbCurriculumService);
//         log.info("convertedSectionCollection = " + convertedSectionCollection);
//         return new UpdateCourseDataJob(subjectArea, quarterYYYYQ, ucsbCurriculumService, convertedSectionCollection);
//     }
// }