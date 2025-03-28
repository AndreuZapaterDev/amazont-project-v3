# 🚀 Amazont Project - Guía Rápida

<div align="center">

![Status](https://img.shields.io/badge/Estado-Activo-brightgreen)
![Framework Frontend](https://img.shields.io/badge/Frontend-Angular-DD0031)
![Framework Backend](https://img.shields.io/badge/Backend-Laravel-FF2D20)

</div>

## 📋 Requisitos

* Docker y Docker Compose
* Git (opcional)

## 🔧 Primera instalación

<details>
<summary><b>En Linux/macOS:</b></summary>

```bash
chmod +x start.sh
./start.sh
```
</details>

<details>
<summary><b>En Windows:</b></summary>

* **Con Git Bash:**

  ```bash
  chmod +x start.sh
  ./start.sh
  ```

* **Si aparece error "bad interpreter":**

  ```bash
  dos2unix start.sh
  ./start.sh
  ```

* **Con PowerShell:**

  ```powershell
  docker-compose up -d
  # Esperar 60 segundos para que la base de datos esté lista
  ```
</details>

## 🔄 Reiniciar el proyecto

Una vez configurado, para iniciarlo nuevamente:

```bash
./run.sh  # O simplemente: docker-compose up -d
```

## 🔗 Accesos

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Frontend** | [http://localhost:4200](http://localhost:4200) | - |
| **Backend API** | [http://localhost:8000](http://localhost:8000) | - |
| **phpMyAdmin** | [http://localhost:8080](http://localhost:8080) | usuario: `root`<br>contraseña: `root` |

## 👑 Usuario Administrador

* **Email**: `admin@admin.com`
* **Contraseña**: `admin`

## 💻 Comandos útiles

```bash
# Iniciar contenedores
docker-compose up -d

# Detener contenedores
docker-compose down

# Ver logs
docker-compose logs

# Ver logs de un contenedor específico
docker-compose logs frontend
docker-compose logs backend
```

## 📁 Estructura principal

### Backend (Laravel/PHP)

* **app/Http/Controllers/**: Controladores
* **app/Models/**: Modelos de datos
* **routes/api.php**: Rutas API
* **database/migrations/**: Estructura de base de datos

### Frontend (Angular)

* **src/app/**: Componentes Angular