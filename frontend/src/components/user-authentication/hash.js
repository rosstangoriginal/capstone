export function getHashedPassword(password) {
    const CryptoJS = require('crypto-js');
    return CryptoJS.SHA256(password).toString();
  }
  
  export function checkPassword(inputedPassword, storedPassword) {
    var hashedPassword = getHashedPassword(inputedPassword);
    return storedPassword === hashedPassword;
  }

  
  