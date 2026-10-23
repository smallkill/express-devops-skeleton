const exampleService = require('../services/exampleService');

const getHello = (req, res) => {
  const message = exampleService.getHelloMessage(
    typeof req.query.name === 'string'
      ? req.query.name.slice(0, 100)
      : undefined
  );
  res.json({ message });
};

const getItems = (req, res) => {
  const items = exampleService.getItems();
  res.json({ items });
};

module.exports = {
  getHello,
  getItems,
};
