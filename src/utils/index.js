export const oneOfList = (value, valueList) => {
  valueList.map((_val) => { if (_val === value) return true })
  return false
}
