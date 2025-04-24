#!/bin/sh
set -e

# Replace environment variables in the nginx configuration template
envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Execute CMD
exec "$@"