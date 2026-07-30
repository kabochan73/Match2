<?php

namespace App\Enums;

enum LikeStatus: string
{
    case Applied = 'applied';
    case Matched = 'matched';
    case Expired = 'expired';
}
