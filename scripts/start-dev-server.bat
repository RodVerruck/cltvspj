@echo off
title CLT vs PJ - Servidor Local
cd /d "c:\Projetos\cltvspj"

echo.
echo  CLT vs PJ - Next.js dev server
echo  http://localhost:3000
echo.
echo  Pressione Ctrl+C para parar o servidor.
echo.

npm run dev

if errorlevel 1 (
  echo.
  echo  Erro ao iniciar. Verifique se o Node/npm esta instalado.
  pause
)
