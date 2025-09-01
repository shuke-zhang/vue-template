# 🚀 云服务器初次部署前端项目（CentOS Stream 9）

> 目标：把本地打包好的前端 **dist** 部署到云服务器，用 **Nginx** 对外访问。  
> 说明：**Node / Python / Java 为可选**（若只托管静态前端，可直接从 Nginx 步骤开始）。

---

## 1. 环境准备相关

`dnf install -y git wget curl vim unzip tar`

**成功示例**

```
... Installed:
  git-...  wget-...  curl-...  vim-...  unzip-...  tar-...
Complete!
```

---

## 2. Node.js 安装（可选，仅打包时用；服务器只托管静态文件可不装）

`curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -`  
`dnf install -y nodejs`  
`node -v`

**成功示例**

```
## Installing the NodeSource Node.js 18.x repo...
Repository setup complete.
...
Complete!
v18.20.3
```

---

## 3. Python & Pip（可选）

`dnf install -y python3 python3-pip`  
`python3 -V`

**成功示例**

```
Complete!
Python 3.11.6
```

---

## 4. Java 17（可选）

`dnf install -y java-17-openjdk java-17-openjdk-devel`  
`java -version`

**成功示例**

```
openjdk version "17.0.11" 2024-04-16
OpenJDK Runtime Environment ...
OpenJDK 64-Bit Server VM ...
```

---

## 5. Nginx

`dnf install -y nginx`  
`systemctl enable nginx --now`  
`systemctl status nginx`

**成功示例**

```
Complete!
Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service → /usr/lib/systemd/system/nginx.service.
● nginx.service - The nginx HTTP and reverse proxy server
     Active: active (running) since ...
```

---

## 6. Nginx 配置检查

- 查看 server / listen / server_name 片段：  
  `nginx -T | sed -n '1,120p' | grep -E "server|listen|server_name" -n`
- 确认 80 端口由 Nginx 监听：  
  `ss -ltnp | grep ':80' || sudo ss -ltnp | grep nginx`

**成功示例**

```
12: server {
13-     listen 80;
14-     server_name _;
...
LISTEN 0      511          0.0.0.0:80        0.0.0.0:*    users:(("nginx",pid=1234,fd=6))
```

---

## 7. 防火墙

`firewall-cmd --list-all`

> 若 Firewalld 未运行，则依赖云厂商“**安全组**”放行端口（如 80 / 8080 / 443）。

**成功示例**

```
FirewallD is not running
```

---

## 8. 本机访问测试

`curl -I http://127.0.0.1`

> 预期：返回 `HTTP/1.1 200 OK`

**成功示例**

```
HTTP/1.1 200 OK
Server: nginx/1.24.0
Date: ...
Content-Type: text/html
Content-Length: ...
Connection: keep-alive
```

---

## 9. 添加运行脚本 `/root/deploy_fe.sh`

> 一键把 **/root/dist** 部署为 Nginx 站点，含 SPA 刷新回退、静态缓存、同端口默认站点冲突自动处理。  
> ⚠️ 若你曾创建过 `test.conf` 并监听相同端口，也请手动移走或改端口，以免命中旧站点。

