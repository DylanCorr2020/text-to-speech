import React from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsconfig from "./aws-exports";
import HomePage from "./pages/HomePage";

Amplify.configure(awsconfig);

function App() {
  return (
    <Authenticator
      formFields={{
        signIn: {
          username: {
            label: "Email",
            placeholder: "Enter your email",
            isRequired: true,
          },
        },
        signUp: {
          "custom:firstName": {
            label: "First Name",
            placeholder: "Enter your first name",
            required: false,
            order: 1,
          },
          family_name: {
            label: "Last Name",
            placeholder: "Enter your last name",
            required: false,
            order: 1,
          },
          username: {
            label: "Email",
            placeholder: "Enter your email",
            required: true,
            order: 2,
          },
          password: {
            label: "Password",
            placeholder: "Enter your password",
            required: true,
            order: 3,
          },
          confirm_password: {
            label: "Confirm Password",
            placeholder: "Please confirm your password",
            required: true,
            order: 4,
          },
        },
      }}
    >
      {({ signOut, user }) => <HomePage user={user} onSignOut={signOut} />}
    </Authenticator>
  );
}

export default App;
