import promisePool from '../../utils/database.js';

const addOrder = async (rid, oid, toimitustapa) => {
  try {
    await promisePool.query('START TRANSACTION');

    await promisePool.query(
      `INSERT INTO tilaus(ravintola_id,ostoskori_id,toimitustapa) VALUES (?,?,?)`,
      [rid, oid, toimitustapa]
    );

    await promisePool.query(`UPDATE ostoskori SET active = 0 WHERE id = ?`, [
      oid,
    ]);

    const [salesArray] = await promisePool.query(
      `SELECT tuote_id, maara FROM ostoskori_tuotteet WHERE ostoskori_id = ?`,
      [oid]
    );
    const ids = salesArray.map((sales) => sales.tuote_id);
    const idPlaceholders = ids.map(() => '?').join(', ');

    const caseStatement = salesArray
      .map(
        (sales) => `
      WHEN ? THEN ?
    `
      )
      .join(' ');

    const query = `
      UPDATE tuote
      SET sales = sales + CASE id
      ${caseStatement}
      END
      WHERE id IN (${idPlaceholders});
    `;

    const params = [];
    salesArray.forEach((sales) => {
      params.push(sales.tuote_id);
      params.push(sales.maara);
    });
    params.push(...ids);

    const [result] = await promisePool.query(query, params);
    if (result.affectedRows === 0) {
      console.warn('No rows were updated');
      await promisePool.query('ROLLBACK');
      return false;
    }
    const [rows] = await promisePool.query(
      `INSERT INTO ostoskori (user_id)
       SELECT user_id
       FROM ostoskori
       WHERE id = ?
       LIMIT 1`,
      [oid]
    );
    await promisePool.query('COMMIT');

    return rows;
  } catch (e) {
    console.error('Error in addOrder:', e);
    throw new Error(`Failed to add order: ${e.message}`);
  }
};

const findOrders = async () => {
  const sql = `SELECT k.tunnus AS kayttajanimi,
  r.nimi AS ravintola_nimi,
  t.tilausaika,
  t.id,
  tila.id AS statusId,
  tila.tila as statusText,
  group_concat(
      CONCAT(p.nimi, ' (x', ot.maara, ')') SEPARATOR ', '
  ) AS tuotteet
FROM tilaus t
  JOIN tila on t.tilaId = tila.id
  JOIN ostoskori o ON t.ostoskori_id = o.id
  JOIN kayttaja k ON o.user_id = k.id
  JOIN ostoskori_tuotteet ot ON o.id = ot.ostoskori_id
  JOIN tuote p ON ot.tuote_id = p.id
  JOIN ravintola r ON t.ravintola_id = r.id
GROUP BY t.id,
  k.tunnus,
  r.nimi,
  tila;`;

  try {
    const [rows] = await promisePool.execute(sql);
    return rows;
  } catch (e) {
    console.error(e.message);
    throw new Error(`Failed to find orders: ${e.message}`);
  }
};
const findOrderById = async (id) => {
  const sql = `SELECT k.tunnus AS kayttajanimi,
  r.nimi AS ravintola_nimi,
  t.tilausaika,
  t.id,
  tila.id AS statusId,
  tila.tila as statusText,
  group_concat(
      CONCAT(p.nimi, ' (x', ot.maara, ')') SEPARATOR ', '
  ) AS tuotteet
FROM tilaus t
  JOIN tila on t.tilaId = tila.id
  JOIN ostoskori o ON t.ostoskori_id = o.id
  JOIN kayttaja k ON o.user_id = k.id
  JOIN ostoskori_tuotteet ot ON o.id = ot.ostoskori_id
  JOIN tuote p ON ot.tuote_id = p.id
  JOIN ravintola r ON t.ravintola_id = r.id
  WHERE t.id = ?
GROUP BY t.id,
  k.tunnus,
  r.nimi,
  tila
  `;

  try {
    const [rows] = await promisePool.execute(sql, [id]);
    console.log;
    return rows;
  } catch (e) {
    console.error(e.message);
    throw new Error(`Failed to find order with ID ${id}: ${e.message}`);
  }
};
const updateStatus = async (id, status) => {
  status++;
  const sql = `UPDATE tilaus SET tilaId = ? where id= ? `;
  try {
    const rows = promisePool.query(sql, [status, id]);
    return rows;
  } catch (e) {
    console.error('Error finding user:', e.message);
    throw new Error(`Failed to update order with ID ${id}: ${e.message}`);
  }
};

export {addOrder, findOrders, updateStatus, findOrderById};
