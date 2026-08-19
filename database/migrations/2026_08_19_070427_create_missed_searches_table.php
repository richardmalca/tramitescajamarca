<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Every search that returned zero results is logged here. This is the
     * raw signal Phase 2's AI agent will react to (detect content that's
     * missing and write it) — for now it's just a queue a human can read.
     */
    public function up(): void
    {
        Schema::create('missed_searches', function (Blueprint $table): void {
            $table->id();
            $table->string('query');
            $table->unsignedInteger('occurrences')->default(1);
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('missed_searches');
    }
};
