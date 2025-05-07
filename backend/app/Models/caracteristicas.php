<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class caracteristicas extends Model
{
    use HasFactory;

    //
    protected $table = 'caracteristicas';
    protected $fillable = ['texto','producto_id'];
    public $timestamps = false;
}
