SELECT 
  k.tunnus AS kayttajanimi,  
  r.nimi AS ravintola_nimi,  
  t.tila AS status,          
  group_concat(p.nimi SEPARATOR ', ') AS tuotteet  
FROM 
  tilaus t
  JOIN ostoskori o ON t.ostoskori_id = o.id 
  JOIN kayttaja k ON o.user_id = k.id
  JOIN ostoskori_tuotteet ot ON o.id = ot.ostoskori_id  
  JOIN tuote p ON ot.tuote_id = p.id
  JOIN ravintola r ON t.ravintola_id = r.id
  WHERE t.id = 1
GROUP BY
  t.id;