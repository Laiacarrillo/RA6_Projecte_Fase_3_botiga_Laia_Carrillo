-- Mostra tots els jocs del catàleg amb totes les seves columnes
SELECT * FROM jocs;

-- Mostra el títol i el preu dels jocs que costen menys de 35 euros
SELECT titol, preu FROM jocs WHERE preu < 35;

-- Mostra els jocs que costen menys de 35 euros i alhora estan disponibles (disponible = 1)
SELECT * FROM jocs WHERE preu < 35 AND disponible = 1;

-- Mostra els jocs que contenen la paraula 'Pixel' al títol
SELECT * FROM jocs WHERE titol LIKE '%Pixel%';

-- Mostra el títol i el preu dels jocs ordenats de més car a més barat
SELECT titol, preu FROM jocs ORDER BY preu DESC;

-- Mostra el títol i el preu dels jocs ordenats de més barat a més car
SELECT titol, preu FROM jocs ORDER BY preu ASC;

-- Calcula el nombre total de jocs, el preu mitjà i el preu màxim del catàleg
SELECT COUNT(*) AS total_jocs, AVG(preu) AS preu_mitja, MAX(preu) AS preu_maxim FROM jocs;

-- Mostra els jocs esgotats, és a dir, amb disponible igual a 0
SELECT * FROM jocs WHERE disponible = 0;

-- Afegeix un joc de prova amb el codi JOC-999
INSERT INTO jocs (codi, titol, preu, valoracio, data_sortida, descripcio, disponible)
VALUES ('JOC-999', 'Joc de Prova', 19.99, 7.5, '2026-11-24', 'Joc temporal per provar insercio, actualitzacio i esborrat.', 1);

-- Comprova que el joc de prova JOC-999 s'ha inserit correctament
SELECT * FROM jocs WHERE codi = 'JOC-999';

-- Marca el joc de prova JOC-999 com a esgotat (disponible = 0)
UPDATE jocs SET disponible = 0 WHERE codi = 'JOC-999';

-- Comprova el canvi aplicat al joc JOC-999 abans d'esborrar-lo
SELECT * FROM jocs WHERE codi = 'JOC-999';

-- Esborra el joc de prova JOC-999 de la taula
DELETE FROM jocs WHERE codi = 'JOC-999';

-- Comprova que la taula torna a tenir exactament els 8 jocs originals
SELECT COUNT(*) AS jocs_originals FROM jocs;