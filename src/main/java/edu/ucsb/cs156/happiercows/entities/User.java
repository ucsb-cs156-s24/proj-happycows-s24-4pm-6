package edu.ucsb.cs156.happiercows.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String email;
    private String googleSub;
    private String pictureUrl;
    private String fullName;
    private String givenName;
    private String familyName;
    private boolean emailVerified;
    private String locale;
    private String hostedDomain;
    private boolean admin;

    // this is used by the frontend
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_commons",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "commons_id", referencedColumnName = "id"))
    private List<Commons> commons;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<UserCommons> joinedCommons;


    @Override
    public String toString() {
        return String.format("User: id=%d email=%s", id, email);
    }
}
