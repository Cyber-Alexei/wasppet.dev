// Function to check the security of the password
export function passwordSecurity(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
  
    // Returns true only if both conditions are true
    return hasUpperCase && hasNumber;
  }
  
// Function to check the length of the password
export function passwordLength(password: string): boolean {
return password.length >= 9;
}