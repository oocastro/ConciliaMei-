package com.ads.conciliamei.controller;

import com.ads.conciliamei.dto.empresa.EmpresaConsultaResponseDTO;
import com.ads.conciliamei.service.CnpjService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


// PROVISORIO

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final CnpjService cnpjService;

    public EmpresaController(CnpjService cnpjService) {
        this.cnpjService = cnpjService;
    }

    @GetMapping("/consulta-cnpj/{cnpj}")
    public EmpresaConsultaResponseDTO consultarCnpj(@PathVariable String cnpj) {
        return cnpjService.consultar(cnpj);
    }
}