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
        Schema::create('db_atributeValues', function (Blueprint $table) {
            $table->uuid('id');
            $table->uuid('attribute_id');
            $table->string('attribute_value',1000);
            $table->string('color',1000);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('db_atributeValues');
    }
};
