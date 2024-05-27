package edu.ucsb.cs156.happiercows.models;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.AccessLevel;

@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class SystemInfo {
  private Boolean springH2ConsoleEnabled;
  private Boolean showSwaggerUILink;
  private String sourceRepo;
  private String oauthLogin;
  
  private String commitMessage;
  private String commitId;
  private String githubUrl; // URL to the commit in the source repository
}
