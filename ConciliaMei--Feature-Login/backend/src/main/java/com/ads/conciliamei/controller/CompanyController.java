package com.ads.conciliamei.controller;

import com.ads.conciliamei.domain.user.User;
import com.ads.conciliamei.dto.company.CompanyQueryResponseDTO;
import com.ads.conciliamei.dto.company.CompanyRegisteredResponseDTO;
import com.ads.conciliamei.dto.company.CompanyResponseDTO;
import com.ads.conciliamei.service.CnpjService;
import com.ads.conciliamei.service.CompanyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/empresas")
public class CompanyController {

    private final CnpjService cnpjService;
    private final CompanyService companyService;

    public CompanyController(CnpjService cnpjService, CompanyService companyService) {
        this.cnpjService = cnpjService;
        this.companyService = companyService;
    }

    @GetMapping("/consulta-cnpj/{cnpj}")
    public CompanyResponseDTO consultarCnpj(@PathVariable String cnpj) {
        return cnpjService.consultar(cnpj);
    }

    @PostMapping
    public ResponseEntity<CompanyRegisteredResponseDTO> cadastrar(
            @RequestBody CompanyQueryResponseDTO request,
            @AuthenticationPrincipal User user) {
        CompanyRegisteredResponseDTO response = companyService.register(request.cnpj(), user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/minha-empresa")
    public CompanyRegisteredResponseDTO minhaEmpresa(@AuthenticationPrincipal User user) {
        return companyService.findByUser(user);
    }
}