```bash
cat >/root/deploy_fe.sh <<'BASH'
#!/usr/bin/env bash
set -euo pipefail

# ========== 可传参 ==========
DIST_SRC="${1:-/root/dist}"      # 你的打包产物 dist 目录
SITE_NAME="${2:-myproject}"      # 站点名，会用于目录与配置名
PORT="${3:-8080}"                # 对外端口
# ===========================

SITE_DIR="/var/www/${SITE_NAME}"
NG_CONF="/etc/nginx/conf.d/${SITE_NAME}.conf"
DATE_TAG="$(date +%Y%m%d-%H%M%S)"

echo "==> 部署参数："
echo "    DIST_SRC = ${DIST_SRC}"
echo "    SITE_DIR = ${SITE_DIR}"
echo "    NG_CONF  = ${NG_CONF}"
echo "    PORT     = ${PORT}"
echo

# 0) 基本检查
if [[ ! -d "$DIST_SRC" ]]; then
  echo "✗ 找不到 dist 目录：$DIST_SRC"
  echo "  用法: $0 [dist路径] [站点名] [端口]"
  exit 1
fi

# 1) 安装 Nginx（若未安装）
if ! command -v nginx >/dev/null 2>&1; then
  echo "==> 安装 Nginx ..."
  dnf install -y nginx
  systemctl enable nginx --now
fi

# 1.5) 避免同端口冲突：默认站点 default.conf 若监听同端口则禁用
if [[ -f /etc/nginx/conf.d/default.conf ]]; then
  if grep -qE "listen[[:space:]]+${PORT}\b" /etc/nginx/conf.d/default.conf; then
    echo "==> 检测到 default.conf 监听 ${PORT}，先禁用以避免命中默认站点"
    mv /etc/nginx/conf.d/default.conf "/etc/nginx/conf.d/default.conf.bak-${DATE_TAG}"
  fi
fi

# 2) 创建站点目录 & 备份旧版本
mkdir -p "$SITE_DIR"
if [[ -n "$(ls -A "$SITE_DIR" 2>/dev/null || true)" ]]; then
  echo "==> 备份旧站点到 ${SITE_DIR}.bak-${DATE_TAG}"
  mv "$SITE_DIR" "${SITE_DIR}.bak-${DATE_TAG}"
  mkdir -p "$SITE_DIR"
fi

echo "==> 拷贝 dist 到站点目录 ..."
# 优先 rsync，回退到 cp
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "${DIST_SRC}/" "${SITE_DIR}/"
else
  cp -r "${DIST_SRC}/." "${SITE_DIR}/"
fi

# 3) SELinux 内容类型（如果开启 SELinux，否则忽略）
if command -v getenforce >/dev/null 2>&1 && [[ "$(getenforce)" != "Disabled" ]]; then
  echo "==> 设置 SELinux 上下文 ..."
  semanage fcontext -a -t httpd_sys_content_t "${SITE_DIR}(/.*)?" 2>/dev/null || true
  restorecon -Rv "${SITE_DIR}" || true
  chcon -R -t httpd_sys_content_t "${SITE_DIR}" || true
fi

# 4) 写入 Nginx 配置（含 SPA 回退）
echo "==> 写入 Nginx 配置：${NG_CONF}"
cat > "$NG_CONF" <<EOF
server {
    listen ${PORT};
    server_name _;

    root ${SITE_DIR};
    index index.html;

    # 单页应用前端路由，避免刷新 404
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # 静态文件缓存示例（可按需调整）
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
        try_files \$uri =404;
    }
}
EOF

# 5) 放行端口（仅在 firewalld 运行时）
if systemctl is-active --quiet firewalld; then
  echo "==> 放行防火墙端口 ${PORT}"
  firewall-cmd --permanent --add-port=${PORT}/tcp || true
  firewall-cmd --reload || true
else
  echo "※ firewalld 未运行，跳过系统防火墙开放；请确保云上安全组已放行 ${PORT}/TCP。"
fi

# 6) 检查并重载 Nginx
echo "==> 检查 Nginx 配置 ..."
nginx -t
echo "==> 重载 Nginx ..."
systemctl reload nginx

echo
echo "✅ 部署完成！"
echo "   站点目录：${SITE_DIR}"
echo "   本地地址：http://127.0.0.1:${PORT}"
echo "   公网地址（若有EIP且安全组放行）：http://$(curl -s ifconfig.me):${PORT}"
BASH

chmod +x /root/deploy_fe.sh
```

**成功示例**

```
==> 部署参数：
    DIST_SRC = /root/dist
    SITE_DIR = /var/www/mysite
    NG_CONF  = /etc/nginx/conf.d/mysite.conf
    PORT     = 8080
# （无报错即脚本生成成功，下一步执行部署）
```

---

## 10. 将打包好的 dist 放在 `/root/dist/`

- **FinalShell / XShell**：把本地 `dist` 拖拽到服务器 `/root/`
- **或使用 scp（在本地电脑终端执行）**：  
  `scp -r dist root@你的公网IP:/root/`
- **快速确认**：  
  `ls -lh /root/dist/`

**成功示例**

```
total 12K
-rw-r--r-- 1 root root 1.2K Sep 01 12:01 index.html
drwxr-xr-x 2 root root 4.0K Sep 01 12:01 assets
```

---

## 11. 一键部署

### 一键部署

1. 按需替换参数：`/root/dist` 站点名 端口  
   `/root/deploy_fe.sh /root/dist mysite 8080`
2. 成功后：
   - 终端出现 **✅ 部署完成！**
   - `curl -I http://127.0.0.1:8080` 返回 **HTTP/1.1 200 OK**
   - 浏览器访问 `http://你的公网IP:8080` 可打开页面（确保安全组放行 8080）

**完整成功示例（节选）**

```
==> 部署参数：
    DIST_SRC = /root/dist
    SITE_DIR = /var/www/mysite
    NG_CONF  = /etc/nginx/conf.d/mysite.conf
    PORT     = 8080
==> 拷贝 dist 到站点目录 ...
==> 写入 Nginx 配置：/etc/nginx/conf.d/mysite.conf
==> 检查 Nginx 配置 ...
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
==> 重载 Nginx ...

✅ 部署完成！
   站点目录：/var/www/mysite
   本地地址：http://127.0.0.1:8080
   公网地址（若有EIP且安全组放行）：http://<你的公网IP>:8080
```
