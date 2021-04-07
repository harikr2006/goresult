var initNightmare  =  require('nightmare');

// Some options I set for all instances
const nightmareOptions = {
  gotoTimeout: 10000,
  loadTimeout: 15000,
};

class Nightmare {
  static getNewNightmare() {
    return initNightmare(nightmareOptions);
  }
}
