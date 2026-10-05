package com.ads.conciliamei.dto.company;

public record CompanyResponseDTO(
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
        String telefone
) {}