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



-- 1.shopdev_user
DROP TABLE IF EXISTS `shopdev_user`;
CREATE TABLE `shopdev_user` (
 user_id int NOT NULL AUTO_INCREMENT COMMENT 'user id',
 user_name VARCHAR(255) NULL DEFAULT NULL COMMENT 'user name',
 user_email VARCHAR(255) NULL DEFAULT NULL COMMENT 'email user',
 PRIMARY KEY (`user_id`)
) ENGINE = INNODB CHARACTER SET = utf8mb4;

-- run mock DATA
INSERT INTO shopdev_user VALUES(1, 'admin', 'admin@anonystick.com');
INSERT INTO shopdev_user VALUES(2, 'shop', 'shop@anonystick.com');
INSERT INTO shopdev_user VALUES(3, 'user', 'user@anonystick.com');


-- 2.shopdev_role
DROP TABLE IF EXISTS `shopdev_role`;
CREATE TABLE `shopdev_role` (
 role_id int NOT NULL COMMENT 'role id',
 role_name VARCHAR(255) NULL DEFAULT NULL COMMENT 'role name',
 role_description VARCHAR(255) NULL DEFAULT NULL COMMENT 'role description',
 PRIMARY KEY (`role_id`)
) ENGINE = INNODB CHARACTER SET = utf8mb4;

-- run mock DATA

INSERT INTO shopdev_role VALUES(1, 'admin', 'read,update,delete,create');
INSERT INTO shopdev_role VALUES(2, 'shop', 'read,update,create');
INSERT INTO shopdev_role VALUES(3, 'user', 'read');

-- 3.shopdev_menu
-- menu A, B, C set for role ?
DROP TABLE IF EXISTS `shopdev_menu`;
CREATE TABLE `shopdev_menu` (
 menu_id int NOT NULL AUTO_INCREMENT COMMENT 'menu_id',
 menu_name VARCHAR(255) NULL DEFAULT NULL COMMENT 'name menu',
 menu_pid VARCHAR(255) NULL DEFAULT NULL COMMENT 'name menu',
 menu_path VARCHAR(255) NULL DEFAULT NULL COMMENT 'path',
 PRIMARY KEY (`menu_id`)
) ENGINE = INNODB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4;

-- run mock DATA
-- https://shopee.vn/%C4%90%E1%BB%93ng-H...
INSERT INTO shopdev_menu VALUES(11, 'Dong ho', '11035788', '/Đồng-Hồ-cat.11035788');
INSERT INTO shopdev_menu VALUES(12, 'may tinh', '11035954', '/Máy-Tính-Laptop-cat.11035954');
INSERT INTO shopdev_menu VALUES(13, 'thoi trang nam', '11035567', '/Thời-Trang-Nam-cat.11035567');

-- 4.shopdev_role_menu
-- gan menu nao cho role nao? ex: Dong ho, may tinh, thoi trang nam cho admin, may tinh cho shop
DROP TABLE IF EXISTS `shopdev_role_menu`;
CREATE TABLE `shopdev_role_menu` (
 role_id int NOT NULL COMMENT 'role id',
 menu_id int NOT NULL COMMENT 'menu id',
 PRIMARY KEY (`role_id`, `menu_id`)
) ENGINE = INNODB CHARACTER SET = utf8mb4;

-- run mock DATA
INSERT INTO shopdev_role_menu VALUES(1, 11);
INSERT INTO shopdev_role_menu VALUES(1, 12);
INSERT INTO shopdev_role_menu VALUES(1, 13);
INSERT INTO shopdev_role_menu VALUES(2, 12);
INSERT INTO shopdev_role_menu VALUES(2, 13);
INSERT INTO shopdev_role_menu VALUES(3, 13);

-- shopdev_user_role
DROP TABLE IF EXISTS `shopdev_user_role`;
CREATE TABLE `shopdev_user_role` (
 user_id int NOT NULL COMMENT 'user id',
 role_id int NOT NULL COMMENT 'role id',
 PRIMARY KEY (`user_id`, `role_id`)
) ENGINE = INNODB CHARACTER SET = utf8mb4;

-- run mock DATA
INSERT INTO shopdev_user_role VALUES(1, 1);
INSERT INTO shopdev_user_role VALUES(2, 2);
INSERT INTO shopdev_user_role VALUES(3, 3);



