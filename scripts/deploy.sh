cabal run . build
cp /home/lyka/heatmap.json static/
# rsync -avz --delete --no-o --no-g _site/ root@23.94.5.170:/srv/shoggothstaring.com/ &&
#   ssh root@23.94.5.170 "chown -R caddy:caddy /srv/shoggothstaring.com" &&
#   echo "Sync and ownership fixed." || echo "Sync failed."

git add -A
git commit
git push
