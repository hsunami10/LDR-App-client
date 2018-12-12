// NOTE: This file contains helper functions for text parsing
export const isValidCredentials = arr => {
  let msg = '';
  let type = '';
  let index = 0;
  for (let i = 0, len = arr.length; i < len; i++) {
    index = i;
    if (hasTrailingSpaces(arr[i])) msg = 'No trailing spaces';
    if (arr[i].trim().includes(' ')) msg = 'Cannot have spaces between characters';
    if (arr[i].length === 0) msg = 'Invalid username or password';
    if (msg.length > 0) break;
  }
  if (index === 0) type = 'username';
  else type = 'password';
  return {
    status: msg.length === 0,
    type: msg.includes('username') && msg.includes('password') ? '' : type,
    msg
  };
};

export const hasTrailingSpaces = input => {
  if (input instanceof Array) {
    for (let i = 0, len = input.length; i < len; i++) {
      if (input[i].trim().length !== input[i].length) return true;
    }
  } else if (typeof input === 'string') {
    return input.trim().length !== input.length;
  }
  return false;
};

// Checks for empty strings, only spaces strings, trailing spaces
export const isValidName = input => {
  return input.trim() !== '' && !hasTrailingSpaces(input);
};

// Checks for valid email format
export const isValidEmail = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
