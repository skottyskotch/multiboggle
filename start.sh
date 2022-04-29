 #!/bin/sh

#check if the server is already running then kill it
PID=$(ps -ef | grep '[n]ode server.js' | tr -s ' ' | cut -d ' ' -f2)
if [ $PID != '' ]
then
kill -9 $PID
fi

#dl dependencies if needed
if [ ! -d node_modules ]; then
npm i;
fi
#find the IP of the server
EXT_IP=$(curl icanhazip.com)

#update to last commit
git reset --hard
git pull
LAST_COMMIT=$(git log -1 | sed '$!d')

#update the current server IP address for the client
cp update/scripts/sketch.js update/scripts/sketch.tmp
sed 's/http:\/\/.*:80/http:\/\/'$EXT_IP':80/' public/scripts/sketch.tmp > public/scripts/sketch.js
rm blast/website/scripts/sketch.tmp

#post info on discord
curl -H "Content-Type: application/json" -X POST -d "{\"username\": \"server\", \"content\": \"Game started at http://"$EXT_IP"}" https://discord.com/api/webhooks/969705657672536084/wJi5AJXU5VTGX0coTKp3ukQEa0DQTqV7_Raw_vW2meQtgNAEhwI5uNXr0X4qjvpULMWR
curl -H "Content-Type: application/json" -X POST -d "{\"username\": \"git\", \"content\": \"Last commit:$LAST_COMMIT\"}" https://discord.com/api/webhooks/969705924761616515/olggpmCOxL60AI6vw0L8K_T8f51aZu546QfmahJs3Cz403BmTVKzTfC0bokm_niQYGLs

#launch the server
nohup node server.js &
