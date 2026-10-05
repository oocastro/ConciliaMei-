package com.ads.conciliamei.integration.cnpj;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CnpjApiResponse(
        String cnpj,
        @JsonProperty("razao_social") String razaoSocial,
        @JsonProperty("nome_fantasia") String nomeFantasia,
        @JsonProperty("descricao_situacao_cadastral") String situacaoCadastral,
        @JsonProperty("cnae_fiscal_descricao") String atividadePrincipal,
        String logradouro,
        String numero,
        String municipio,
        String uf,
        String cep,
        String email,
        @JsonProperty("ddd_telefone_1") String telefone
) {}