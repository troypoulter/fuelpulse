# Contributing

First off, thank you for considering to contribute to Fuel Pulse! I welcome any and all contributions!

Please feel free to raise an issue, start a discussion or reach out to me at [@troypoulterr](https://twitter.com/troypoulterr).

## Development

### Fork this repo

Fork the repository by clicking the fork button in the top-right corner of this page.

### Clone locally

```bash
git clone https://github.com/your-username/fuelpulse.git
```

### Go to project directory

```bash
cd fuelpulse
```

### Install dependencies

```bash
npm install
```

### Setup environment variables

Make a copy of `.env.example` and name it `.env`, so that the `.gitignore` won't commit anything.

For local development, **you won't need to change any values as it will use a sample SQLite database.**

The `AUSTRALIA_*` are only if you want to get live data, which requires API access to the NSW Government's Fuel API, which isn't required for local development, and, `QSTASH_*` variables are only for deployment as it manages the CRON job to collect data.

### Start the server

```bash
npm run dev
```