package edu.ucsb.cs156.happiercows.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class UserTests {
    @Test
    void test_toString() {
        assertEquals("User: id=1 email=user@example.org", User.builder().id(1L).email("user@example.org").build().toString());
    }
}