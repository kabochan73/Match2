#!/bin/sh
set -e

export PORT="${PORT:-8080}"
envsubst '${PORT}' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf

php artisan config:clear
php artisan storage:link --force || true

exec supervisord -c /etc/supervisor/supervisord.conf
