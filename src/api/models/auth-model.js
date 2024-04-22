

const addUser = async (user) => {
  const { name, username, email, password } = user;
  const sql = `INSERT INTO users (name, username, email, password)
               VALUES (?, ?, ?, ?)`;
  const params = [name, username, email, password];
  const rows = await promisePool.execute(sql, params);

  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { user_id: rows[0].insertId };
};

export{addUser};
