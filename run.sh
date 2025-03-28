#!/bin/bash
echo "===== INICIANDO ENTORNO DE DESARROLLO AMAZONT ====="

echo "⏳ Iniciando contenedores Docker..."
docker-compose up -d

echo "✅ ¡Entorno iniciado con éxito!"
echo ""
echo "📱 FRONTEND: http://localhost:4200"
echo "⚙️ BACKEND API: http://localhost:8000"
echo "🗄️ PHPMYADMIN: http://localhost:8080 (usuario: root, contraseña: root)"
echo ""
echo "Credenciales de administrador web:"
echo "Email: admin@admin.com"
echo "Contraseña: admin"
echo ""
echo "Credenciales PHPMyAdmin"
echo "User: root"
echo "Contraseña: root"
echo "Para detener los contenedores usa: docker-compose down"