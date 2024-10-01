CREATE TABLE shopDev.users (
	usr_id INT NOT NULL AUTO_INCREMENT,
    usr_age INT DEFAULT '0',
    usr_status INT DEFAULT '0',
    usr_name VARCHAR(128) COLLATE utf8mb4_bin DEFAULT NULL,
    usr_email VARCHAR(128) COLLATE utf8mb4_bin DEFAULT NULL,
    usr_address VARCHAR(128) COLLATE utf8mb4_bin DEFAULT NULL,
    -- KEY Idx
    PRIMARY KEY (usr_id),
    KEY `idx_email_age_name` (usr_email, usr_age, usr_name),
    KEY `idx_status` (usr_status)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_bin;

-- Insert values
INSERT INTO shopDev.users (usr_id, usr_age, usr_status, usr_name, usr_email, usr_address ) VALUES (
	1, 36, 1, 'Messi', 'messi@email.com', '01, Argentia city'
);

INSERT INTO shopDev.users (usr_id, usr_age, usr_status, usr_name, usr_email, usr_address ) VALUES (
	2, 38, 0, 'Ronaldo', 'Ronaldo@email.com', '02, Porl city'
);

INSERT INTO shopDev.users (usr_age, usr_status, usr_name, usr_email, usr_address ) VALUES (
	26, 1, 'Phuc', 'phuc@email.com', '04, Thai Binh city'
);

SELECT version();

EXPLAIN SELECT * FROM shopDev.users;					-- SCAN All

EXPLAIN SELECT * FROM shopDev.users WHERE usr_id=1;		-- idx: PRIMARY KEY

-- execute with idx - because use 'usr_email' ngoài cùng bên trái của chỉ mục tổ hợp.
EXPLAIN SELECT * FROM shopDev.users WHERE usr_email='phuc@email.com';
EXPLAIN SELECT * FROM shopDev.users WHERE usr_email='Ronaldo@email.com' AND usr_name='Ronaldo';
EXPLAIN SELECT * FROM shopDev.users WHERE usr_email='messi@email.com' AND usr_age=36 AND  usr_name='Messi';
EXPLAIN SELECT * FROM shopDev.users WHERE usr_status='1';
EXPLAIN SELECT * FROM shopDev.users WHERE usr_address='03' AND usr_email='phuc@email.com';


EXPLAIN SELECT usr_age, usr_name FROM shopDev.users WHERE usr_name='Ronaldo';       -- idx
EXPLAIN SELECT usr_name FROM shopDev.users WHERE usr_age=36;                        -- idx

EXPLAIN SELECT usr_age, usr_name, usr_address FROM shopDev.users WHERE usr_age=36;  -- not idx

-- execute without idx - ko có 'usr_email' ngoài cùng bên trái.
EXPLAIN SELECT * FROM shopDev.users WHERE usr_age=36;
EXPLAIN SELECT * FROM shopDev.users WHERE usr_id + 1 = 3;
EXPLAIN SELECT * FROM shopDev.users WHERE substr(usr_status, 1, 2) = 1;


EXPLAIN SELECT * FROM shopDev.users WHERE usr_id=1 OR usr_status=0;                         -- use idx
EXPLAIN SELECT * FROM shopDev.users WHERE usr_id=1 OR usr_status=0 OR usr_address='03';     -- not use idx - vì có 'usr_address'



