<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class perfil_usuario extends Model
{
    //
    protected $table = 'perfil_usuario';
    protected $fillable = ['nombre', 'apellidos', 'fecha_nacimiento', 'direccion', 'telefono', 'genero', 'imagen_usuario'];
    public $timestamps = false;

}
