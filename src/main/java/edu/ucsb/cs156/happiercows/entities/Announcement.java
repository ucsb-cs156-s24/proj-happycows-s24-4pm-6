package edu.ucsb.cs156.happiercows.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "announcement")
public class Announcement {
    
    // Unique Announcement Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private long commonsId;

    @Column(name="start_date", nullable = false)
    private Date startDate;

    @Column(name="end_date", nullable = true)
    private Date endDate;

    @Column(name="announcement_text", nullable = false)
    private String announcementText;
}
