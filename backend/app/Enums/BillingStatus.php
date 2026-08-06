<?php

namespace App\Enums;

enum BillingStatus: string
{
    case Unregistered = 'unregistered';
    case Active = 'active';
    case PastDue = 'past_due';
}
