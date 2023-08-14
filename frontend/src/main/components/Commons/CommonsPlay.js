import React, {useEffect, useState} from "react";
import greetingsList from "../../../assets/PlayGreetings.json"

export default function CommonsPlay({ currentUser }) {
  // Stryker disable next-line OptionalChaining : too many cases to test for too little value
  const firstName = currentUser?.root ? currentUser?.root?.user?.givenName : "";

  const [welcomeText, setWelcomeText]= useState("Welcome farmer");

  useEffect(() => {
    const numOfGreetings = greetingsList.length;
    const randomGreeting = greetingsList[Math.floor(Math.random() * numOfGreetings)];
    setWelcomeText(randomGreeting);
  }, []);

  return (
    <div data-testid="CommonsPlay">
      <h1>
      {welcomeText} {firstName}! 
    </h1>
    </div>
  );
};