exports.validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

exports.validateUsername = (username) => {
  const re = /^[a-zA-Z0-9_]{3,15}$/;
  return re.test(username);
}

exports.validateName = (name) => {
  const re = /^[a-zA-Z\s]{3,20}$/;
  return re.test(name);
}

exports.validatePassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
}

exports.validateOTP = (otp) => {
  const re = /^[0-9]{6}$/;
  return re.test(otp);
}

exports.validateTitle = (title) => {
  const re = /^[a-zA-Z0-9\s.,()#\-_\[\]]{3,}$/;
  return re.test(title);
};

exports.validateBudget = (budget) => {
  const re = /^[-\d\s]{1,}$/;
  return re.test(budget);
};
