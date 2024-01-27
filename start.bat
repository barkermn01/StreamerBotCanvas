@ECHO OFF
FOR /F %%F IN ('node.exe --version') DO GOTO INSTALLED

:INSTALL
echo "Downloading NodeJS"
curl https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi -O
msiexec /i node-v20.11.0-x64.msi

:INSTALLED
IF EXIST "./node_modules" GOTO START
npm install

:START
echo "Node Modules Ready"
start node start.js