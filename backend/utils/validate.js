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

exports.validateBid = (bid_value, supporting_content, job_budget) => {
  const errors = {};

  if (!bid_value) {
    errors.bid_value = 'Missing bid value';
  } else if (isNaN(bid_value) || bid_value < 500) {
    errors.bid_value = 'Invalid bid value';
  } else if (bid_value > 1.5 * job_budget) {
    errors.bid_value = 'Bidding value is too high';
  }

  if (supporting_content && typeof supporting_content !== 'string') {
    errors.supporting_content = 'Supporting content must be a string';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};