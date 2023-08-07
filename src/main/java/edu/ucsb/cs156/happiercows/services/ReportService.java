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

    public Report createReport(Long commonsId) {
        Report report = createAndSaveReportHeader(commonsId);
        
        Iterable<UserCommons> allUserCommons = userCommonsRepository.findByCommonsId(commonsId);


        for (UserCommons userCommons : allUserCommons) {
               createAndSaveReportLine(report, userCommons);
        }

        return report;
    }

    public Report createAndSaveReportHeader(Long commonsId) {
        Commons commons = commonsRepository.findById(commonsId)
                .orElseThrow(() -> new RuntimeException(String.format("Commons with id %d not found", commonsId)));

        Report report = Report.builder()
                .commonsId(commonsId)

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
                .numUsers(commonsRepository.getNumUsers(commonsId).orElse(0))
                .numCows(commonsRepository.getNumCows(commonsId).orElse(0))

                .build();

        reportRepository.save(report);
        return report;
    }

    public ReportLine createAndSaveReportLine(Report report, UserCommons userCommons) {
        ReportLine reportLine = ReportLine.builder()
                .reportId(report.getId())
                .userId(userCommons.getUser().getId())
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
