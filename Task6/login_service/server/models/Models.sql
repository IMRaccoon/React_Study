use loginservice;

DROP TABLE IF EXISTS Models;

create table Models (  
    id int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    writer varchar(255),
    contents varchar(255),
    starred JSON,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_edited BOOLEAN NOT NULL DEFAULT 0
);