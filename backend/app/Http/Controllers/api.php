<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\perfil_usuario;
use App\Models\User;
use App\Models\categoria;
use App\Models\producto;
use App\Models\productoCategorias;
use App\Models\imagenes;
use App\Models\valoraciones;
use App\Models\caracteristicas;
use App\Models\productos_carrito;
use App\Models\carrito;
use App\Models\metodos_pago; // Add this import for the payments model
use Illuminate\Support\Facades\Hash;

//Perfil de usuario
//Usuarios
//Categorías
//Productos
//Producto Categorías
//Valoraciones
//Imágenes
//Características
//Carrito
//Productos Carrito

class api extends Controller
{
    //Funciones get
    //Perfil de usuario
    public function getPerfilUsuario()
    {
        $perfil_usuarios = perfil_usuario::all();
        if ($perfil_usuarios == null) {
            return response()->json([
                "message" => "Perfil de usuario no encontrado"
            ], 404);
        }

        return response()->json($perfil_usuarios, 200);
    }

    public function getPerfilUsuarioId($id)
    {
        $perfil_usuario = perfil_usuario::find($id);
        if ($perfil_usuario == null) {
            return response()->json([
                "message" => "Perfil de usuario no encontrado"
            ], 404);
        }

        return response()->json($perfil_usuario, 200);
    }

    //Usuarios
    public function getUsuarios()
    {
        $usuarios = User::all();
        if ($usuarios == null) {
            return response()->json([
                "message" => "Usuarios no encontrados"
            ], 404);
        }

        return response()->json($usuarios, 200);
    }

    public function getUsuarioId($id)
    {
        $usuario = User::find($id);
        if ($usuario == null) {
            return response()->json([
                "message" => "Usuario no encontrado"
            ], 404);
        }

        return response()->json($usuario, 200);
    }

    //Categorías
    public function getCategorias()
    {
        $categorias = categoria::all();
        if ($categorias == null) {
            return response()->json([
                "message" => "Categorías no encontradas"
            ], 404);
        }

        return response()->json($categorias, 200);
    }

    public function getCategoriaId($id)
    {
        $categoria = categoria::find($id);
        if ($categoria == null) {
            return response()->json([
                "message" => "Categoría no encontrada"
            ], 404);
        }

        return response()->json($categoria, 200);
    }

    //Productos
    public function getProductos()
    {
        $productos = producto::all();
        if ($productos == null) {
            return response()->json([
                "message" => "Productos no encontrados"
            ], 404);
        }

        return response()->json($productos, 200);
    }

    public function getProductoId($id)
    {
        $producto = producto::find($id);
        if ($producto == null) {
            return response()->json([
                "message" => "Producto no encontrado"
            ], 404);
        }

        return response()->json($producto, 200);
    }

    //Producto Categorías
    public function getProductoCategorias()
    {
        $productoCategorias = productoCategorias::all();
        if ($productoCategorias == null) {
            return response()->json([
                "message" => "Producto Categorías no encontradas"
            ], 404);
        }

        return response()->json($productoCategorias, 200);
    }

    public function getProductoCategoriasId($id)
    {
        $productoCategorias = productoCategorias::where('producto_id', $id)->get();
        if ($productoCategorias == null) {
            return response()->json([
                "message" => "Producto Categorías no encontradas"
            ], 404);
        }

        return response()->json($productoCategorias, 200);
    }

    //Valoraciones
    public function getValoraciones()
    {
        $valoraciones = valoraciones::all();
        if ($valoraciones == null) {
            return response()->json([
                "message" => "Valoraciones no encontradas"
            ], 404);
        }

        return response()->json($valoraciones, 200);
    }

    public function getValoracionesId($id)
    {
        $valoraciones = valoraciones::where('producto_id', $id)->get();
        if ($valoraciones == null) {
            return response()->json([
                "message" => "Valoraciones no encontradas"
            ], 404);
        }

        return response()->json($valoraciones, 200);
    }

    //Imágenes
    public function getImagenes()
    {
        $imagenes = imagenes::all();
        if ($imagenes == null) {
            return response()->json([
                "message" => "Imágenes no encontradas"
            ], 404);
        }

        return response()->json($imagenes, 200);
    }

