export const orderToArrData = (orderArr, objOfObj) => {
  const length = orderArr.length;
  const result = [];
  for (let i = 0; i < length; i++) {
    const key = orderArr[i];
    if (objOfObj.hasOwnProperty(key)) {
      result.push(objOfObj[orderArr[i]]);
    }
  }
  return result;
};
