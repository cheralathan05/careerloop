import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export function initializeRecaptcha() {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => console.log("reCAPTCHA solved", response),
        "expired-callback": () => console.log("reCAPTCHA expired"),
      },
      auth
    );
    window.recaptchaVerifier.render();
  }
}
