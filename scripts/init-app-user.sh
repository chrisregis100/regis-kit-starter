#!/usr/bin/env sh
set -eu

: "${APP_DB_PASSWORD:?APP_DB_PASSWORD must be set}"

psql \
  --set=ON_ERROR_STOP=1 \
  --set=app_db_password="$APP_DB_PASSWORD" \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" <<'SQL'
SELECT format(
  'CREATE ROLE app_user WITH LOGIN NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS PASSWORD %L',
  :'app_db_password'
)
WHERE NOT EXISTS (
  SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user'
)
\gexec
SQL
