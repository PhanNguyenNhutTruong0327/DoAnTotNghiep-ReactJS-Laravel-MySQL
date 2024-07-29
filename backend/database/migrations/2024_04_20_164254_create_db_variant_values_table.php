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
        Schema::create('db_variantValues', function (Blueprint $table) {
            $table->uuid('id');
            $table->uuid('variant_id');
            $table->float('price');
            $table->unsignedInteger('qty');
            // UUID được đảm bảo là duy nhất trên toàn cầu, tức là khả năng xảy ra trùng lặp giữa các UUID là rất thấp
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('db_variantValues');
    }
};
