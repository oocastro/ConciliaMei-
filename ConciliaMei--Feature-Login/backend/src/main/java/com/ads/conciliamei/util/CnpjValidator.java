package com.ads.conciliamei.util;

import java.util.Arrays;

public class CnpjValidator {

    public static boolean isValid(String cnpj) {
        if (cnpj == null) return false;

        String digits = cnpj.replaceAll("[^0-9]", "");

        if (digits.length() != 14) return false;

        // Rejeita numeros repetidos (ex: 00000000000000, 11111111111111)
        if (digits.chars().distinct().count() == 1) return false;

        return hasValidCheckDigits(digits);
    }

    private static boolean hasValidCheckDigits(String cnpj) {
        // Converte cada caractere para o dígito numérico real (c - '0'),
        // e não para o código ASCII fixo de '0'.
        int[] numbers = cnpj.chars().map(c -> c - '0').toArray();

        int firstDigit = calculateCheckDigit(Arrays.copyOfRange(numbers, 0, 12));
        if (firstDigit != numbers[12]) return false;

        int secondDigit = calculateCheckDigit(Arrays.copyOfRange(numbers, 0, 13));
        return secondDigit == numbers[13];
    }

    private static int calculateCheckDigit(int[] numbers) {
        int[] weights = numbers.length == 12
                ? new int[]{5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}
                : new int[]{6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

        int sum = 0;
        for (int i = 0; i < numbers.length; i++) {
            sum += numbers[i] * weights[i];
        }

        int remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    }
}