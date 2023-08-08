package edu.ucsb.cs156.happiercows.helpers;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import edu.ucsb.cs156.happiercows.entities.ReportLine;

/*
 * This code is based on 
 * <a href="https://bezkoder.com/spring-boot-download-csv-file/">https://bezkoder.com/spring-boot-download-csv-file/</a>
 * and provides a way to serve up a CSV file containing information associated
 * with an instructor report.
 */

public class ReportCSVHelper {

  public static ByteArrayInputStream toCSV(Iterable<ReportLine> lines) {
    final CSVFormat format = CSVFormat.DEFAULT;

    List<String> headers = Arrays.asList(
      "id",
      "reportId",
      "userId",
      "username",
      "totalWealth",
      "numOfCows",
      "avgCowHealth",
      "cowsBought",
      "cowsSold",
      "cowDeaths",
      "reportDate"
    );
    
    try (
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), format);) {

      csvPrinter.printRecord(headers);
      

      for (ReportLine line : lines) {
        List<String> data = Arrays.asList(
          String.valueOf(line.getId()),
          String.valueOf(line.getReportId()),
          String.valueOf(line.getUserId()),
          line.getUsername(),
          String.valueOf(line.getTotalWealth()),
          String.valueOf(line.getNumOfCows()),
          String.valueOf(line.getAvgCowHealth()),
          String.valueOf(line.getCowsBought()),
          String.valueOf(line.getCowsSold()),
          String.valueOf(line.getCowDeaths()),
          String.valueOf(line.getCreateDate())
        );

        csvPrinter.printRecord(data);
      }

      csvPrinter.flush();
      return new ByteArrayInputStream(out.toByteArray());
    } catch (IOException e) {
      throw new RuntimeException("Failed to import data to CSV file: " + e.getMessage());
    }
  }
}