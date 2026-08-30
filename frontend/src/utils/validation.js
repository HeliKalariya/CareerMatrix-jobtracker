export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) errors.email = 'Email address is required.';
  else if (!emailPattern.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  return errors;
};

export const validateRegistration = ({ name, email, password, confirmPassword }) => {
  const errors = validateLogin({ email, password });
  if (!name.trim()) errors.name = 'Your name is required.';
  else if (name.trim().length < 2) errors.name = 'Enter at least 2 characters.';
  if (password && password.length < 8) errors.password = 'Use at least 8 characters.';
  else if (password && !/[A-Z]/.test(password)) errors.password = 'Include at least one uppercase letter.';
  else if (password && !/[0-9]/.test(password)) errors.password = 'Include at least one number.';
  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.';
  else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  return errors;
};
