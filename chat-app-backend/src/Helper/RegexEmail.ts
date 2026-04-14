export const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string) {
  if (!regexEmail.test(email)) {
    throw new Error("Valid email is required.");
  }
  return email;
}

export function validatePasswordInput(password: string) {
  if (!password) {
    throw new Error("Password is required.");
  }
  return password;
}

// Specific validator for verification by ID
export function validateVerifyAccountId(id: number) {
  if (!id || id <= 0) {
    throw new Error("Valid user ID is required.");
  }
  return id;
}