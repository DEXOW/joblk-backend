let startTime = new Date();

exports.index = (req, res) => {
  function formateTime (time) {
    return time < 10 ? '0' + time : time;
  }
  
  let currentTime = new Date();
  let timeDifference = currentTime - startTime;
  let timeInSeconds = formateTime(Math.floor(timeDifference / 1000) % 60);
  let timeInMinutes = formateTime(Math.floor(timeDifference / 1000 / 60) % 60);
  let timeInHours = formateTime(Math.floor(timeDifference / 1000 / 60 / 60) % 24);
  res.json({ message: 'Server has been up for ' + timeInHours + ':' + timeInMinutes + ':' + timeInSeconds });
}