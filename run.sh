#!/bin/bash
echo "===== INICIANDO ENTORNO DE DESARROLLO AMAZONT ====="
echo "⏳ Iniciando contenedores Docker..."
docker-compose up -d

echo "⏳ Verificando que todos los contenedores estén levantados..."
for i in {1..30}; do
    RUNNING_CONTAINERS=$(docker-compose ps --services --filter "status=running" | wc -l)
    TOTAL_CONTAINERS=$(docker-compose ps --services | wc -l)

    if [ "$RUNNING_CONTAINERS" -eq "$TOTAL_CONTAINERS" ]; then
        echo "✅ Todos los contenedores están levantados!"
        break
    fi

    echo "  ⏳ Esperando que los contenedores se levanten... ($i/30)"
    sleep 3
done

if [ "$RUNNING_CONTAINERS" -ne "$TOTAL_CONTAINERS" ]; then
    echo "❌ Algunos contenedores no se levantaron correctamente. Verifica los logs con 'docker-compose logs'."
    exit 1
fi

echo "✅ ¡Entorno iniciado con éxito!"
echo ""
echo "📱 FRONTEND: http://localhost:4200"
echo "⚙️ BACKEND API: http://localhost:8000"
echo "🗄️ PHPMYADMIN: http://localhost:8080 (usuario: root, contraseña: root)"
echo ""
echo "Credenciales de administrador:"
echo "Email: admin@admin.com"
echo "Contraseña: admin"
echo ""
echo "Para detener los contenedores usa: docker-compose down"