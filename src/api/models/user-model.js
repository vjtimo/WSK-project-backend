import promisePool from '../../utils/database.js';
const getAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM kayttaja');
  return rows;
};
const addUser = async (user) => {
  const {tunnus, salasana} = user;
  const sql = `INSERT INTO kayttaja (tunnus, salasana)
               VALUES (?, ?)`;
  const params = [tunnus, salasana];
  const rows = await promisePool.execute(sql, params);

  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {user_id: rows[0].insertId};
};

export {getAllUsers, addUser};
