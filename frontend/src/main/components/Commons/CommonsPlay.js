import React, { useState} from "react";
import greetingsList from "../../../assets/PlayGreetings.json"

export default function CommonsPlay({ currentUser }) {
  // Stryker disable  all 
  const firstName = currentUser?.root ? currentUser?.root?.user?.givenName : "";

  const [welcomeText, _]= useState(greetingsList[Math.floor(Math.random() * greetingsList.length)]);
  // Stryker restore all

  return (
    <div data-testid="CommonsPlay">
      <h1>
      {welcomeText} {firstName}! 
    </h1>
    </div>
  );
};