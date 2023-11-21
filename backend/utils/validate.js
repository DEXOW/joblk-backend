exports.validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

exports.validateUsername = (username) => {
  const re = /^[a-zA-Z0-9_]{3,15}$/;
  return re.test(username);
}

exports.validatePassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
}

exports.validateOTP = (otp) => {
  const re = /^[0-9]{6}$/;
  return re.test(otp);
}