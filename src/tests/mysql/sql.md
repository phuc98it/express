// CREATE
CREATE TABLE test_table(
    id int NOT NULL,
    name varchar(255) DEFAULT NULL,
    age int DEFAULT NULL,
    address varchar(255) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

// CREATE PRODUCER
CREATE DEFINER=`tipjs`@`%` PROCEDURE `insert_data`()
BEGIN
DECLARE max_id INT DEFAULT 1000000;
DECLARE i INT DEFAULT 1;
WHILE i<= max_id DO
INSERT INTO test_table(id, name, age, address) VALUES (i, CONCAT('Name', i), i%100, CONCAT('Address', i));
SET i = i + 1;
END WHILE;
END


// PARTITION
CREATE TABLE orders (
    order_id INT,                   - key hoa don
    order_date DATE NOT NULL,       - ngay tao hoa don
    total_amount DECIMAL(10,2),     - tong tien
    PRIMARY KEY (order_id, order_date)
)

ALTER TABLE orders PARTITION BY RANGE COLUMNS(order_date) (
    PARTITION p0 VALUES LESS THAN ('2022-01-01'),
    PARTITION p2023 VALUES LESS THAN ('2023-01-01'),
    PARTITION p2024 VALUES LESS THAN ('2024-01-01'),
    PARTITION pmax VALUES LESS THAN (MAXVALUE)
);

-- select data
EXPLAIN SELECT * FROM orders;

-- insert data
INSERT INTO orders (order_id, order_date, total_amount) VALUES (1, '2021-10-10', 100.99);
INSERT INTO orders (order_id, order_date, total_amount) VALUES (2, '2022-10-10', 100.99);
INSERT INTO orders (order_id, order_date, total_amount) VALUES (3, '2023-10-10', 100.99);
INSERT INTO orders (order_id, order_date, total_amount) VALUES (4, '2024-10-10', 100.99);

-- select data by range
EXPLAIN SELECT * FROM orders PATITION (p2023);

EXPLAIN SELECT * FROM orders WHERE order_date >= '2022-01-01' AND order_date < '2024-01-01';


// Execute with WorkBench (add shopDev.<table_name>)
EXPLAIN SELECT * FROM shopDev.orders PARTITION (p2023);

SELECT * FROM shopDev.orders;

EXPLAIN SELECT * FROM shopDev.orders WHERE order_date >= '2022-01-01' AND order_date < '2024-01-01';


SHOW EVENTS;
SELECT NOW();


// show list Partition
SELECT PARTITION_NAME
FROM information_schema.PARTITIONS
WHERE table_schema = 'your_database_name'
  AND table_name = 'your_table_name'
  AND PARTITION_NAME IS NOT NULL;