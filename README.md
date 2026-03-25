## Start Docker

```bash
docker compose up -d
```

## Setup

```bash
npm install
```

## Backup Database

MySQL data is stored in a Docker volume, so when moving this project to another machine you should export the database to a `.sql` file first.

```bash
npm run db:export
```

The backup file will be created in `backups/` with a timestamp, for example:

```bash
backups/strapi-20260325-160000.sql
```

You can also choose a custom filename:

```bash
bash ./scripts/export-db.sh ./backups/strapi-latest.sql
```

## Restore Database On Another Machine

1. Copy the project folder, including `public/uploads/` and the `.sql` file in `backups/`.
2. Start Docker:

```bash
docker compose up -d
```

3. Import the backup:

```bash
bash ./scripts/import-db.sh ./backups/strapi-latest.sql
```

Or:

```bash
npm run db:import -- ./backups/strapi-latest.sql
```

## Notes

- `public/uploads/` is already mounted from the project folder, so uploaded media files move with the project.
- The old `backup_strapi.sql` file was not a valid MySQL dump. Use the export script above to create a real backup before moving machines.

## Login

- URL: http://localhost:1337/admin/auth/login
- Username: lehan@canhcam.com
- Password: 10028781@haN