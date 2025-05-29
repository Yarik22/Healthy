FROM postgres:latest

RUN apt-get update && apt-get install -y cron && rm -rf /var/lib/apt/lists/*

COPY sync_from_master.sh /usr/local/bin/sync_from_master.sh
RUN chmod +x /usr/local/bin/sync_from_master.sh

RUN echo "0 * * * * /usr/local/bin/sync_from_master.sh >> /var/log/cron.log 2>&1" > /etc/cron.d/db-sync \
    && crontab /etc/cron.d/db-sync

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

CMD ["/usr/local/bin/entrypoint.sh"]
