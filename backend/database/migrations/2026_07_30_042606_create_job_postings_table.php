<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->text('desired_candidate')->nullable();
            $table->string('employment_type');
            $table->string('prefecture');
            $table->integer('salary_min')->nullable();
            $table->integer('salary_max')->nullable();
            $table->string('status')->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'prefecture', 'employment_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
