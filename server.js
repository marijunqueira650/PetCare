const express = require('express');

const ROOT = __dirname;
const SITE_PATHS = new Set(['/', '/index.html', '/script.js', '/styles.css']);

function createApp(root = ROOT) {
  const app = express();

  app.use((req, res, next) => {
    if (!SITE_PATHS.has(req.path)) return res.status(404).send('Not found.');
    next();
  });
  app.use(express.static(root, { dotfiles: 'deny', index: 'index.html' }));

  return app;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createApp().listen(port, '0.0.0.0', () => {
    console.log(`PetCare disponível em http://localhost:${port}`);
  });
}

module.exports = { createApp };
