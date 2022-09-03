
export default data => {
  const result = {}
  data.forEach(player => {
    for (const [key, value] of Object.entries(player)) {
      if (result[key] && !Number.isNaN(Number(value))) {
        result[key] += (Number(value) * 1)
      } else {
        if (Number.isNaN(Number(value))) {
          result[key] = value
        } else {
          result[key] = (value * 1)
        }
      }
    }
  })
  if (result.ts_pct) {
    for (const [key, value] of Object.entries(result)) {
      if (!Number.isNaN(Number(value))) {
        result[key] = (Number(value) / 10).toFixed(3)
      }
    }
  }
  return result
}