    public function getImagenesId($id)
    {
        $imagenes = imagenes::where('producto_id', $id)->get();
        if ($imagenes == null) {
            return response()->json([
                "message" => "Imágenes no encontradas"
            ], 404);
        }

        return response()->json($imagenes, 200);
    }

    //Características
    public function getCaracteristicas()
    {
        $caracteristicas = caracteristicas::all();
        if ($caracteristicas == null) {
            return response()->json([
                "message" => "Características no encontradas"
            ], 404);
        }

        return response()->json($caracteristicas, 200);
    }

    public function getCaracteristicasId($id)
    {
        $caracteristicas = caracteristicas::where('producto_id', $id)->get();
        if ($caracteristicas == null) {
            return response()->json([
                "message" => "Características no encontradas"
            ], 404);
        }

        return response()->json($caracteristicas, 200);
    }

    //Carrito
    public function getCarrito()
    {
        $carrito = carrito::all();
        if ($carrito == null) {
            return response()->json([
                "message" => "Carrito no encontrado"
            ], 404);
        }

        return response()->json($carrito, 200);
    }

    public function getCarritoId($id)
    {
        $carrito = carrito::find($id);
        if ($carrito == null) {
            return response()->json([
                "message" => "Carrito no encontrado"
            ], 404);
        }

        return response()->json($carrito, 200);
    }

    //Productos Carrito
    public function getProductosCarrito()
    {
        $productos_carrito = productos_carrito::all();
        if ($productos_carrito == null) {
            return response()->json([
                "message" => "Productos Carrito no encontrados"
            ], 404);
        }

        return response()->json($productos_carrito, 200);
    }

    public function getProductosCarritoId($id)
    {
        $productos_carrito = productos_carrito::find($id);
        if ($productos_carrito == null) {
            return response()->json([
                "message" => "Productos Carrito no encontrados"
            ], 404);
        }

        return response()->json($productos_carrito, 200);
    }


    //Funciones post
    //Perfil de usuario
    public function postPerfilUsuario(Request $request)
    {
        if ($request->nombre == null || $request->apellidos == null || $request->fecha_nacimiento == null || $request->direccion == null || $request->telefono == null || $request->genero == null) {
            return response()->json([
                "message" => "Error, el perfil de usuario debe tener nombre, apellidos, fecha de nacimiento, dirección, teléfono y género"
            ], 400);
        }

        $perfil_usuario = new perfil_usuario;
        $perfil_usuario->nombre = $request->nombre;
        $perfil_usuario->apellidos = $request->apellidos;
        $perfil_usuario->fecha_nacimiento = $request->fecha_nacimiento;
        $perfil_usuario->direccion = $request->direccion;
        $perfil_usuario->telefono = $request->telefono;
        $perfil_usuario->genero = $request->genero;
        if ($request->imagen_usuario) {
            $perfil_usuario->imagen_usuario = $request->imagen_usuario;
        }

        // Asignar imagen_usuario si existe en la solicitud, o un valor predeterminado si no
        $perfil_usuario->imagen_usuario = $request->has('imagen_usuario')
            ? $request->imagen_usuario
            : 'default.jpg';

        $perfil_usuario->save();
        return response()->json([
            "message" => "Perfil de usuario creado",
            "perfil_usuario" => $perfil_usuario->id
        ], 201);
    }

    //Usuarios
    public function postUsuario(Request $request)
    {
        // print_r($request);
        if ($request->email == null || $request->password == null || $request->rol == null || $request->user_profile_id == null) {
            return response()->json([
                "message" => "Error, el usuario debe tener email, password, rol y user_profile_id"
            ], 400);
        }



        $usuario = new User;
        $usuario->email = $request->email;
        $usuario->password = bcrypt($request->password);
        $usuario->rol = $request->rol;
        $usuario->perfil_usuario_id = $request->user_profile_id;

        $usuario->save();
        return response()->json([
            "message" => "Usuario creado"
        ], 201);
    }


