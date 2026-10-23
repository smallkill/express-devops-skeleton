module.exports = {
  port: process.env.PORT || 3000,
  // 部署在反向代理 / LB 後面時設 TRUST_PROXY(例如 1 或 'loopback'),
  // 讓 rate limit 用真實 client IP;沒有代理時保持未設定,避免 X-Forwarded-For 偽造。
  trustProxy: process.env.TRUST_PROXY || false,
  rateLimitPerMinute: Number(process.env.RATE_LIMIT_PER_MINUTE) || 100,
};
