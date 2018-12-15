export const orderToArrData = (array, objOfObj) => {
  const length = array.length;
  const result = new Array(length);
  for (let i = 0; i < length; i++) {
    const key = array[i];
    if (objOfObj.hasOwnProperty(key)) {
      result[i] = objOfObj[array[i]];
    }
  }
  return result;
};
