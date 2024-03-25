const express = require('express');
const setup = require('./src/configuration/setup');

const app = express();
setup(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});