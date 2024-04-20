import promisePool from '../../utils/database.js';
const getAllPizzas = async () => {
  const [rows] = await promisePool.query('SELECT * FROM tuote WHERE kategoria_id = 1');
  return rows;
};
export {getAllPizzas};
