package edu.ucsb.cs156.happiercows.entities;

import java.util.Date;

import javax.persistence.*;

import org.hibernate.annotations.CreationTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "report_lines")

public class ReportLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private long reportId;
    private long userId;

    private String username;
    private double totalWealth;
    private int numOfCows;
    private double avgCowHealth;
    private int cowsBought;
    private int cowsSold;
    private int cowDeaths;
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_date")
    private Date createDate;
}
