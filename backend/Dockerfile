FROM php:8.2-fpm

WORKDIR /var/www/html

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libzip-dev

# Limpiar cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensiones PHP
RUN docker-php-ext-install pdo_mysql zip exif pcntl
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar composer.json y composer.lock primero para aprovechar la caché
COPY composer.json composer.lock ./

# Instalar dependencias de Composer (sin los scripts por ahora)
RUN composer install --no-scripts --no-autoloader

# Copiar el resto de la aplicación
COPY . .

# Generar el autoloader optimizado
RUN composer dump-autoload --optimize

# Dar permisos adecuados
RUN chmod -R 777 storage bootstrap/cache

# Exponer puerto
EXPOSE 8000

# Comando para iniciar el servidor
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]