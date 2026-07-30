<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_posting_id')->constrained()->cascadeOnDelete();
            $table->string('like_type')->default('standard');
            $table->text('motivation');
            $table->string('status')->default('applied');
            $table->timestamp('applied_at');
            $table->timestamp('response_deadline');
            $table->timestamp('company_responded_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'job_posting_id']);
            $table->index(['user_id', 'like_type', 'applied_at']);
            $table->index('job_posting_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
