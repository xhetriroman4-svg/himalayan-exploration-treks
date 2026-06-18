#!/bin/bash
# Start Next.js dev server, fully detached from any controlling terminal
# so it survives the bash session that launched it.

cd /home/z/my-project

# Kill any pre-existing dev server on port 3000
pkill -f "next dev" 2>/dev/null
sleep 1

# Launch with setsid so it runs in its own session
setsid nohup npx next dev -p 3000 > /tmp/next-dev.log 2>&1 < /dev/null &
DEVPID=$!
echo $DEVPID > /tmp/next-dev.pid
disown $DEVPID 2>/dev/null

# Wait a few seconds and report
sleep 6
if kill -0 $DEVPID 2>/dev/null; then
  echo "OK: dev server running with PID $DEVPID"
else
  echo "FAIL: dev server exited"
fi
echo "--- log tail ---"
tail -15 /tmp/next-dev.log
