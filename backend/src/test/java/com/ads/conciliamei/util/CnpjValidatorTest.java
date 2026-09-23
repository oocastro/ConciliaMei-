package com.ads.conciliamei.util;

import org.junit.jupiter.api.Test;

import static org.testng.AssertJUnit.assertFalse;
import static org.testng.AssertJUnit.assertTrue;

class CnpjValidatorTest {

    @Test
    void deveValidarCnpjCorreto() {        //testei com o meu, funcionou kkk - novo teste em cnpj mexer aqui antes
        assertTrue(CnpjValidator.isValid("11.222.333/0001-81"));
    }

    @Test
    void deveRejeitarCnpjComDigitosErrados() {
        assertFalse(CnpjValidator.isValid("11.222.333/0001-99"));
    }

    @Test
    void deveRejeitarCnpjComSequenciaRepetida() {
        assertFalse(CnpjValidator.isValid("11111111111111"));
    }

    @Test
    void deveRejeitarCnpjComTamanhoErrado() {
        assertFalse(CnpjValidator.isValid("123"));
    }
}