    //Categorías
    public function postCategoria(Request $request)
    {
        if ($request->nombre == null || $request->inicio == null) {
            return response()->json([
                "message" => "Error, la categoría debe tener nombre e inicio"
            ], 400);
        }

        $categoria = new categoria;
        $categoria->nombre = $request->nombre;
        $categoria->inicio = $request->inicio;

        $categoria->save();
        return response()->json([
            "message" => "Categoría creada"
        ], 201);
    }

    //Productos
    public function postProducto(Request $request)
    {
        if ($request->nombre == null || $request->precio == null || $request->descuento == null || $request->descripcion == null || $request->stock == null || $request->inicio == null) {
            return response()->json([
                "message" => "Error, el producto debe tener nombre, precio, descuento, descripción, stock e inicio"
            ], 400);
        }

        $producto = new producto;
        $producto->nombre = $request->nombre;
        $producto->precio = $request->precio;
        $producto->descuento = $request->descuento;
        $producto->descripcion = $request->descripcion;
        $producto->stock = $request->stock;
        $producto->inicio = $request->inicio;

        $producto->save();
        return response()->json([
            "message" => "Producto creado"
        ], 201);
    }

    //Producto Categorías
    public function postProductoCategorias(Request $request)
    {
        if ($request->producto_id == null || $request->categoria_id == null) {
            return response()->json([
                "message" => "Error, el producto categoría debe tener producto_id y categoría_id"
            ], 400);
        }

        $productoCategorias = new productoCategorias;
        $productoCategorias->producto_id = $request->producto_id;
        $productoCategorias->categoria_id = $request->categoria_id;

        $productoCategorias->save();
        return response()->json([
            "message" => "Producto categoría creada"
        ], 201);
    }

    //Valoraciones
    public function postValoraciones(Request $request)
    {
        if ($request->review == null || $request->puntuacion == null || $request->fecha == null || $request->util == null || $request->usuario_id == null || $request->producto_id == null) {
            return response()->json([
                "message" => "Error, la valoración debe tener review, puntuación, fecha, util, usuario_id y producto_id"
            ], 400);
        }

        $valoraciones = new valoraciones;
        $valoraciones->review = $request->review;
        $valoraciones->puntuacion = $request->puntuacion;
        $valoraciones->fecha = $request->fecha;
        $valoraciones->util = $request->util;
        $valoraciones->usuario_id = $request->usuario_id;
        $valoraciones->producto_id = $request->producto_id;

        $valoraciones->save();
        return response()->json([
            "message" => "Valoración creada"
        ], 201);
    }

    //Imágenes
    public function postImagenes(Request $request)
    {
        if ($request->url == null || $request->producto_id == null) {
            return response()->json([
                "message" => "Error, la imagen debe tener url y producto_id"
            ], 400);
        }

        $imagenes = new imagenes;
        $imagenes->url = $request->url;
        $imagenes->producto_id = $request->producto_id;

        $imagenes->save();
        return response()->json([
            "message" => "Imagen creada"
        ], 201);
    }

    //Características
    public function postCaracteristicas(Request $request)
    {
        if ($request->texto == null || $request->producto_id == null) {
            return response()->json([
                "message" => "Error, la característica debe tener texto y producto_id"
            ], 400);
        }

        $caracteristicas = new caracteristicas;
        $caracteristicas->texto = $request->texto;
        $caracteristicas->producto_id = $request->producto_id;

        $caracteristicas->save();
        return response()->json([
            "message" => "Característica creada"
        ], 201);
    }

    //Carrito
    public function postCarrito(Request $request)
    {
        if ($request->user_id == null) {
            return response()->json([
                "message" => "Error, el carrito debe tener usuario_id"
            ], 400);
        }

        $carrito = new carrito;
        $carrito->user_id = $request->user_id;
        $carrito->total = 0;

        $carrito->save();
        return response()->json([
            "message" => "Carrito creado"
        ], 201);
    }

