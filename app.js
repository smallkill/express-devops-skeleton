const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const healthRouter = require('./routes/health');
const exampleRouter = require('./routes/example');

const app = express();
app.disable('x-powered-by');
if (config.trustProxy) app.set('trust proxy', config.trustProxy);

app.use(helmet());
app.use(express.json({ limit: '100kb' }));

app.use('/health', healthRouter);
app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    limit: config.rateLimitPerMinute,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  }),
  exampleRouter
);

app.use((req, res) => {
  res.status(404).json({ error: 'not_found' });
});

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: status >= 500 ? 'internal_error' : err.type || 'bad_request',
  });
});

module.exports = app;
