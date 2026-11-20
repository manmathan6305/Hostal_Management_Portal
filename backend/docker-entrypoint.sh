#!/bin/sh
set -eu
install -d -m 0750 -o node -g node /app/uploads /app/uploads/complaints /app/uploads/feedback
exec setpriv --reuid=node --regid=node --init-groups "$@"