    //Productos Carrito
    public function postProductosCarrito(Request $request)
    {
        if ($request->carrito_id == null || $request->producto_id == null || $request->cantidad == null || $request->precio == null) {
            return response()->json([
                "message" => "Error, el producto carrito debe tener carrito_id, producto_id, cantidad y precio"
            ], 400);
        }

        $productos_carrito = new productos_carrito;
        $productos_carrito->carrito_id = $request->carrito_id;
        $productos_carrito->producto_id = $request->producto_id;
        $productos_carrito->cantidad = $request->cantidad;
        $productos_carrito->precio = $request->precio;


        $productos_carrito->save();
        return response()->json([
            "message" => "Producto carrito creado"
        ], 201);
    }



    //Funciones put
    //Perfil de usuario
    public function putPerfilUsuario(Request $request, $id)
    {
        $perfil_usuario = perfil_usuario::find($id);
        if ($perfil_usuario == null) {
            return response()->json([
                "message" => "Perfil de usuario no encontrado"
            ], 404);
        }

        if ($request->nombre == null || $request->apellidos == null || $request->fecha_nacimiento == null || $request->direccion == null || $request->telefono == null || $request->genero == null || $request->imagen_usuario == null) {
            return response()->json([
                "message" => "Error, el perfil de usuario debe tener nombre, apellidos, fecha de nacimiento, dirección, teléfono, género e imagen de usuario"
            ], 400);
        }

        $perfil_usuario->nombre = $request->nombre;
        $perfil_usuario->apellidos = $request->apellidos;
        $perfil_usuario->fecha_nacimiento = $request->fecha_nacimiento;
        $perfil_usuario->direccion = $request->direccion;
        $perfil_usuario->telefono = $request->telefono;
        $perfil_usuario->genero = $request->genero;
        $perfil_usuario->imagen_usuario = $request->imagen_usuario;

        $perfil_usuario->save();
        return response()->json([
            "message" => "Perfil de usuario actualizado"
        ], 200);
    }

    //Usuarios
    public function putUsuario(Request $request, $id)
    {
        $usuario = User::find($id);
        if ($usuario == null) {
            return response()->json([
                "message" => "Usuario no encontrado"
            ], 404);
        }

        if ($request->email == null || $request->password == null || $request->rol == null || $request->user_profile_id == null) {
            return response()->json([
                "message" => "Error, el usuario debe tener email, password y user_profile_id"
            ], 400);
        }

        $usuario->email = $request->email;
        $usuario->password = $request->password;
        $usuario->rol = $request->rol;
        $usuario->perfil_usuario_id = $request->user_profile_id;

        $usuario->save();
        return response()->json([
            "message" => "Usuario actualizado"
        ], 200);
    }

    //Categorías
    public function putCategoria(Request $request, $id)
    {
        $categoria = categoria::find($id);
        if ($categoria == null) {
            return response()->json([
                "message" => "Categoría no encontrada"
            ], 404);
        }

        if ($request->nombre == null || $request->inicio == null) {
            return response()->json([
                "message" => "Error, la categoría debe tener nombre e inicio"
            ], 400);
        }

        $categoria->nombre = $request->nombre;
        $categoria->inicio = $request->inicio;

        $categoria->save();
        return response()->json([
            "message" => "Categoría actualizada"
        ], 200);
    }

    //Productos
    public function putProducto(Request $request, $id)
    {
        $producto = producto::find($id);
        if ($producto == null) {
            return response()->json([
                "message" => "Producto no encontrado"
            ], 404);
        }

        if ($request->nombre == null || $request->precio == null || $request->descuento == null || $request->descripcion == null || $request->stock == null || $request->inicio == null) {
            return response()->json([
                "message" => "Error, el producto debe tener nombre, precio, descuento, descripción, stock e inicio"
            ], 400);
        }

        $producto->nombre = $request->nombre;
        $producto->precio = $request->precio;

        if ($request->descuento != null) {
            $producto->descuento = $request->descuento;
        }
        if ($request->descripcion != null) {
            $producto->descripcion = $request->descripcion;
        }
        if ($request->stock != null) {
            $producto->stock = $request->stock;
        }
        if ($request->inicio != null) {
            $producto->inicio = $request->inicio;
        }

        $producto->save();
        return response()->json([
            "message" => "Producto actualizado"
        ], 200);
    }

