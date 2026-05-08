Watchdog 
A lightweight deadman's switch / heartbeat monitoring service. If your script or server stops checking in, you get alerted.
How it works
Your script sends a simple HTTP ping every N minutes. If Watchdog stops receiving pings within the expected window, it fires an alert via email or SMS.
Status

Work in progress

Stack

AWS Lambda (API + health checker)
AWS DynamoDB (heartbeat storage)
AWS EventBridge (scheduled checks)
AWS SNS (alerts)
EC2 (example client / worker)

Quickstart
Coming soon — see client-example/ for integration details.