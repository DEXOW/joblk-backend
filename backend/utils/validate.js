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

exports.validateLink = (link) => {
  const re = /^(http|https):\/\/[^ "]+$/;
  return re.test(link);
};

exports.validateBid = (bid_value, budget) => {
  bid_value = Number(bid_value);

  console.log(`Bid Value: ${bid_value}`);
  console.log(`Budget: ${budget}`);

  if (!bid_value) {
    return 'Missing bid value';
  } else if (isNaN(bid_value) || bid_value < 500) {
    return 'Invalid bid value';
  } else if (bid_value > budget*1.5) {
    return 'Bid value too high';
  }

  return '';
};