import React from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsconfig from "./aws-exports";
import HomePage from "./pages/HomePage";

Amplify.configure(awsconfig);



function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => <HomePage user={user} onSignOut={signOut} />}
    </Authenticator>
  );
}

export default App;
