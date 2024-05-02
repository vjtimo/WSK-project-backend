import promisePool from '../../utils/database.js';

const addOrder = async (rid, oid) => {
  try {
    const sql = `INSERT INTO tilaus(ravintola_id,ostoskori_id) VALUES (?,?)`;
    const [rows] = await promisePool.execute(sql, [rid, oid]);
    return rows;
  } catch (e) {
    e.message('cannot add');
  }
};
export {addOrder};
