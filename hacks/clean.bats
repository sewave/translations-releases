@echo off
for /R %%f in (*) do (if not "%%~xf"==".png" if not "%%~xf"==".zip" if not "%%~xf"==".txt" del "%%~f")