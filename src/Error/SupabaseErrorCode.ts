interface SupabaseErrorsInterface {
  description: string;
  logMessage: string;
  toastMessage: string;
}

export const SupabaseErrors = new Map<string, SupabaseErrorsInterface>([
  [
    "email_exists",
    {
      description:
        "This email address is already in use. Please try another email.",
      logMessage: "Error: email_exists - Email address already in use.",
      toastMessage: "Email already in use. Try another one.",
    },
  ],
  [
    "email_not_confirmed",
    {
      description:
        "Your email address is not confirmed. Please check your email for a confirmation link.",
      logMessage: "Error: email_not_confirmed - User email not confirmed.",
      toastMessage: "Don't worry, it happens! Please confirm your email.",
    },
  ],
  [
    "email_provider_disabled",
    {
      description:
        "Email signups are currently disabled. Please try another signup method.",
      logMessage:
        "Error: email_provider_disabled - Email/password signups are disabled.",
      toastMessage: "Email signups are disabled. Try another method.",
    },
  ],
  [
    "phone_exists",
    {
      description:
        "This phone number is already in use. Please try another phone number.",
      logMessage: "Error: phone_exists - Phone number already in use.",
      toastMessage: "Phone number already in use. Try another one.",
    },
  ],
  [
    "phone_not_confirmed",
    {
      description:
        "Your phone number is not confirmed. Please check for a confirmation message.",
      logMessage: "Error: phone_not_confirmed - User phone not confirmed.",
      toastMessage:
        "Don't worry, it happens! Please confirm your phone number.",
    },
  ],
  [
    "otp_expired",
    {
      description: "The OTP code has expired. Please request a new one.",
      logMessage: "Error: otp_expired - OTP code expired.",
      toastMessage: "OTP expired. Let's get you a new one.",
    },
  ],
  [
    "over_email_send_rate_limit",
    {
      description:
        "Too many emails have been sent to this address. Please wait a while before trying again.",
      logMessage: "Error: over_email_send_rate_limit - Too many emails sent.",
      toastMessage: "Too many emails sent. Please wait a while.",
    },
  ],
  [
    "over_request_rate_limit",
    {
      description:
        "Too many requests have been made. Please wait a while before trying again.",
      logMessage: "Error: over_request_rate_limit - Too many requests sent.",
      toastMessage: "Too many requests. Please wait a while.",
    },
  ],
  [
    "session_not_found",
    {
      description:
        "Your session has expired or is invalid. Please sign in again.",
      logMessage: "Error: session_not_found - Session not found.",
      toastMessage: "Session expired. Please sign in again.",
    },
  ],
  [
    "signup_disabled",
    {
      description: "Signups are currently disabled. Please try again later.",
      logMessage: "Error: signup_disabled - Signups are disabled.",
      toastMessage: "Signups are disabled. Try again later.",
    },
  ],
  [
    "user_not_found",
    {
      description:
        "No account found with this information. Please check and try again.",
      logMessage: "Error: user_not_found - User not found.",
      toastMessage: "User not found. Check your details.",
    },
  ],
  [
    "validation_failed",
    {
      description:
        "Some of the information provided is not in the expected format. Please check and try again.",
      logMessage: "Error: validation_failed - Validation failed.",
      toastMessage: "Validation failed. Please check your info.",
    },
  ],
  [
    "weak_password",
    {
      description:
        "The password provided is too weak. Please choose a stronger password.",
      logMessage: "Error: weak_password - Weak password.",
      toastMessage: "Weak password. Choose a stronger one.",
    },
  ],
]);
