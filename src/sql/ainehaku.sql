SELECT tuote.*,
    group_concat(a.nimi_fi separator ", ") as ainesosat
FROM tuote
    left JOIN tuoteainekset as ta ON tuote.id = ta.tuote_id
    left JOIN aineosa as a on ta.aine_id = a.id
GROUP by tuote.id