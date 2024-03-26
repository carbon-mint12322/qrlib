#Tools for setting up devenv

To download data for unit testing with another database, run the `download-db` script. Run like this:

```
# Be sure to set the environment variables:
# DATABASE_URL
# TENANT_NAME # e.g. reactml-dev
# APP_NAME # e.g. farmbook

node build/main/devtools/download-db.js

```