    //Producto Categorías
    public function putProductoCategorias(Request $request, $id)
    {
        $productoCategorias = productoCategorias::find($id);
        if ($productoCategorias == null) {
            return response()->json([
                "message" => "Producto Categorías no encontradas"
            ], 404);
        }

        if ($request->producto_id == null || $request->categoria_id == null) {
            return response()->json([
                "message" => "Error, el producto categoría debe tener producto_id y categoría_id"
            ], 400);
        }

        $productoCategorias->producto_id = $request->producto_id;
        $productoCategorias->categoria_id = $request->categoria_id;

        $productoCategorias->save();
        return response()->json([
            "message" => "Producto categoría actualizada"
        ], 200);
    }

    //Valoraciones
    public function putValoraciones(Request $request, $id)
    {
        $valoraciones = valoraciones::find($id);
        if ($valoraciones == null) {
            return response()->json([
                "message" => "Valoraciones no encontradas"
            ], 404);
        }

        if ($request->review == null || $request->puntuacion == null || $request->fecha == null || $request->util == null || $request->usuario_id == null || $request->producto_id == null) {
            return response()->json([
                "message" => "Error, la valoración debe tener review, puntuación, fecha, util, usuario_id y producto_id"
            ], 400);
        }

        $valoraciones->review = $request->review;
        $valoraciones->puntuacion = $request->puntuacion;
        $valoraciones->fecha = $request->fecha;
        $valoraciones->util = $request->util;
        $valoraciones->usuario_id = $request->usuario_id;
        $valoraciones->producto_id = $request->producto_id;

        $valoraciones->save();
        return response()->json([
            "message" => "Valoración actualizada"
        ], 200);
    }

    //Imágenes
    public function putImagenes(Request $request, $id)
    {
        $imagenes = imagenes::find($id);
        if ($imagenes == null) {
            return response()->json([
                "message" => "Imágenes no encontradas"
            ], 404);
        }

        if ($request->url == null || $request->producto_id == null) {
            return response()->json([
                "message" => "Error, la imagen debe tener url y producto_id"
            ], 400);
        }

        $imagenes->url = $request->url;
        $imagenes->producto_id = $request->producto_id;

        $imagenes->save();
        return response()->json([
            "message" => "Imagen actualizada"
        ], 200);
    }

    //Características

    public function putCaracteristicas(Request $request, $id)
    {
        $caracteristicas = caracteristicas::find($id);
        if ($caracteristicas == null) {
            return response()->json([
                "message" => "Características no encontradas"
            ], 404);
        }

        if ($request->texto == null || $request->producto_id == null) {
            return response()->json([
                "message" => "Error, la característica debe tener texto y producto_id"
            ], 400);
        }

        $caracteristicas->texto = $request->texto;
        $caracteristicas->producto_id = $request->producto_id;

        $caracteristicas->save();
        return response()->json([
            "message" => "Característica actualizada"
        ], 200);
    }

    //Carrito

    public function putCarrito(Request $request, $id)
    {
        $carrito = carrito::find($id);
        if ($carrito == null) {
            return response()->json([
                "message" => "Carrito no encontrado"
            ], 404);
        }

        if ($request->usuario_id != null) {
            $carrito->usuario_id = $request->usuario_id;
        }

        if ($request->total != null) {
            $carrito->total = $request->total;
        }

        $carrito->save();
        return response()->json([
            "message" => "Carrito actualizado"
        ], 200);
    }

    //Productos Carrito

    public function putProductosCarrito(Request $request, $id)
    {
        $productos_carrito = productos_carrito::find($id);
        if ($productos_carrito == null) {
            return response()->json([
                "message" => "Productos Carrito no encontrados"
            ], 404);
        }

        if ($request->carrito_id) {
            $productos_carrito->carrito_id = $request->carrito_id;
        }

        if ($request->producto_id) {
            $productos_carrito->producto_id = $request->producto_id;
        }

        if ($request->cantidad) {
            $productos_carrito->cantidad = $request->cantidad;
        }

        if ($request->precio) {
            $productos_carrito->precio = $request->precio;
        }

        $productos_carrito->save();
        return response()->json([
            "message" => "Producto carrito actualizado"
        ], 200);
    }

