export const randomCodeGenerator = () => {
    const randomCode = String(
        Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
      );
    return randomCode;
}

export function sendEmail(to:string, subject:string, body:string) {
  const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
}