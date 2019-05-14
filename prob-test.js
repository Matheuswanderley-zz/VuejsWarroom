const MAX = 1001
const dp = Array(MAX).fill(0)
const precomputeLogTable = () => {
  const { log2 } = Math
  for (let i = 2; i < MAX; i++) {
    dp[i] = log2(i) + dp[i - 1]
  }
}

const positions = {
  afavor: 30,
  centro: 433,
  concordante: 3,
  contra: 38,
  discordante: 9,
}

const probability = (k, n) => {
  const { pow } = Math
  let result = 0
  for (let i = k; i <= n; i++) {
    const prod = dp[n] - dp[i] - dp[n - i] - n
    result += pow(2, prod)
  }
  return result
}
const approvalProb = (summary, goal) => {
  if (summary.centro > 513 / 2) return NaN
  const wieghts = { afavor: 1, concordante: .7, centro: .5, discordante: .2, contra: 0 }
  const n = summary.centro
  const k = goal - summary.concordante - summary.afavor
  return probability(k, n).toFixed(10) * 100
}

precomputeLogTable()
console.log(approvalProb(positions, 308))
// approvalProb(positions, goal)