    //Funciones delete
    //Perfil de usuario
    public function deletePerfilUsuario($id)
    {
        $perfil_usuario = perfil_usuario::find($id);
        if ($perfil_usuario == null) {
            return response()->json([
                "message" => "Perfil de usuario no encontrado"
            ], 404);
        }

        $perfil_usuario->delete();
        return response()->json([
            "message" => "Perfil de usuario eliminado"
        ], 200);
    }

    //Usuarios
    public function deleteUsuario($id)
    {
        $usuario = User::find($id);
        if ($usuario == null) {
            return response()->json([
                "message" => "Usuario no encontrado"
            ], 404);
        }

        $usuario->delete();
        return response()->json([
            "message" => "Usuario eliminado"
        ], 200);
    }

    //Categorías
    public function deleteCategoria($id)
    {
        $categoria = categoria::find($id);
        if ($categoria == null) {
            return response()->json([
                "message" => "Categoría no encontrada"
            ], 404);
        }

        $categoria->delete();
        return response()->json([
            "message" => "Categoría eliminada"
        ], 200);
    }

    //Productos
    public function deleteProducto($id)
    {
        $producto = producto::find($id);
        if ($producto == null) {
            return response()->json([
                "message" => "Producto no encontrado"
            ], 404);
        }

        $producto->delete();
        return response()->json([
            "message" => "Producto eliminado"
        ], 200);
    }

    //Producto Categorías
    public function deleteProductoCategorias($id)
    {
        $productoCategorias = productoCategorias::find($id);
        if ($productoCategorias == null) {
            return response()->json([
                "message" => "Producto Categorías no encontradas"
            ], 404);
        }

        $productoCategorias->delete();
        return response()->json([
            "message" => "Producto Categorías eliminadas"
        ], 200);
    }

    //Valoraciones
    public function deleteValoraciones($id)
    {
        $valoraciones = valoraciones::find($id);
        if ($valoraciones == null) {
            return response()->json([
                "message" => "Valoraciones no encontradas"
            ], 404);
        }

        $valoraciones->delete();
        return response()->json([
            "message" => "Valoraciones eliminadas"
        ], 200);
    }

    //Imágenes
    public function deleteImagenes($id)
    {
        $imagenes = imagenes::find($id);
        if ($imagenes == null) {
            return response()->json([
                "message" => "Imágenes no encontradas"
            ], 404);
        }

        $imagenes->delete();
        return response()->json([
            "message" => "Imágenes eliminadas"
        ], 200);
    }

    //Características
    public function deleteCaracteristicas($id)
    {
        $caracteristicas = caracteristicas::find($id);
        if ($caracteristicas == null) {
            return response()->json([
                "message" => "Características no encontradas"
            ], 404);
        }

        $caracteristicas->delete();
        return response()->json([
            "message" => "Características eliminadas"
        ], 200);
    }

    //Carrito
    public function deleteCarrito($id)
    {
        $carrito = carrito::find($id);
        if ($carrito == null) {
            return response()->json([
                "message" => "Carrito no encontrado"
            ], 404);
        }

        $productos_carrito = productos_carrito::where('carrito_id', $id)->get();
        foreach ($productos_carrito as $producto) {
            $producto->delete();
        }

        $carrito->delete();
        return response()->json([
            "message" => "Carrito eliminado"
        ], 200);
    }

    //Productos Carrito
    public function deleteProductosCarrito($id)
    {
        $productos_carrito = productos_carrito::find($id);
        if ($productos_carrito == null) {
            return response()->json([
                "message" => "Productos Carrito no encontrados"
            ], 404);
        }

        $productos_carrito->delete();
        return response()->json([
            "message" => "Productos Carrito eliminados"
        ], 200);
    }


