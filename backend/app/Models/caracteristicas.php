<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class caracteristicas extends Model
{
    //
    protected $table = 'caracteristicas';
    protected $fillable = ['texto','producto_id'];
    public $timestamps = false;
}
