export const sortObject = (object, callback) => {
  var arrayTemp = []
  var objectTemp = []
  for (let prop in object) {
    if (object.hasOwnProperty(prop)) {
      arrayTemp.push({
        'key': prop,
        'value': object[prop]
      })
    }
  }
  arrayTemp.sort(function(a, b) {
    return callback(a, b)
  })

  let countOfArray = arrayTemp.length
  for (let i = 0; i < countOfArray; i++) {
    objectTemp[arrayTemp[i]['key']] = arrayTemp[i]['value']
  }
  return objectTemp
}
