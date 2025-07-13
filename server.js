const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));