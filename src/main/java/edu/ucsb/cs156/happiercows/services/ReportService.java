package edu.ucsb.cs156.happiercows.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.Report;
import edu.ucsb.cs156.happiercows.entities.ReportLine;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.ReportLineRepository;
import edu.ucsb.cs156.happiercows.repositories.ReportRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;

@Service("ReportService")
public class ReportService {

    @Autowired
    ReportRepository reportRepository;

    @Autowired
    ReportLineRepository reportLineRepository;

    @Autowired
    CommonsRepository commonsRepository;

    @Autowired
    UserCommonsRepository userCommonsRepository;

    public Report createReport(Long commons_id) {
        Report report = createAndSaveReportHeader(commons_id);
        
        Iterable<UserCommons> allUserCommons = userCommonsRepository.findByCommonsId(commons_id);

        for (UserCommons userCommons : allUserCommons) {
               createAndSaveReportLine(report, userCommons);
        }

        return report;
    }

    public Report createAndSaveReportHeader(Long commons_id) {
        Commons commons = commonsRepository.findById(commons_id)
                .orElseThrow(() -> new RuntimeException(String.format("Commons with id %d not found", commons_id)));

        Report report = Report.builder()
                .commons_id(commons_id)
                .name(commons.getName())
                .cowPrice(commons.getCowPrice())
                .milkPrice(commons.getMilkPrice())
                .startingBalance(commons.getStartingBalance())
                .startingDate(commons.getStartingDate())
                .showLeaderboard(commons.isShowLeaderboard())
                .carryingCapacity(commons.getCarryingCapacity())
                .degradationRate(commons.getDegradationRate())
                .belowCapacityHealthUpdateStrategy(commons.getBelowCapacityHealthUpdateStrategy())
                .aboveCapacityHealthUpdateStrategy(commons.getAboveCapacityHealthUpdateStrategy())
                .numUsers(commonsRepository.getNumUsers(commons_id).orElse(0))
                .numCows(commonsRepository.getNumCows(commons_id).orElse(0))
                .build();

        reportRepository.save(report);
        return report;
    }

    public ReportLine createAndSaveReportLine(Report report, UserCommons userCommons) {
        ReportLine reportLine = ReportLine.builder()
                .report_id(report.getId())
                .user_id(userCommons.getUser().getId())
                .username(userCommons.getUsername())
                .totalWealth(userCommons.getTotalWealth())
                .numOfCows(userCommons.getNumOfCows())
                .avgCowHealth(userCommons.getCowHealth())
                .cowsBought(userCommons.getCowsBought())
                .cowsSold(userCommons.getCowsSold())
                .cowDeaths(userCommons.getCowDeaths())
                .build();

        reportLineRepository.save(reportLine);
        return reportLine;
    }

}
