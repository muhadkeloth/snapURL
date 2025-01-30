


export const isValidUrl = (url: string): boolean => {
    try {
        const parsedUrl = new URL(url);
        return /^https?:\/\//.test(parsedUrl.href);;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export function emailValidation(email:string):boolean{
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

export function passwordValidation(password:string):string|boolean{
    if (password.length < 8 || password.length > 14) return "Password must be between 8 and 14 characters."
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter."
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter."
    if (!/[0-9]/.test(password)) return "Password must contain at least one number."
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))return "Password contain at least one special character."
    return false
}

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred';
  };