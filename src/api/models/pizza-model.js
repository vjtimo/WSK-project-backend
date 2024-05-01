import promisePool from '../../utils/database.js';
const getAllPizzas = async () => {
  const [rows] = await promisePool.query(
    'SELECT * FROM tuote WHERE kategoria_id = 1'
  );
  return rows;
};

const findPizzasById = async (...ids) => {
  const placeholders = ids.map(() => '?').join(', ');

  const [rows] = await promisePool.query(
    `SELECT * FROM tuote WHERE id IN (${placeholders})`,
    ids
  );
  return rows;
};
export {getAllPizzas, findPizzasById};
