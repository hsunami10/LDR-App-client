// NOTE: This file holds all helper functions

// ======================================== Authentication ========================================
// Checks for spaces and empty strings
export const isValidInput = input => {
  if (input instanceof Array) {
    for (let i = 0, len = input.length; i < len; ++i) {
      if (!input[i].trim()) return false;
    }
    return true;
  } else if (input instanceof String) {
    return input.trim();
  }
  return false;
};

// Checks for valid email format
export const isValidEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
