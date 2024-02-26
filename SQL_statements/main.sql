-- CREATE DATABASE 
DROP DATABASE IF EXISTS Dashify;
CREATE DATABASE Dashify;
USE Dashify;

-- INSERT TABLES
CREATE TABLE User (
    user_id int auto_increment,
    email varchar(50) NOT NULL,
    PRIMARY KEY (user_id, email)
);

-- INSERT TEST DATA
-- Test Data for User
INSERT INTO User (`email`) VALUES ('michaelong.2021@smu.edu.sg');