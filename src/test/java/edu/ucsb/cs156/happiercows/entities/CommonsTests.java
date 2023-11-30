package edu.ucsb.cs156.happiercows.entities;
import static org.junit.jupiter.api.Assertions.assertEquals;
import edu.ucsb.cs156.happiercows.entities.User;
import org.junit.jupiter.api.Test;

import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.time.LocalDateTime;

public class CommonsTests {
    LocalDateTime start = LocalDateTime.parse("2020-01-21T06:47:22.756");
    LocalDateTime start2 = LocalDateTime.parse("2100-03-05T15:50:10");
    LocalDateTime end = LocalDateTime.parse("2200-01-21T06:47:22.756");
    LocalDateTime end2 = LocalDateTime.parse("2021-03-05T15:50:10");

    @Test
    void test_gameInProgress_true() throws Exception {
        assertEquals(true, Commons.builder().startingDate(start).lastDate(end).build().gameInProgress());
    }
    @Test
    void test_gameInProgress_not_started() throws Exception {
        assertEquals(false, Commons.builder().startingDate(start2).lastDate(end).build().gameInProgress());
    }
    @Test
    void test_gameInProgress_ended() throws Exception {
        assertEquals(false, Commons.builder().startingDate(start).lastDate(end2).build().gameInProgress());       
    }
}