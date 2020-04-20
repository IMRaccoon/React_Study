use loginservice;

DROP TABLE IF EXISTS Account;

create table Account (  
    id int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username varchar(255),
    password varchar(255),
    salt varchar(255),
    created DATETIME DEFAULT CURRENT_TIMESTAMP
);