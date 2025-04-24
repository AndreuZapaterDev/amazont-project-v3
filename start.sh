#!/bin/bash

echo "===== INICIANDO ENTORNO DE DESARROLLO AMAZONT ====="

echo "⏳ Iniciando contenedores Docker..."
docker-compose down
docker-compose up -d

echo "⏳ Esperando a que la base de datos esté completamente lista..."
# Intentamos conectarnos a MySQL hasta que esté disponible
for i in {1..30}; do
    echo "  Intento $i de 30..."
    if docker-compose exec db mysqladmin ping -h db -u root -proot --silent; then
        echo "  ✅ Base de datos MySQL lista!"
        break
    fi
    echo "  ⏳ Esperando que MySQL esté disponible..."
    sleep 3
done

echo "⏳ Configurando backend Laravel..."
# Verificar si .env existe, sino copiarlo del ejemplo
docker-compose exec backend bash -c "if [ ! -f .env ]; then cp .env.example .env; fi"

# Actualizar archivo .env con configuración correcta
docker-compose exec backend bash -c "sed -i 's/DB_HOST=.*/DB_HOST=db/' .env"
docker-compose exec backend bash -c "sed -i 's/DB_DATABASE=.*/DB_DATABASE=amazont/' .env"
docker-compose exec backend bash -c "sed -i 's/DB_USERNAME=.*/DB_USERNAME=root/' .env"
docker-compose exec backend bash -c "sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=root/' .env"

# Verificar si la base de datos existe, de lo contrario crearla
docker-compose exec db mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS amazont;"

# Generar clave de Laravel
echo "  🔑 Generando clave de aplicación..."
docker-compose exec backend php artisan key:generate

# Instalar dependencias si es necesario
echo "  📦 Verificando dependencias de Composer..."
docker-compose exec backend composer install

# Ejecutar migraciones
echo "  🗄️ Ejecutando migraciones de la base de datos..."
docker-compose exec backend php artisan migrate --force

# Arreglar permisos de almacenamiento si es necesario
echo "  🔒 Configurando permisos de almacenamiento..."
docker-compose exec backend chmod -R 777 storage bootstrap/cache

# Ejecutar el seeder existente
echo "  🌱 Sembrando datos iniciales..."
docker-compose exec backend php artisan db:seed --force

# Verificar que el frontend esté listo
echo "⏳ Verificando el frontend Angular..."
for i in {1..10}; do
    if docker-compose logs frontend | grep -q "compiled successfully"; then
        echo "  ✅ Angular compilado correctamente!"
        break
    fi
    echo "  ⏳ Esperando que Angular compile..."
    sleep 5
done

echo "✅ ¡Entorno configurado con éxito!"
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