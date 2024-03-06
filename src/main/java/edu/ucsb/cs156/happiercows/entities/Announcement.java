package edu.ucsb.cs156.happiercows.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

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

    @Column(name="commons_id", nullable = false)
    private long commonsId;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="start", nullable = false)
    private Date start;

    @Column(name="end", nullable = true)
    private Date end;

    @Column(name="announcement", nullable = false)
    private String announcement;
}
