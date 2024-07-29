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
        Schema::create('db_coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code',1000);
            $table->string('coupon_descripton',1000);
            $table->unsignedInteger('discount_value');
            $table->string('discount_type',1000);
            $table->unsignedInteger('times_used');
            $table->unsignedInteger('max_usage');
            $table->timestamp('coupon_start_date')->nullable();
            $table->timestamp('coupon_end_date')->nullable();
            $table->timestamps(); //created_at, updated_at
            $table->unsignedInteger('created_by')->default(1);
            $table->unsignedInteger('updated_by')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('db_coupons');
    }
};
