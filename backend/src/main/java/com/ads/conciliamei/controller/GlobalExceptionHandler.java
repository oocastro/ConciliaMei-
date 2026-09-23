package com.ads.conciliamei.controller;

import com.ads.conciliamei.exception.CnpjConsultaIndisponivelException;
import com.ads.conciliamei.exception.CnpjInvalidoException;
import com.ads.conciliamei.exception.CnpjNaoEncontradoException;
import com.ads.conciliamei.exception.CnpjSituacaoIncompativelException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, String> erro = new HashMap<>();
        erro.put("erro", ex.getMessage());
        return ResponseEntity.badRequest().body(erro);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(erro ->
                erros.put(erro.getField(), erro.getDefaultMessage()));
        return ResponseEntity.badRequest().body(erros);
    }

    @ExceptionHandler(CnpjInvalidoException.class)
    public ResponseEntity<Map<String, String>> handleCnpjInvalido(CnpjInvalidoException ex) {
        return ResponseEntity.badRequest().body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(CnpjNaoEncontradoException.class)
    public ResponseEntity<Map<String, String>> handleCnpjNaoEncontrado(CnpjNaoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(CnpjSituacaoIncompativelException.class)
    public ResponseEntity<Map<String, String>> handleSituacaoIncompativel(CnpjSituacaoIncompativelException ex) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(Map.of("erro", ex.getMessage()));
    }

    @ExceptionHandler(CnpjConsultaIndisponivelException.class)
    public ResponseEntity<Map<String, String>> handleIndisponivel(CnpjConsultaIndisponivelException ex) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("erro", ex.getMessage()));
    }
}