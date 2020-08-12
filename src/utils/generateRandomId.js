const generateRandomId = function() {
  let timestamp = new Date().getTime()
  let randomNum = random(1, 100)
  return timestamp + randomNum
}

const random = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default generateRandomId