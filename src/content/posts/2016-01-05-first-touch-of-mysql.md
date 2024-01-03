---
isPublish: true
title: NOTE2-First touch of mysql
publishedAt: 2016-01-05 23:20:42
comment: y
---

昨天其实在阿里云主机安装mysql成功后, 也迅速根据[这个基础教程](https://www.digitalocean.com/community/tutorials/a-basic-mysql-tutorial)试了下mysql. 今天就翻译+总结一下.


## 登录mysql
```
mysql -u root -p
```

需要注意两点:
+ mysql语句全部需要用分号`;`结尾.
+ mysql命令一般用大写, 但是表格以及名字一般用小写, 这仅是为了方便区分.


## database 检查/创建/删除
```sql
SHOW DATABASES;         # 检查已有database
CREATE DATABASE testdb; # 创建新的database, 取名testdb
DROP DATABASE testdb;   # 删除database
```

## database 创建/查看表格
```sql
USE testdb; # 打开testdb这个数据库
SHOW tables; # 检查数据库中已有的表
# 因为是新建的表格, 返回的是 "Empty set"


# 创建表格取名potluck
CREATE TABLE potluck (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
# id是列名, 类型是INI整数, id也是primary key, 并且会自动每排增加填充
name VARCHAR(20),
food VARCHAR(30),
confirmed CHAR(1),
signup_date DATE);
```

创建的新表格potluck一共有5列, 第一个参数定义名字, 然后定义数据类型.
数据类型有很多种, 可参考官方文档create-table中的[data_type](http://dev.mysql.com/doc/refman/5.7/en/create-table.html)

```sql
mysql>DESCRIBE potluck;  # 提示表格的结构, 数据的类型等
+-------------+-------------+------+-----+---------+----------------+
| Field       | Type        | Null | Key | Default | Extra          |
+-------------+-------------+------+-----+---------+----------------+
| id          | int(11)     | NO   | PRI | NULL    | auto_increment |
| name        | varchar(20) | YES  |     | NULL    |                |
| food        | varchar(30) | YES  |     | NULL    |                |
| confirmed   | char(1)     | YES  |     | NULL    |                |
| signup_date | date        | YES  |     | NULL    |                |
+-------------+-------------+------+-----+---------+----------------+
5 rows in set (0.01 sec)
```

## 添加/更新表格内数据
```sql
# 使用INSERT INTO向表格添加数据, 类似在excel中写入每行数据
INSERT INTO `potluck` (`id`,`name`,`food`,`confirmed`,`signup_date`)
VALUES (NULL, "John", "Casserole","Y", '2012-04-11');

INSERT INTO `potluck` (`id`,`name`,`food`,`confirmed`,`signup_date`)
VALUES (NULL, "Sandy", "Key Lime Tarts","N", '2012-04-14');

INSERT INTO `potluck` (`id`,`name`,`food`,`confirmed`,`signup_date`)
VALUES (NULL, "Tom", "BBQ","Y", '2012-04-18');

INSERT INTO `potluck` (`id`,`name`,`food`,`confirmed`,`signup_date`)
VALUES (NULL, "Tina", "Salad","Y", '2012-04-10');

# 使用SELECT语句查看表格数据
# SELECT * 表示从表格中选取所有数据
mysql> SELECT * FROM potluck;
+----+-------+----------------+-----------+-------------+
| id | name  | food           | confirmed | signup_date |
+----+-------+----------------+-----------+-------------+
|  1 | John  | Casserole      | Y         | 2012-04-11  |
|  2 | Sandy | Key Lime Tarts | N         | 2012-04-14  |
|  3 | Tom   | BBQ            | Y         | 2012-04-18  |
|  4 | Tina  | Salad          | Y         | 2012-04-10  |
+----+-------+----------------+-----------+-------------+
4 rows in set (0.00 sec)
```

SELECT语句在mysql用的很多, 主要用途就是获取数据, 用法具体可参考[官方文档](http://dev.mysql.com/doc/refman/5.7/en/select.html)

```sql
# 更新数据信息使用UPDATE语句, 用WHERE定义更新数据位置
UPDATE `potluck`
SET
`confirmed` = 'Y'
WHERE `potluck`.`name` ='Sandy';
```

## 添加或删除列
```sql
ALTER TABLE potluck ADD email VARCHAR(40);
# 添加列使用ALTER语句
# 在表格最后插入email这一列数据

ALTER TABLE potluck ADD email VARCHAR(40) AFTER name;
# AFTER name 指定了新插入列所在位置

ALTER TABLE potluck DROP email;
# DROP 删除列

DELETE from potluck where name='Sandy';
# 删除行
```

To Be Continued....
