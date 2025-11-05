export const validateName = (name) =>
  typeof name === "string" && name.trim().length >= 2;


export const validateEmail = (email) =>
  typeof email === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());


export const validatePassword = (pw) => typeof pw === "string" && pw.length >= 6;

export const generateOTP = () => {
  return Math.floor(100000+Math.random() * 900000).toString();
};
