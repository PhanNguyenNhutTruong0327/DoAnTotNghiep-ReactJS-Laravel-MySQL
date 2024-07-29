<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Customers extends Model
{
    use HasFactory, HasApiTokens;
    protected $table='db_customers';
    protected $fillable = ['email', 'other_fields', 'you', 'want', 'to', 'allow'];
    public $timestamps = false;

}
