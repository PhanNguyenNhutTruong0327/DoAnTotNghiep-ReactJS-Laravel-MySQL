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
        Schema::create('db_staffAccounts', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 1000);
            $table->string('last_name', 1000);
            $table->string('phone_number', 1000);
            $table->string('email', 1000);
            $table->string('password', 255);
            $table->boolean('active');
            $table->string('profile_img', 255)->nullable();
            $table->dateTime('registered_at');
            $table->unsignedInteger('created_by')->default(1);
            $table->unsignedInteger('updated_by')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('db_staffAccounts');
    }
};