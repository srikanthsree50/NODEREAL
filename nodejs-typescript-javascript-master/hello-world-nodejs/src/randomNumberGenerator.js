var getRandomNumber = function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

module.exports = {getRandomNumber};
