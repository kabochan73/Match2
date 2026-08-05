<?php

use App\Console\Commands\ExpireLikesCommand;
use App\Console\Commands\PruneNotificationsCommand;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command(ExpireLikesCommand::class)->hourly();
Schedule::command(PruneNotificationsCommand::class)->daily();
