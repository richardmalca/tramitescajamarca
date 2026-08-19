<?php

namespace App\Enums;

enum CorrectionStatus: string
{
    case Pending = 'pending';
    case Applied = 'applied';
    case Dismissed = 'dismissed';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pendiente',
            self::Applied => 'Aplicada',
            self::Dismissed => 'Descartada',
        };
    }
}
