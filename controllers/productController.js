const db = require('../firebase');

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const newProductRef = db.collection('products').doc();

    const productData = {
      id: newProductRef.id,
      name,
      description,
      price,
      createdAt: new Date(), // ✅ Timestamp
    };

    await newProductRef.set(productData);
    res.status(201).json(productData);
  } catch (error) {
    console.error('❌ Add Product Error:', error);
    res.status(500).json({ message: 'Failed to add product' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const snapshot = await db
      .collection('products')
      .orderBy('createdAt', 'asc') // ✅ Sorted
      .get();

    const products = snapshot.docs.map(doc => doc.data());
    res.json(products);
  } catch (error) {
    console.error('❌ Get All Products Error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price } = req.body;

    const productRef = db.collection('products').doc(id);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await productRef.update({ name, description, price });
    res.json({ id, name, description, price });
  } catch (error) {
    console.error('❌ Update Product Error:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const productRef = db.collection('products').doc(id);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await productRef.delete();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('❌ Delete Product Error:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};
