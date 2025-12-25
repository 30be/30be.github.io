wget --spider --force-html -r http://localhost:3474 2>&1 | grep -E '^(http://|Downloaded|Found)'
