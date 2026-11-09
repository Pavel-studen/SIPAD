<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NimFormat implements ValidationRule
{
    /**
     * Strict UGM NIM Regex Pattern: 2 digits / 6 digits / 2 letters / 5 digits
     * Example: 12/123456/SV/12345
     */
    public const PATTERN = '/^\d{2}\/\d{6}\/[A-Za-z]{2}\/\d{5}$/';

    /**
     * Standard validation failure message.
     */
    public const MESSAGE = 'Format NIM tidak valid. Format yang benar: 12/123456/SV/12345 (2 digit angka/6 digit angka/2 huruf/5 digit angka).';

    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if (! is_string($value) || ! self::isValid($value)) {
            $fail(self::MESSAGE);
        }
    }

    /**
     * Check whether a NIM string matches the strict UGM NIM format.
     */
    public static function isValid(?string $nim): bool
    {
        if ($nim === null || trim($nim) === '') {
            return false;
        }

        return (bool) preg_match(self::PATTERN, trim($nim));
    }
}
