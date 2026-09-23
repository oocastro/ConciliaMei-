package com.ads.conciliamei.dto.empresa;

public record EmpresaConsultaResponseDTO(
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