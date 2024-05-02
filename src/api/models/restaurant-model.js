import promisePool from '../../utils/database.js';
const findRestaurants = async () => {
  const [rows] = await promisePool.query('SELECT * FROM ravintola');
  return rows;
};
export {findRestaurants};
