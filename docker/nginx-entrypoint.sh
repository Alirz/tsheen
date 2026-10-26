#!/bin/sh
set -eu

json_escape() {
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

strip_trailing_slashes() {
  value=$1
  while [ "$value" != "${value%/}" ]; do
    value=${value%/}
  done
  printf '%s' "$value"
}

app=$(strip_trailing_slashes "${APP_BASE_URL:-http://localhost:3000}")
issuer="$(strip_trailing_slashes "${AUTH_ISSUER:-http://localhost:44366}")/"
api=$(strip_trailing_slashes "${API_URL:-http://localhost:44365}")

out="${DYNAMIC_ENV_PATH:-/usr/share/nginx/html/dynamic-env.json}"
mkdir -p "$(dirname "$out")"

cat > "$out" <<EOF
{
  "application": {
    "baseUrl": "$(json_escape "$app")",
    "name": "Tsheen"
  },
  "oAuthConfig": {
    "issuer": "$(json_escape "$issuer")",
    "redirectUri": "$(json_escape "$app")",
    "clientId": "Tsheen_App",
    "scope": "offline_access openid profile email phone roles Tsheen"
  },
  "apis": {
    "default": {
      "url": "$(json_escape "$api")",
      "rootNamespace": "Tsheen"
    }
  }
}
EOF

exec nginx -g 'daemon off;'
