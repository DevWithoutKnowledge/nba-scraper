const firstWeight = 1.3
const weightDiff = 0.1
// rename to weighted average
export default data => {
  const result = {}
  let i = firstWeight
  let weightSum = 0
  data.forEach(player => {
    for (const [key, value] of Object.entries(player)) {
      if (result[key] && !Number.isNaN(Number(value))) {
        result[key] += (Number(value) * i)
      } else {
        if (Number.isNaN(Number(value))) {
          result[key] = value
        } else {
          result[key] = (value * i)
        }
      }
    }
    weightSum += i
    i = i - weightDiff
  })
  for (const [key, value] of Object.entries(result)) {
    if (!Number.isNaN(Number(value))) {
      result[key] = (Number(value) / weightSum).toFixed(3)
    }
  }
  return result
}
