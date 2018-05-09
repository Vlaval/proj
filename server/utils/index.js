module.exports = {
  arrToMap(arr) {
    return arr.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  },
  mapToArr(obj) {
    const arr = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) arr.push(obj[key]);
    }
    return arr;
  }
}