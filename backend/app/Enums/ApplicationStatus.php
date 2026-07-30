<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case Applied = 'applied';
    case Matched = 'matched';
    case Expired = 'expired';
}
