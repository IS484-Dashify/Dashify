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
INSERT INTO User (`email`) VALUES ('wanlin.tian.2021@smu.edu.sg');
INSERT INTO User (`email`) VALUES ('lionel.goh.2021@smu.edu.sg');
INSERT INTO User (`email`) VALUES ('rajendran2005@gmail.com');
INSERT INTO User (`email`) VALUES ('bhaktikanta@gmail.com');