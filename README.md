<h1 align="center">BiliRoaming</h1>

<div align="center">nodejs / mysql / redis / nginx / pm2 / telegrambot</div></br>


## Note

### Repo 克隆

```bash
git clone https://github.com/fuckbili/biliroaming.git
# git clone https://github.com/monsterxcn/biliroaming.git
git clone https://github.com/fuckbili/biliroaming-bot.git

nano biliroaming/Config/config.js
nano biliroaming-bot/config/config.js
```

### Nodejs 安装

```bash
# Install nodejs npm
curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt install nodejs
# Check
node -v
npm -v
```

### PM2 安装

```bash
# Install pm2
sudo npm install -g pm2
sudo pm2 startup systemd
```

<details><summary>pm2 notice</summary><br />

```bash
ubuntu@bili:~$ sudo pm2 startup systemd

                        -------------

__/\\\\\\\\\\\\\____/\\\\____________/\\\\____/\\\\\\\\\_____
 _\/\\\/////////\\\_\/\\\\\\________/\\\\\\__/\\\///////\\\___
  _\/\\\_______\/\\\_\/\\\//\\\____/\\\//\\\_\///______\//\\\__
   _\/\\\\\\\\\\\\\/__\/\\\\///\\\/\\\/_\/\\\___________/\\\/___
    _\/\\\/////////____\/\\\__\///\\\/___\/\\\________/\\\//_____
     _\/\\\_____________\/\\\____\///_____\/\\\_____/\\\//________
      _\/\\\_____________\/\\\_____________\/\\\___/\\\/___________
       _\/\\\_____________\/\\\_____________\/\\\__/\\\\\\\\\\\\\\\_
        _\///______________\///______________\///__\///////////////__


                          Runtime Edition

        PM2 is a Production Process Manager for Node.js applications
                     with a built-in Load Balancer.

                Start and Daemonize any application:
                $ pm2 start app.js

                Load Balance 4 instances of api.js:
                $ pm2 start api.js -i 4

                Monitor in production:
                $ pm2 monitor

                Make pm2 auto-boot at server restart:
                $ pm2 startup

                To go further checkout:
                http://pm2.io/


                        -------------

[PM2] Init System found: systemd
Platform systemd
Template
[Unit]
Description=PM2 process manager
Documentation=https://pm2.keymetrics.io/
After=network.target

[Service]
Type=forking
User=root
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
Environment=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin
Environment=PM2_HOME=/root/.pm2
PIDFile=/root/.pm2/pm2.pid
Restart=on-failure

ExecStart=/usr/local/lib/node_modules/pm2/bin/pm2 resurrect
ExecReload=/usr/local/lib/node_modules/pm2/bin/pm2 reload all
ExecStop=/usr/local/lib/node_modules/pm2/bin/pm2 kill

[Install]
WantedBy=multi-user.target

Target path
/etc/systemd/system/pm2-root.service
Command list
[ 'systemctl enable pm2-root' ]
[PM2] Writing init configuration in /etc/systemd/system/pm2-root.service
[PM2] Making script booting at startup...
[PM2] [-] Executing: systemctl enable pm2-root...
Created symlink /etc/systemd/system/multi-user.target.wants/pm2-root.service → /etc/systemd/system/pm2-root.service.
[PM2] [v] Command successfully executed.
+---------------------------------------+
[PM2] Freeze a process list on reboot via:
$ pm2 save

[PM2] Remove init script via:
$ pm2 unstartup systemd
```

</details>

### Redis 安装

```bash
# Install redis
sudo apt install redis redis-server
sudo systemctl enable --now reids-server
# Configure Redis
sudo nano /etc/redis/redis.conf
sudo systemctl restart reids-server
# Check
redis-cli info
```

### MySQL 安装并配置

```bash
# Remove old version
sudo apt-get remove --purge mysql*
dpkg -l | grep mysql
sudo rm -rf /etc/mysql /var/lib/mysql
sudo apt-get autoremove
sudo apt-get autoclean
# Configure apt
wget http://repo.mysql.com/mysql-apt-config_0.8.15-1_all.deb
# Directly OK
sudo dpkg -i mysql-apt-config_0.8.15-1_all.deb
# Install mysql
sudo apt update
sudo apt install mysql-server
#   Input password for user root
#   Use Strong Password Encryption (RECOMMENDED)
#   using /etc/mysql/mysql.cnf to provide /etc/mysql/my.cnf (my.cnf) in auto mode
# sudo /etc/init.d/mysql start
sudo mysql_secure_installation
#   Would you like to setup VALIDATE PASSWORD plugin? y
#   Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG: 0
#   Change the password for root?: n
#   Remove anonymous users? y
#   Disallow root login remotely? n
#   Remove test database and access to it? y
#   Reload privilege tables now? y
# Configure mysql by mysql-cli
mysql -u root -p
mysql> create database <DATABASE_NAME>;
mysql> create user <USER_NAME>@'localhost' identified by '<USER_PASSWD>';
mysql> grant all privileges on <DATABASE_NAME>.* to <USER_NAME>@'localhost';
mysql> flush privileges;
mysql> use <DATABASE_NAME>
mysql> source <REPO_PATH>/bili_uid.sql
```

### PM2 进程

```bash
# Start pm2 task
cd biliroaming
pm2 start app.js --name biliroaming -e err.log -o out.log
cd biliraoming-bot
pm2 start app.js --name bilibot -e err.log -o out.log
```

### NginX 反向代理

```bash
# Install nginx
sudo apt install nginx
sudo systemctl enable nginx
nano /etc/nginx/conf.d/bili.conf
service nginx restart
```

<details><summary>maybe example</summary><br />

```conf
map $http_upgrade $connection_upgrade {
  default upgrade;
  '' close;
}
server {
  listen 80;
  listen [::]:80;
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  ssl_certificate /etc/nginx/ssl/<SERVER_SSL_PEM>;
  ssl_certificate_key /etc/nginx/ssl/<SERVER_SSL_KEY>;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
  ssl_ciphers TLS13-AES-256-GCM-SHA384:TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-128-GCM-SHA256:TLS13-AES-128-CCM-8-SHA256:TLS13-AES-128-CCM-SHA256:EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
  ssl_prefer_server_ciphers on;
  ssl_session_timeout 10m;
  ssl_session_cache builtin:1000 shared:SSL:10m;
  ssl_buffer_size 1400;
  add_header Strict-Transport-Security max-age=15768000;
  server_name <SERVER_NAME>;
  access_log off;
  if ($ssl_protocol = "") { return 301 https://$host$request_uri; }
  
  #error_page 404 /404.html;
  #error_page 502 /502.html;
  
  location / {
    proxy_pass http://localhost:39831;    #  Notice
    proxy_set_header Upgrade $http_upgrade;
    proxy_http_version 1.1;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Port $server_port;
  }
}
```

</details>