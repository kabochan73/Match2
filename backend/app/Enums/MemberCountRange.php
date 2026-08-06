<?php

namespace App\Enums;

enum MemberCountRange: string
{
    case Range1To10 = '1_10';
    case Range11To50 = '11_50';
    case Range51To100 = '51_100';
    case Range101To300 = '101_300';
    case Range301Plus = '301_plus';
}
