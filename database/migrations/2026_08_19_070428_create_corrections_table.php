<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Visitor-submitted corrections to a guide's content. Phase 1: a human
     * reviews these in the admin panel. Phase 2: the AI agent reviews them
     * first and reports the decision over Telegram.
     */
    public function up(): void
    {
        Schema::create('corrections', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('guide_id')->constrained()->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->text('message');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('corrections');
    }
};
