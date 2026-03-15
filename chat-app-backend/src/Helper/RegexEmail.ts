export const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string) {
    if(!regexEmail.test(email)) {
        throw new Error("Valid Email is Required");
    }
    return email;
}

export function validateVerifyAccountInput(email: string, password: string) {
    if(!email || !password) {
        throw new Error("Email and Password is Required");
    }
    return { email, password };
}

export function validatePasswordInput(password: string) {
    if(!password) {
        throw new Error("Password is Required");
    }
}