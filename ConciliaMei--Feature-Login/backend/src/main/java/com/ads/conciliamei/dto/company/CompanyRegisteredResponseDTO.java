package com.ads.conciliamei.dto.company;

import java.time.LocalDateTime;

public record CompanyRegisteredResponseDTO(
        String id,
        String cnpj,
        String razaoSocial,
        String nomeFantasia,
        String atividadePrincipal,
        String situacaoCadastral,
        String endereco,
        String municipio,
        String uf,
        String cep,
        String email,
        String telefone,
        LocalDateTime dataCadastro
) {}