<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Social extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'provider_user_id', 'provider', 'customer_id'
    ];

    protected $primaryKey = 'id';
    protected $table = 'db_social';
    public function login(){
        return $this->belongsTo('App\Login', 'customer_id');
    }
}
