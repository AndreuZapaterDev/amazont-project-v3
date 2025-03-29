#!/bin/bash
echo "===== INICIANDO ENTORNO DE DESARROLLO AMAZONT ====="

# Función para mostrar errores sin detener el script
show_error() {
  echo "⚠️ $1"
}

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    show_error "Docker no está instalado o no está en el PATH. Por favor, instala Docker Desktop."
else
    echo "✅ Docker encontrado"
fi

# Verificar si docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
    show_error "Docker Compose no está instalado o no está en el PATH. Docker Compose viene incluido con Docker Desktop."
else
    echo "✅ Docker Compose encontrado"
fi

# Verificar si los puertos necesarios están disponibles
PORTS_TO_CHECK=(4200 8000 8080)
PORTS_IN_USE=""
for port in "${PORTS_TO_CHECK[@]}"; do
    if netstat -ano | findstr ":$port" > /dev/null; then
        case $port in
            4200)
                PORTS_IN_USE="$PORTS_IN_USE\n - Puerto 4200 (frontend Angular)"
                ;;
            8000)
                PORTS_IN_USE="$PORTS_IN_USE\n - Puerto 8000 (backend Laravel)"
                ;;
            8080)
                PORTS_IN_USE="$PORTS_IN_USE\n - Puerto 8080 (phpMyAdmin)"
                ;;
        esac
    fi
done

if [ ! -z "$PORTS_IN_USE" ]; then
    show_error "Los siguientes puertos ya están en uso:$PORTS_IN_USE"
    show_error "Los servicios pueden no iniciar correctamente. Considera cerrar las aplicaciones que usan estos puertos."
else
    echo "✅ Todos los puertos necesarios están disponibles"
fi

echo "⏳ Iniciando contenedores Docker..."
if ! docker-compose up -d; then
    show_error "No se pudieron iniciar los contenedores Docker."
    show_error "Posibles causas:"
    show_error " - Docker Desktop no está en ejecución"
    show_error " - Hay un problema con el archivo docker-compose.yml"
    show_error " - Conflicto con los puertos o volúmenes"
else
    echo "✅ Comando docker-compose ejecutado"
fi

# Verificar que los contenedores estén en funcionamiento
CONTAINERS=$(docker-compose ps -q)
if [ -z "$CONTAINERS" ]; then
    show_error "No se han iniciado contenedores Docker."
    show_error "Por favor, verifica tu archivo docker-compose.yml y los logs de Docker."
else
    # Contar contenedores en estado running
    RUNNING_CONTAINERS=$(docker-compose ps | grep -c "Up")
    EXPECTED_CONTAINERS=$(docker-compose config --services | wc -l)

    if [ "$RUNNING_CONTAINERS" -lt "$EXPECTED_CONTAINERS" ]; then
        show_error "No todos los contenedores están en ejecución."
        show_error "Contenedores iniciados: $RUNNING_CONTAINERS de $EXPECTED_CONTAINERS"
        show_error "Ejecuta 'docker-compose ps' para ver el estado de los contenedores."
        show_error "Ejecuta 'docker-compose logs' para ver los logs de error."
    else
        echo "✅ Todos los contenedores están en ejecución ($RUNNING_CONTAINERS de $EXPECTED_CONTAINERS)"
    fi
fi

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