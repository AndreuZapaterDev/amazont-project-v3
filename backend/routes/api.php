<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api;


//Perfil de usuario
Route::get('/perfil_usuarios', [api::class, 'getPerfilUsuario']);
Route::get('/perfil_usuario/{id}', [api::class, 'getPerfilUsuarioId']);
Route::post('/perfil_usuario', [api::class, 'postPerfilUsuario']);
Route::put('/perfil_usuario/{id}', [api::class, 'putPerfilUsuario']);
Route::delete('/perfil_usuario/{id}', [api::class, 'deletePerfilUsuario']);

//Usuarios
Route::get('/usuarios', [api::class, 'getUsuarios']);
Route::get('/usuario/{id}', [api::class, 'getUsuarioId']);
Route::post('/usuario', [api::class, 'postUsuario']);
Route::put('/usuario/{id}', [api::class, 'putUsuario']);
Route::delete('/usuario/{id}', [api::class, 'deleteUsuario']);

//Categorías
Route::get('/categorias', [api::class, 'getCategorias']);
Route::get('/categoria/{id}', [api::class, 'getCategoriaId']);
Route::post('/categoria', [api::class, 'postCategoria']);
Route::put('/categoria/{id}', [api::class, 'putCategoria']);
Route::delete('/categoria/{id}', [api::class, 'deleteCategoria']);

//Productos
Route::get('/productos', [api::class, 'getProductos']);
Route::get('/producto/{id}', [api::class, 'getProductoId']);
Route::post('/producto', [api::class, 'postProducto']);
Route::put('/producto/{id}', [api::class, 'putProducto']);
Route::delete('/producto/{id}', [api::class, 'deleteProducto']);

//Producto Categorías
Route::get('/producto_categorias', [api::class, 'getProductoCategorias']);
Route::get('/producto_categoria/{id}', [api::class, 'getProductoCategoriasId']);
Route::post('/producto_categoria', [api::class, 'postProductoCategorias']);
Route::put('/producto_categoria/{id}', [api::class, 'putProductoCategorias']);
Route::delete('/producto_categoria/{id}', [api::class, 'deleteProductoCategorias']);

//Valoraciones
Route::get('/valoraciones', [api::class, 'getValoraciones']);
Route::get('/valoracion/{id}', [api::class, 'getValoracionesId']);
Route::get('/puntuacion_por_producto/{producto_id}', [api::class, 'getPuntuacionPorProducto']); // New route for rating count
Route::post('/valoracion', [api::class, 'postValoraciones']);
Route::put('/valoracion/{id}', [api::class, 'putValoraciones']);
Route::delete('/valoracion/{id}', [api::class, 'deleteValoraciones']);

//Imágenes
Route::get('/imagenes', [api::class, 'getImagenes']);
Route::get('/imagen/{id}', [api::class, 'getImagenesId']);
Route::post('/imagen', [api::class, 'postImagenes']);
Route::put('/imagen/{id}', [api::class, 'putImagenes']);
Route::delete('/imagen/{id}', [api::class, 'deleteImagenes']);

//Características
Route::get('/caracteristicas', [api::class, 'getCaracteristicas']);
Route::get('/caracteristica/{id}', [api::class, 'getCaracteristicasId']);
Route::post('/caracteristica', [api::class, 'postCaracteristicas']);
Route::put('/caracteristica/{id}', [api::class, 'putCaracteristicas']);
Route::delete('/caracteristica/{id}', [api::class, 'deleteCaracteristicas']);

//Carrito
Route::get('/carritos', [api::class, 'getCarrito']);
Route::get('/carrito/{id}', [api::class, 'getCarritoId']);
Route::get('/carrito_activo/{user_id}', [api::class, 'getCarritoActivo']); // New route to get active cart by user ID
Route::post('/carrito', [api::class, 'postCarrito']);
Route::put('/carrito/{id}', [api::class, 'putCarrito']);
Route::delete('/carrito/{id}', [api::class, 'deleteCarrito']);
Route::put('/acabar_carrito/{id}', [api::class, 'acabarCarrito']); // New route for finishing the cart

//Productos Carrito
Route::get('/productos_carritos', [api::class, 'getProductosCarrito']);
Route::get('/producto_carrito/{id}', [api::class, 'getProductosCarritoId']);
Route::get('/productos_carrito_by_carrito/{carrito_id}', [api::class, 'getProductosCarritoByCarritoId']); // New route
Route::post('/producto_carrito', [api::class, 'postProductosCarrito']);
Route::put('/producto_carrito/{id}', [api::class, 'putProductosCarrito']);
Route::delete('/producto_carrito/{id}', [api::class, 'deleteProductosCarrito']);

//Métodos de pago
Route::get('/metodos_pago', [api::class, 'getMetodosPago']);
Route::get('/metodo_pago/{id}', [api::class, 'getMetodosPagoId']);
Route::post('/metodo_pago', [api::class, 'postMetodoPago']);
Route::put('/metodo_pago/{id}', [api::class, 'putMetodoPago']);
Route::delete('/delete/metodo_pago/{id}', [api::class, 'deleteMetodoPago']);

//Login
Route::post('/login', [api::class, 'login']);

//Productos Usuario
Route::get('/productos_usuario', [api::class, 'getProductosUsuario']);
Route::get('/productos_usuario/user/{id}', [api::class, 'getProductosUsuarioByUserId']);
Route::get('/producto_usuario/{id}', [api::class, 'getProductoUsuarioById']);
Route::post('/producto_usuario', [api::class, 'postProductoUsuario']);
Route::delete('/producto_usuario/{id}', [api::class, 'deleteProductoUsuario']);
Route::delete('/producto_usuario/remove/{producto_id}/{usuario_id}', [api::class, 'deleteProductoUsuarioByProductAndUser']);

// New route for product statistics
Route::get('/productos_usuario/stats/{user_id}', [api::class, 'getProductStats']);

