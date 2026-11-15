@echo off
title Multi-School Management SaaS Server
cd /d "%~dp0"

echo ======================================================================
echo    STARTING MULTI-SCHOOL MANAGEMENT SAAS PLATFORM (PORT 8088)
echo ======================================================================
echo  Tenant 1: St. Xavier's International Academy (Enterprise)
echo  Tenant 2: Apex Global High School (Professional)
echo  Tenant 3: Grace Model Public School (Starter)
echo ======================================================================

start "" "http://localhost:8088/index.html"
py server.py
pause
