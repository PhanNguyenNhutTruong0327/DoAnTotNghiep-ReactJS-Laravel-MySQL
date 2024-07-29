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
        Schema::create('db_productShippings', function (Blueprint $table) {
            $table->uuid('product_id');
            $table->unsignedInteger('ship_charge');
            $table->boolean('free');
            $table->unsignedInteger('estimated_days');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('db_productShippings');
    }
};
