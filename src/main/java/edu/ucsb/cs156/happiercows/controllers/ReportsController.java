package edu.ucsb.cs156.happiercows.controllers;

import edu.ucsb.cs156.happiercows.entities.Report;
import edu.ucsb.cs156.happiercows.entities.ReportLine;
import edu.ucsb.cs156.happiercows.helpers.ReportCSVHelper;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.ReportLineRepository;
import edu.ucsb.cs156.happiercows.repositories.ReportRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import org.springframework.data.domain.Sort.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Reports")
@RequestMapping("/api/reports")
@RestController
public class ReportsController extends ApiController {

    @Autowired
    CommonsRepository commonsRepository;

    @Autowired
    UserCommonsRepository userCommonsRepository;

    @Autowired
    ReportRepository reportRepository;

    @Autowired
    ReportLineRepository reportLineRepository;

    @Operation(summary = "Get all report headers")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("")
    public Iterable<Report> allReports() {
        Iterable<Report> reports = reportRepository.findAll(
                Sort.by(List.of(
                        new Order(Sort.Direction.ASC, "commonsId"),
                        new Order(Sort.Direction.DESC, "id"))));
        return reports;
    }

    @Operation(summary = "Get report headers for a given report")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/byReportId")
    public Optional<Report> findByReportId(
            @Parameter(name = "reportId") @RequestParam Long reportId) {
        Optional<Report> reports = reportRepository.findById(reportId);
        return reports;
    }

    @Operation(summary = "Get report headers for a given user commons")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/headers")
    public Iterable<Report> allReportsByCommonsId(
            @Parameter(name = "commonsId") @RequestParam Long commonsId) {
        Iterable<Report> reports = reportRepository.findAllByCommonsId(commonsId);
        return reports;
    }

    @Operation(summary = "Get report lines for a report id")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/lines")
    public Iterable<ReportLine> allLinesByReportId(
            @Parameter(name = "reportId") @RequestParam Long reportId) {
        Iterable<ReportLine> reportLines = reportLineRepository.findAllByReportId(reportId);
        return reportLines;
    }

    @Operation(summary = "Get report lines for a report id and user commons id")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/download")
    public ResponseEntity<Resource> getLinesCSV(
            @Parameter(name = "reportId") @RequestParam Long reportId) throws IOException {

        Iterable<ReportLine> reportLines = reportLineRepository.findAllByReportId(reportId);

        String filename = String.format("report%05d.csv",reportId);

        ByteArrayInputStream bais = ReportCSVHelper.toCSV(reportLines);
        InputStreamResource isr = new InputStreamResource(bais);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/csv"))
                .body(isr);
    }

}
