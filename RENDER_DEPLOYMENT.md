# Render Deployment Guide

## Issues Fixed

### 1. Connection Pool Exhaustion
**Problem:** Multiple worker processes (16 workers on a 16-core server) were each creating connection pools with 20 max connections, totaling 320+ simultaneous connections. Render's free PostgreSQL tier only allows ~25 connections.

**Solution:** 
- Limited workers to 2 in production
- Reduced pool size to 5 connections per worker (max 10 total connections)

### 2. Network Binding Issue
**Problem:** App was binding to `localhost:8001`, but Render needs apps to bind to `0.0.0.0` on the PORT they provide.

**Solution:** Changed server to bind to `0.0.0.0` (HOST variable)

## Environment Variables Required on Render

Make sure these environment variables are set in your Render dashboard:

```
NODE_ENV=production
DB_HOST=dpg-d3hvj7ggjchc73ar1ovg-a.singapore-postgres.render.com
DB_USER=aarambh_zhzu_user
DB_PASSWORD=dxDij8wAzOFTBWOlyFShOfhnd085m88b
DB_NAME=aarambh_zhzu
DB_PORT=5432
AES_KEY=aarambh2025X9T3P
AES_IV=4F7G2H9K6L1M8Q2R
```

**IMPORTANT:** The `PORT` variable is automatically provided by Render - do NOT set it manually.

## Build Command
```
npm install
```

## Start Command
```
node app.js
```

## Connection Pool Configuration

### Production (Render)
- **Workers:** 2 (instead of CPU count)
- **Pool Size per Worker:** 5 connections
- **Total Max Connections:** ~10 connections
- **Reasoning:** Stays well within Render's free tier limit of 25 connections

### Development (Local)
- **Workers:** Min(CPU cores, 4)
- **Pool Size per Worker:** 10 connections
- **Total Max Connections:** ~40 connections

## Why These Changes Work

1. **Fewer Workers:** 2 workers are sufficient for most web apps on Render's free tier and prevent connection exhaustion
2. **Smaller Pool:** 5 connections per worker is enough for typical request loads
3. **Proper Binding:** `0.0.0.0` allows Render's load balancer to route traffic to your app
4. **Environment Detection:** Automatically uses production settings when `NODE_ENV=production`

## Monitoring

After deployment, check:
1. ✅ "Connected to PostgreSQL Database" appears in logs
2. ✅ "Worker process X is running on http://0.0.0.0:XXXX" appears
3. ✅ No connection timeout errors
4. ✅ Render detects open HTTP ports

## Troubleshooting

### Still getting connection timeouts?
- Check if PostgreSQL database is in the same region (Singapore)
- Verify database credentials in Render environment variables
- Check if database has IP allowlist (should be disabled for internal Render connections)

### Workers keep dying?
- Check database connection limits
- Reduce workers further (try 1 worker)
- Reduce pool size (try max: 3)

### "No open HTTP ports detected"?
- Ensure app is binding to `0.0.0.0` not `localhost`
- Verify PORT environment variable is being used
- Check if PORT is available (should be automatically provided by Render)
