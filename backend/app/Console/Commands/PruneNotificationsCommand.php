<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Notifications\DatabaseNotification;

class PruneNotificationsCommand extends Command
{
    private const RETENTION_DAYS = 30;

    protected $signature = 'notifications:prune';

    protected $description = '作成から30日以上経過した通知を自動的に削除する';

    public function handle(): int
    {
        $count = DatabaseNotification::query()
            ->where('created_at', '<', now()->subDays(self::RETENTION_DAYS))
            ->delete();

        $this->info("{$count}件の通知を削除しました。");

        return self::SUCCESS;
    }
}
