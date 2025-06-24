const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🤖 Bot WhatsApp rodando no Railway!');
});

app.listen(port, () => {
  console.log(`✅ Servidor Express ativo na porta ${port}`);
});
