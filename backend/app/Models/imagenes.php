<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class imagenes extends Model
{
    //
    protected $table = 'imagenes';
    protected $fillable = ['url','producto_id'];
    public $timestamps = false;

}
