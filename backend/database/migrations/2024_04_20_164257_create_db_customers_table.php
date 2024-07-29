<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('db_customers', function (Blueprint $table) {
            $table->id();
            $table->string('first_name',1000);
            $table->string('last_name',1000);
            $table->string('phone_number',1000);
            $table->mediumText('email');
            $table->mediumText('password_hash');
            $table->boolean('active');
            $table->time('register_at');
            $table->time('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('db_customers');
    }
};
