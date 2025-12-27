::doest work
@echo off
git add -A
git commit
git push
ssh lyka@23.94.5.170 "cd ~/MultiEditor; systemctl stop site; git pull origin main; npm install; systemctl start site"
