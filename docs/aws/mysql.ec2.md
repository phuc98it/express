sudo amazon-linux-extras install epel -y    : cho phép các đặt các gói package cần thiết.

cd  
sudo yum localinstall mysql84-community-release-{platform}-{version-number}.noarch.rpm

sudo yum install mysql-community-server

sudo systemctl enable mysqld

sudo systemctl start mysqld

sudo systemctl status mysqld        -> active (running)

sudo cat /var/log/mysqld.log | grep "temporary password"


mysql -uroot -p

AFTER USER root@'localhost' IDENTIFIED WITH mysql_native_password BY 'AaaaBbbb1!';

show databases;

use ShopDemo;       // truy cập vào database cụ thể

show tables;        // hiển thị các bảng trong database đó.


*) Tài liệu hướng dẫn : https://dev.mysql.com/doc/refman/8.4/en/linux-installation-yum-repo.html

Tạo Account - cho phép user khác chỉ có quyền truy cập vào DB chỉ định.

CREATE USER 'acc1'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Abcd_123!';

GRANT ALL PRIVILEGES ON shopDEMO.* TO 'acc1'@'localhost';   // cấp quyền tương tác DB 'shopDEMO' cho ' 