-- run mock DATA
INSERT INTO shopdev_user VALUES(1, 'admin', 'admin@anonystick.com');
INSERT INTO shopdev_user VALUES(2, 'shop', 'shop@anonystick.com');
INSERT INTO shopdev_user VALUES(3, 'user', 'user@anonystick.com');

INSERT INTO shopdev_role VALUES(1, 'admin', 'read,update,delete,create');
INSERT INTO shopdev_role VALUES(2, 'shop', 'read,update,create');
INSERT INTO shopdev_role VALUES(3, 'user', 'read');

INSERT INTO shopdev_user_role VALUES(1, 1);
INSERT INTO shopdev_user_role VALUES(2, 2);
INSERT INTO shopdev_user_role VALUES(3, 3);



INSERT INTO shopdev_menu VALUES(11, 'Dong ho', '11035788', '/Đồng-Hồ-cat.11035788');
INSERT INTO shopdev_menu VALUES(12, 'may tinh', '11035954', '/Máy-Tính-Laptop-cat.11035954');
INSERT INTO shopdev_menu VALUES(13, 'thoi trang nam', '11035567', '/Thời-Trang-Nam-cat.11035567');

INSERT INTO shopdev_role_menu VALUES(1, 11);
INSERT INTO shopdev_role_menu VALUES(1, 12);
INSERT INTO shopdev_role_menu VALUES(1, 13);
INSERT INTO shopdev_role_menu VALUES(2, 12);
INSERT INTO shopdev_role_menu VALUES(2, 13);
INSERT INTO shopdev_role_menu VALUES(3, 13);




-- tb_spu

CREATE TABLE `sd_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productId` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `product_name` varchar(64) DEFAULT NULL COMMENT 'spu name',
  `product_desc` varchar(256) DEFAULT NULL COMMENT 'spu desc',
  `product_status` tinyint(4) DEFAULT NULL COMMENT '0: out of stock, 1: in stock ',
  `product_attrs` json DEFAULT NULL COMMENT 'json attributes',
  `product_shopId` bigint(20) DEFAULT NULL COMMENT 'id shop',
  `is_deleted` tinyint(1) unsigned DEFAULT '0' COMMENT '0:delete 1:null',
  `sort` int(10) DEFAULT '0' COMMENT 'piority sort',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'created timestamp',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'updated timestamp',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='spu';


-- tb_sku

CREATE TABLE `sku` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sku_no` varchar(32) DEFAULT '' COMMENT 'sku_no',
  `sku_name` varchar(50) DEFAULT NULL COMMENT 'sku_name',
  `sku_description` varchar(256) DEFAULT NULL COMMENT 'sku_description',
  `sku_type` tinyint(4) DEFAULT NULL COMMENT 'sku_type',
  `status` tinyint(4) NOT NULL COMMENT 'status',
  `sort` int(10) DEFAULT '0' COMMENT 'piority sort',
  `sku_stock` int(11) NOT NULL DEFAULT '0' COMMENT 'sku_stock',
  `sku_price` decimal(8,2) NOT NULL COMMENT 'sku_price',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'update_time',
  PRIMARY KEY(`id`) USING BTREE,
  UNIQUE KEY `uk_sku_no` (`sku_no`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4 COMMENT = 'sku'


-- tb_sku_attr

CREATE TABLE `sku_attr` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sku_no` varchar(32) DEFAULT '' COMMENT 'sku_no',
  `sku_stock` int(11) NOT NULL DEFAULT '0' COMMENT 'sku_stock',
  `sku_price` decimal(8,2) NOT NULL COMMENT 'sku_price',
  `sku_attrs` json DEFAULT NULL COMMENT 'sku_attrs',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'update_time',
  PRIMARY KEY(`id`) USING BTREE,
  UNIQUE KEY `uk_sku_no` (`sku_no`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4 COMMENT = 'sku_attr'


-- tb_sku_specs

CREATE TABLE `sku_attr` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `spu_specs` json DEFAULT NULL COMMENT 'attributes',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='spu';


-- tb_spu_to_sku

CREATE TABLE `spu_to_sku` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `sku_no` varchar(32) NOT NULL DEFAULT '' COMMENT 'sku id',
  `spu_no` varchar(32) NOT NULL DEFAULT '' COMMENT 'spu id',
  `is_deleted` tinyint(1) DEFAULT '0' COMMENT '0:deleted 1:nul',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'update_time',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_spu_to_sku` (`spu_no`,`sku_no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='spu_to_sku';