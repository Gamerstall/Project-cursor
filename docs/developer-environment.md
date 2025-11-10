## Developer Environment Setup

### Prerequisites
- Node.js 18.x or newer (`node -v`)
- npm 10.x or newer (`npm -v`)
- macOS, Linux, or WSL shell with access to the project directory

### Install Dependencies
```bash
cd /path-to-project/Project-cursor
npm install
```

### Start the Development Server
- Launch the Next.js dev server on port `3500`:

```bash
npm run dev -- --port 3500
```

- The app is available at `http://localhost:3500`.
- The command keeps running in the foreground; open a new terminal tab for additional commands.

### Verifying the Server
- Visit `http://localhost:3500` in a browser, or run:

```bash
curl -I http://localhost:3500
```

### Stopping the Server
- Press `Ctrl+C` in the terminal running the dev server, or from a new shell:

```bash
pkill -f "next dev"
```



