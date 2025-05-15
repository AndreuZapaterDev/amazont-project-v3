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
use App\Models\metodos_pago;
use App\Models\productos_usuario; // Add the model import
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt; // Add Crypt facade for encryption

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


    public function getProductosCarritoByCarritoId($carrito_id)
    {
        $productos_carrito = productos_carrito::where('carrito_id', $carrito_id)->get();
        if ($productos_carrito->isEmpty()) {
            return response()->json([
                "message" => "No hay productos en este carrito"
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
            "message" => "Producto creado",
            "producto_id" => $producto->id
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
            "message" => "Carrito creado",
            "carrito_id" => $carrito->id
        ], 201);
    }

    //Productos Carrito
    public function postProductosCarrito(Request $request)
    {
        if ($request->carrito_id == null || $request->producto_id == null || $request->cantidad == null) {
            return response()->json([
                "message" => "Error, el producto carrito debe tener carrito_id, producto_id y cantidad"
            ], 400);
        }

        // Buscamos el producto para obtener su precio
        $producto = producto::find($request->producto_id);
        if ($producto == null) {
            return response()->json([
                "message" => "Error, el producto no existe"
            ], 404);
        }

        // Mirar si el producto ya existe en el carrito
        $existingProduct = productos_carrito::where('carrito_id', $request->carrito_id)
            ->where('producto_id', $request->producto_id)
            ->first();

        if ($existingProduct) {
            // Como ya existe, solo actualizamos la cantidad
            $existingProduct->cantidad += $request->cantidad;
            
            // Calcular el nuevo precio (producto precio * cantidad)
            $existingProduct->precio = $producto->precio * $existingProduct->cantidad;
            
            $existingProduct->save();
            
            return response()->json([
                "message" => "Cantidad de producto actualizada en el carrito",
                "producto_carrito" => $existingProduct
            ], 200);
        } else {
            // El producto no existe en el carrito, así que lo creamos
            // Calcular el nuevo precio (producto precio * cantidad)
            $precio_calculado = $producto->precio * $request->cantidad;

            $productos_carrito = new productos_carrito;
            $productos_carrito->carrito_id = $request->carrito_id;
            $productos_carrito->producto_id = $request->producto_id;
            $productos_carrito->cantidad = $request->cantidad;
            $productos_carrito->precio = $precio_calculado;

            $productos_carrito->save();
            return response()->json([
                "message" => "Producto carrito creado",
                "producto_carrito" => $productos_carrito
            ], 201);
        }
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

        if ($request->email == null || $request->rol == null || $request->user_profile_id == null) {
            return response()->json([
                "message" => "Error, el usuario debe tener email, rol y user_profile_id"
            ], 400);
        }

        $usuario->email = $request->email;
        if ($request->password != null) {
            $usuario->password = bcrypt($request->password);
        }
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

        // Add the ability to update metodo_pago_id
        if ($request->metodo_pago_id != null) {
            $carrito->metodo_pago_id = $request->metodo_pago_id;
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

        // Si la cantidad se proporciona, actualizamos la cantidad y el precio
        if ($request->cantidad) {
            $productos_carrito->cantidad = $request->cantidad;

            // Obtener el precio del producto
            $producto = producto::find($productos_carrito->producto_id);
            if ($producto) {
                $productos_carrito->precio = $producto->precio * $request->cantidad;
            }
        }

        $productos_carrito->save();
        return response()->json([
            "message" => "Producto carrito actualizado",
            "producto_carrito" => $productos_carrito
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

        // Eliminar registros relacionados en productos_usuario (favoritos)
        productos_usuario::where('producto_id', $id)->delete();
        
        // Eliminar registros relacionados en productos_carrito (ítems del carrito)
        productos_carrito::where('producto_id', $id)->delete();
        
        // Eliminar registros relacionados en valoraciones
        valoraciones::where('producto_id', $id)->delete();
        
        // Eliminar registros relacionados en caracteristicas
        caracteristicas::where('producto_id', $id)->delete();
        
        // Eliminar registros relacionados en imagenes
        imagenes::where('producto_id', $id)->delete();
        
        // Eliminar registros relacionados en productoCategorias (relaciones de categorías)
        productoCategorias::where('producto_id', $id)->delete();
        
        // Finalmente eliminar el producto
        $producto->delete();
        
        return response()->json([
            "message" => "Producto y todos sus datos relacionados eliminados correctamente"
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

        // Desencriptar datos sensibles antes de devolverlos
        foreach ($metodos_pago as $metodo) {
            $metodo->nombre = $this->decryptField($metodo->nombre);
            $metodo->tarjeta = $this->decryptField($metodo->tarjeta);
            $metodo->caducidad = $this->decryptField($metodo->caducidad);
            $metodo->cvv = $this->decryptField($metodo->cvv);
        }

        return response()->json($metodos_pago, 200);
    }

    public function getMetodosPagoId($id)
    {
        $metodo_pago = metodos_pago::where('user_id', $id)
            ->where(function($query) {
            $query->where('eliminado', false)->orWhereNull('eliminado');
            })
            ->get();

        if ($metodo_pago == null) {
            return response()->json([
                "message" => "Método de pago no encontrado"
            ], 404);
        }

        // Desencriptar datos sensibles antes de devolverlos
        foreach ($metodo_pago as $metodo) {
            $metodo->nombre = $this->decryptField($metodo->nombre);
            $metodo->tarjeta = $this->decryptField($metodo->tarjeta);
            $metodo->caducidad = $this->decryptField($metodo->caducidad);
            $metodo->cvv = $this->decryptField($metodo->cvv);
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

        // Mirar si la tarjeta ya existe
        $existingCards = metodos_pago::all();
        foreach ($existingCards as $card) {
            $decryptedCard = $this->decryptField($card->tarjeta);
            if ($decryptedCard === $request->tarjeta) {
                return response()->json([
                    "message" => "Error, ya existe un método de pago con esta tarjeta"
                ], 400);
            }
        }

        $metodo_pago = new metodos_pago;
        $metodo_pago->user_id = $request->user_id;
        $metodo_pago->nombre = $this->encryptField($request->nombre);
        $metodo_pago->tarjeta = $this->encryptField($request->tarjeta);
        $metodo_pago->caducidad = $this->encryptField($request->caducidad);
        $metodo_pago->cvv = $this->encryptField($request->cvv);

        $metodo_pago->save();
        
        // Desencriptar datos sensibles antes de devolverlos
        $responseData = $metodo_pago->toArray();
        $responseData['nombre'] = $request->nombre;
        $responseData['tarjeta'] = $request->tarjeta;
        $responseData['caducidad'] = $request->caducidad;
        $responseData['cvv'] = $request->cvv;
        
        return response()->json([
            "message" => "Método de pago creado",
            "metodo_pago" => $responseData
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
            $metodo_pago->nombre = $this->encryptField($request->nombre);
        }

        if ($request->tarjeta != null) {
            // Mirar si la tarjeta ya existe, sin contar esta
            $existingCards = metodos_pago::where('id', '!=', $id)
                             ->where(function($query) {
                                 $query->where('eliminado', false)->orWhereNull('eliminado');
                             })->get();
                             
            foreach ($existingCards as $card) {
                $decryptedCard = $this->decryptField($card->tarjeta);
                if ($decryptedCard === $request->tarjeta) {
                    return response()->json([
                        "message" => "Error, ya existe un método de pago con esta tarjeta"
                    ], 400);
                }
            }
            
            $metodo_pago->tarjeta = $this->encryptField($request->tarjeta);
        }

        if ($request->caducidad != null) {
            $metodo_pago->caducidad = $this->encryptField($request->caducidad);
        }

        if ($request->cvv != null) {
            $metodo_pago->cvv = $this->encryptField($request->cvv);
        }

        $metodo_pago->save();
        
        // Desencriptar datos sensibles antes de devolverlos
        $responseData = $metodo_pago->toArray();
        $responseData['nombre'] = $request->nombre ?? $this->decryptField($metodo_pago->nombre);
        $responseData['tarjeta'] = $request->tarjeta ?? $this->decryptField($metodo_pago->tarjeta);
        $responseData['caducidad'] = $request->caducidad ?? $this->decryptField($metodo_pago->caducidad);
        $responseData['cvv'] = $request->cvv ?? $this->decryptField($metodo_pago->cvv);
        
        return response()->json([
            "message" => "Método de pago actualizado",
            "metodo_pago" => $responseData
        ], 200);
    }

    // Funciones helper para encriptar y desencriptar campos
    private function encryptField($value)
    {
        if ($value === null) {
            return null;
        }
        return Crypt::encryptString($value);
    }

    private function decryptField($value)
    {
        if ($value === null) {
            return null;
        }
        try {
            return Crypt::decryptString($value);
        } catch (\Exception $e) {
            return $value;
        }
    }
    
    /**
     * Finalizar el carrito y actualizar el stock de los productos
     */
    public function acabarCarrito($id)
    {
        $carrito = carrito::find($id);
        if ($carrito == null) {
            return response()->json([
                "message" => "Carrito no encontrado"
            ], 404);
        }

        // Obtener todos los productos del carrito
        $productos_carrito = productos_carrito::where('carrito_id', $id)->get();
        $total = 0;
        $stockErrors = [];

        // Mirar si hay stock suficiente
        foreach ($productos_carrito as $producto_carrito) {
            $producto = producto::find($producto_carrito->producto_id);
            if ($producto == null) {
                return response()->json([
                    "message" => "Error: Producto con ID " . $producto_carrito->producto_id . " no encontrado"
                ], 404);
            }

            if ($producto->stock < $producto_carrito->cantidad) {
                $stockErrors[] = "No hay suficiente stock para el producto '" . $producto->nombre . 
                                "'. Stock disponible: " . $producto->stock . 
                                ", Cantidad solicitada: " . $producto_carrito->cantidad;
            }

            $total += $producto_carrito->precio;
        }

        // Si hay errores de stock, no se puede finalizar el carrito
        if (!empty($stockErrors)) {
            return response()->json([
                "message" => "Error: Stock insuficiente",
                "errors" => $stockErrors
            ], 400);
        }

        // Procesamos el carrito y actualizamos el stock
        foreach ($productos_carrito as $producto_carrito) {
            $producto = producto::find($producto_carrito->producto_id);
            
            // Reduce the stock
            $producto->stock -= $producto_carrito->cantidad;
            $producto->save();
        }

        // Ponemos acabado a true
        $carrito->acabado = true;

        // Actualizamos la fecha de pago
        $carrito->fecha_pago = now();

        // Actualizamos el total
        $carrito->total = $total;

        $carrito->save();

        return response()->json([
            "message" => "Carrito finalizado correctamente, stock de productos actualizado",
            "carrito" => $carrito
        ], 200);
    }

    // Función para obtener la puntuación de un producto
    public function getPuntuacionPorProducto($producto_id)
    {
        $count = valoraciones::where('producto_id', $producto_id)->count();

        return response()->json([
            "producto_id" => $producto_id,
            "total_valoraciones" => $count
        ], 200);
    }

    /**
     * Obtener el carrito activo de un usuario
     */
    public function getCarritoActivo($user_id)
    {
        $carrito = carrito::where('user_id', $user_id)
                          ->where('acabado', false)
                          ->first();

        if ($carrito == null) {
            return response()->json([
                "message" => "No hay carritos activos",
                "activo" => false
            ], 404);
        }

        return response()->json([
            "carrito" => $carrito,
            "activo" => true
        ], 200);
    }

    //Productos Usuario
    public function getProductosUsuario()
    {
        $productos_usuario = productos_usuario::all();
        if ($productos_usuario->isEmpty()) {
            return response()->json([
                "message" => "No se encontraron productos"
            ], 404);
        }

        return response()->json($productos_usuario, 200);
    }

    public function getProductosUsuarioByUserId($id)
    {
        $productos_usuario = productos_usuario::where('usuario_id', $id)->get();
        if ($productos_usuario->isEmpty()) {
            return response()->json([
                "message" => "No se encontraron productos para este usuario"
            ], 404);
        }

        return response()->json($productos_usuario, 200);
    }

    public function getProductoUsuarioById($id)
    {
        $producto_usuario = productos_usuario::find($id);
        if ($producto_usuario == null) {
            return response()->json([
                "message" => "Producto no encontrado"
            ], 404);
        }

        return response()->json($producto_usuario, 200);
    }

    public function postProductoUsuario(Request $request)
    {
        if ($request->producto_id == null || $request->usuario_id == null) {
            return response()->json([
                "message" => "Error, el producto debe tener producto_id y usuario_id"
            ], 400);
        }

        // Miramos si la relación ya existe
        $existingRelation = productos_usuario::where('producto_id', $request->producto_id)
            ->where('usuario_id', $request->usuario_id)
            ->first();

        if ($existingRelation) {
            return response()->json([
                "message" => "Esta relación ya existe"
            ], 400);
        }

        $producto_usuario = new productos_usuario;
        $producto_usuario->producto_id = $request->producto_id;
        $producto_usuario->usuario_id = $request->usuario_id;

        $producto_usuario->save();
        return response()->json([
            "message" => "Relación añadida",
            "producto_usuario" => $producto_usuario
        ], 201);
    }

    public function deleteProductoUsuario($id)
    {
        $producto_usuario = productos_usuario::find($id);
        if ($producto_usuario == null) {
            return response()->json([
                "message" => "Relación no encontrada"
            ], 404);
        }

        $producto_usuario->delete();
        return response()->json([
            "message" => "Relación eliminada"
        ], 200);
    }

    public function deleteProductoUsuarioByProductAndUser($producto_id, $usuario_id)
    {
        $producto_usuario = productos_usuario::where('producto_id', $producto_id)
            ->where('usuario_id', $usuario_id)
            ->first();

        if ($producto_usuario == null) {
            return response()->json([
                "message" => "Producto no encontrado"
            ], 404);
        }

        $producto_usuario->delete();
        return response()->json([
            "message" => "Producto eliminado"
        ], 200);
    }

    /**
     * Obtenemos las estadísticas de los productos de un usuario
     */
    public function getProductStats($user_id)
    {
        // Obtenemos el inicio y fin del mes actual
        $startOfMonth = now()->startOfMonth()->toDateString();
        $endOfMonth = now()->endOfMonth()->toDateString();
        
        // Obtener todos los productos del usuario
        $userProducts = productos_usuario::where('usuario_id', $user_id)->pluck('producto_id');
        
        if ($userProducts->isEmpty()) {
            return response()->json([
                "message" => "No se encontraron productos asociados a este usuario"
            ], 404);
        }
        
        // Buscamos los carritos que contienen estos productos y que están acabados
        $cartIds = productos_carrito::whereIn('producto_id', $userProducts)
            ->pluck('carrito_id')
            ->unique();
        
        $finishedCarts = carrito::whereIn('id', $cartIds)
            ->where('acabado', true)
            ->whereBetween('fecha_pago', [$startOfMonth, $endOfMonth])
            ->get();
        
        $totalFinishedCarts = $finishedCarts->count();
        
        // Calcular las ventas totales del mes
        $monthlySales = $finishedCarts->sum('total');
        
        // Mirar el total de productos vendidos este mes
        $totalProductsSold = productos_carrito::whereIn('carrito_id', $finishedCarts->pluck('id'))
            ->whereIn('producto_id', $userProducts)
            ->sum('cantidad');
        
        // Obtenemos información de cada producto
        $productStats = [];
        
        foreach ($userProducts as $productId) {
            $product = producto::find($productId);
            
            if (!$product) {
                continue;
            }
            
            // Obtener la imagen del producto
            $firstImage = imagenes::where('producto_id', $productId)->first();
            $imageUrl = $firstImage ? $firstImage->url : null;
            
            // Obtener el total vendido y unidades vendidas
            $productCartItems = productos_carrito::whereIn('carrito_id', $finishedCarts->pluck('id'))
                ->where('producto_id', $productId)
                ->get();
            
            $unitsSold = $productCartItems->sum('cantidad');
            $totalSales = $productCartItems->sum('precio');

            // Obtener información de la puntuación
            $reviews = valoraciones::where('producto_id', $productId)->get();
            $reviewCount = $reviews->count();
            $averageRating = $reviewCount > 0 ? $reviews->avg('puntuacion') : 0;
            
            $productStats[] = [
                'product_id' => $productId,
                'name' => $product->nombre,
                'image' => $imageUrl,
                'total_sales' => $totalSales,
                'units_sold' => $unitsSold,
                'reviews' => [
                    'count' => $reviewCount,
                    'average_rating' => round($averageRating, 1)
                ]
            ];
        }
        
        return response()->json([
            'month' => now()->format('F Y'),
            'monthly_sales' => $monthlySales,
            'total_products_sold' => $totalProductsSold,
            'finished_carts' => $totalFinishedCarts,
            'products' => $productStats
        ], 200);
    }
}
