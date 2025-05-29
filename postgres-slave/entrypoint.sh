#!/bin/bash
set -e

# Start cron daemon
cron

# Start Postgres as the main container process
exec docker-entrypoint.sh postgres
