import promisePool from '../../utils/database.js';
const getAllPizzas = async () => {
  const [rows] = await promisePool.query('SELECT * FROM pizza');
  return rows;
};
export {getAllPizzas};
