<?php

namespace App\Console\Commands;

use App\Services\ApplicationService;
use Illuminate\Console\Command;

class ExpireApplicationsCommand extends Command
{
    protected $signature = 'applications:expire';

    protected $description = '反応期限(7日)を過ぎた応募を自動的に不成立(expired)にする';

    public function handle(ApplicationService $service): int
    {
        $count = $service->expireOverdue();

        $this->info("{$count}件の応募をexpiredに更新しました。");

        return self::SUCCESS;
    }
}
