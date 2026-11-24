CREATE TABLE jocs (
  codi TEXT PRIMARY KEY,
  titol TEXT NOT NULL,
  preu REAL NOT NULL,
  valoracio REAL,
  data_sortida TEXT,
  descripcio TEXT,
  disponible INTEGER NOT NULL
);

INSERT INTO jocs (codi, titol, preu, valoracio, data_sortida, descripcio, disponible)
VALUES ('JOC-001', 'ComandamentsConquesta', 39.99, 8.7, '2025-03-15', 'Un joc d '' estrategia en temps real on hauras de construir la teva base i dirigir els teus exercits.', 1);

INSERT INTO jocs (codi, titol, preu, valoracio, data_sortida, descripcio, disponible)
VALUES ('JOC-002', 'Neon Runner', 24.99, 9.1, '2024-11-20', 'Corre per una ciutat futurista plena d''obstacles, enemics i secrets amagats.', 1);

INSERT INTO jocs (codi, titol, preu, valoracio, data_sortida, descripcio, disponible)
VALUES ('JOC-003', 'Kingdoms of Eldoria', 49.99, 9.4, '2025-06-10', 'Explora un immens regne fantastic, completa missions i descobreix una historia plena de misteris.', 1);

INSERT INTO jocs (codi, titol, preu, valoracio, data_sortida, descripcio, disponible)
VALUES ('JOC-004', 'Pixel Kart Turbo', 29.99, 8.2, '2023-09-05', 'Participa en curses frenetiques amb pilots extravagants i circuits plens de sorpreses.', 1);

INSERT INTO jocs (codi, titol, preu, valoracio, data_sortida, descripcio, disponible)
VALUES ('JOC-005', 'Haunted Mansion', 34.99, 8.9, '2024-10-31', 'Investiga una mansio abandonada i resol els seus enigmes mentre descobreixes el seu fosc passat.', 1);

INSERT INTO jocs (codi, titol, preu, valoracio, data_sortida, descripcio, disponible)
VALUES ('JOC-006', 'Galaxy Explorer', 44.99, 8.5, '2025-01-22', 'Viatja per l''espai, descobreix nous planetes i gestiona els recursos de la teva nau.', 1);

INSERT INTO jocs (codi, titol, preu, valoracio, data_sortida, descripcio, disponible)
VALUES ('JOC-007', 'Mind Puzzle', 14.99, 8.0, '2022-05-18', 'Supera centenars de reptes mentals que augmenten progressivament de dificultat.', 1);

INSERT INTO jocs (codi, titol, preu, valoracio, data_sortida, descripcio, disponible)
VALUES ('JOC-008', 'Samurai Shadows', 54.99, 9.0, '2025-08-14', 'Converteix-te en un samurai i recorre un Japo feudal ple d''enemics i aventures.', 1);