    //Funciones login
    public function login(Request $request)
    {
        $usuario = User::where('email', $request->email)->first();
        if ($usuario == null) {
            return response()->json([
                "message" => "Usuario no encontrado"
            ], 404);
        }

        //Comprobar la contraseña que ha sido encriptada con bcrypt
        if (Hash::check($request->password, $usuario->password)) {
            return response()->json([
                "message" => "Usuario logeado",
                "usuario" => $usuario
            ], 200);
        } else {
            return response()->json([
                "message" => "Contraseña incorrecta"
            ], 400);
        }
    }

    //Métodos de pago
    //Get, post, update y delete
    public function getMetodosPago()
    {
        $metodos_pago = metodos_pago::all();
        if ($metodos_pago->isEmpty()) {
            return response()->json([
                "message" => "Métodos de pago no encontrados"
            ], 404);
        }

        return response()->json($metodos_pago, 200);
    }

    public function getMetodosPagoId($id)
    {
        $metodo_pago = metodos_pago::find($id);

        if ($metodo_pago == null) {
            return response()->json([
                "message" => "Método de pago no encontrado"
            ], 404);
        }

        return response()->json($metodo_pago, 200);
    }

    public function postMetodoPago(Request $request)
    {
        if ($request->user_id == null || $request->nombre == null || $request->tarjeta == null ||
            $request->caducidad == null || $request->cvv == null) {
            return response()->json([
                "message" => "Error, el método de pago debe tener user_id, nombre, tarjeta, caducidad y cvv"
            ], 400);
        }

        // Check if the card number already exists
        $existingCard = metodos_pago::where('tarjeta', $request->tarjeta)->first();
        if ($existingCard) {
            return response()->json([
                "message" => "Error, ya existe un método de pago con esta tarjeta"
            ], 400);
        }

        $metodo_pago = new metodos_pago;
        $metodo_pago->user_id = $request->user_id;
        $metodo_pago->nombre = $request->nombre;
        $metodo_pago->tarjeta = $request->tarjeta;
        $metodo_pago->caducidad = $request->caducidad;
        $metodo_pago->cvv = $request->cvv;

        $metodo_pago->save();
        return response()->json([
            "message" => "Método de pago creado",
            "metodo_pago" => $metodo_pago
        ], 201);
    }

    public function putMetodoPago(Request $request, $id)
    {
        $metodo_pago = metodos_pago::where('id', $id)
                      ->where(function($query) {
                          $query->where('eliminado', false)->orWhereNull('eliminado');
                      })->first();

        if ($metodo_pago == null) {
            return response()->json([
                "message" => "Método de pago no encontrado"
            ], 404);
        }

        if ($request->user_id != null) {
            $metodo_pago->user_id = $request->user_id;
        }

        if ($request->nombre != null) {
            $metodo_pago->nombre = $request->nombre;
        }

        if ($request->tarjeta != null) {
            // Check if the new card number already exists (except for this record)
            $existingCard = metodos_pago::where('tarjeta', $request->tarjeta)
                              ->where('id', '!=', $id)
                              ->where(function($query) {
                                  $query->where('eliminado', false)->orWhereNull('eliminado');
                              })
                              ->first();
            if ($existingCard) {
                return response()->json([
                    "message" => "Error, ya existe un método de pago con esta tarjeta"
                ], 400);
            }
            $metodo_pago->tarjeta = $request->tarjeta;
        }

        if ($request->caducidad != null) {
            $metodo_pago->caducidad = $request->caducidad;
        }

        if ($request->cvv != null) {
            $metodo_pago->cvv = $request->cvv;
        }

        $metodo_pago->save();
        return response()->json([
            "message" => "Método de pago actualizado",
            "metodo_pago" => $metodo_pago
        ], 200);
    }

    public function deleteMetodoPago($id)
    {
        $metodo_pago = metodos_pago::where('id', $id)
                      ->where(function($query) {
                          $query->where('eliminado', false)->orWhereNull('eliminado');
                      })->first();

        if ($metodo_pago == null) {
            return response()->json([
                "message" => "Método de pago no encontrado"
            ], 404);
        }

        // Logical deletion instead of physical deletion
        $metodo_pago->eliminado = true;
        $metodo_pago->save();

        return response()->json([
            "message" => "Método de pago eliminado"
        ], 200);
    }
}
