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
        Schema::create('db_contact', function (Blueprint $table) {
            $table->id(); //id
            $table->unsignedInteger('user_id')->default(1);
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('title');
            $table->mediumText('content');
            $table->unsignedInteger('replay_id')->default(1);
            $table->timestamps(); //created_at, updated_at
            $table->unsignedInteger('created_by')->default(1);
            $table->unsignedInteger('updated_by')->nullable();
            $table->unsignedTinyInteger('status')->default(2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('db_contact');
    }
};
