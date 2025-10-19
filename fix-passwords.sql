-- ================================================
-- 🔐 AURA - Mise à Jour des Mots de Passe
-- ================================================
-- Ce script met à jour les hashs bcrypt corrects

USE aura_db;

-- Mettre à jour les mots de passe avec les bons hashs
UPDATE users SET password = '$2b$10$RDuLt8bkHojShTim5nepP.MN6lIjcOcEoIa0Rn6JYWoIUy1d7Qtf6' WHERE username = 'bakr_sassi';
UPDATE users SET password = '$2b$10$wJ2XnMaAAMMA2yWdadNRnOZ754B7O193y5EEZNks1czIztx9bY66C' WHERE username = 'john_doe';
UPDATE users SET password = '$2b$10$KwnkW5v.0nvnjVSRFQCHhuCY/gDpMIQUgg2X4T3iOeQ9xFTXQJ17S' WHERE username = 'jane_smith';
UPDATE users SET password = '$2b$10$Yh6D6fN/6JffcD2tH.X3zun6NU5VFfl9ZxYKyAlymqFqVt5UXnemG' WHERE username = 'admin';

-- Vérifier les mises à jour
SELECT 
    username, 
    email, 
    role,
    SUBSTRING(password, 1, 20) as password_hash_preview
FROM users
ORDER BY id;

SELECT '✅ Mots de passe mis à jour avec succès!' as status;
