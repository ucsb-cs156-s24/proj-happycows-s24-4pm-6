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
@Entity(name = "announcements")
public class Announcement {
    
    // Unique Announcement Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private long commonsId;

    @CreationTimestamp
    @Column(name="start", nullable = false)
    private Date start;

    private Date end;
    private String announcement;
}
