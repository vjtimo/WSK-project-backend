import promisePool from '../../utils/database.js';
const getAllPizzas = async () => {
  const [rows] = await promisePool.query('SELECT * FROM tuote WHERE kategoria_id = 1');
  return rows;
};

const createProduct = async (product) => {
  try {
    const [rows] = await promisePool.query(
      'INSERT INTO tuote (nimi, hinta, kuvaus_fi, kategoria_id) VALUES (?, ?, ?, ?)',
      [product.nimi, product.hinta, product.kuvaus_fi, product.kategoria_id]
    );
    return {error: false, message: 'Product created', result: rows};
  } catch (e) {
    return {error: true, message: e.message};
  }
};
export {getAllPizzas, createProduct};
