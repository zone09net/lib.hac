@echo off
set path = %path%;%~dp0/../../toolchains/node-22.11.0-x64
%~dp0/../../toolchains/node-22.11.0-x64/npm.cmd %*
echo.
