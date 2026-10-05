package com.ads.conciliamei.service;

import com.ads.conciliamei.dto.company.CompanyResponseDTO;
import com.ads.conciliamei.exception.InvalidCnpjException;
import com.ads.conciliamei.exception.IncompatibleCnpjStatusException;
import com.ads.conciliamei.integration.cnpj.CnpjApiResponse;
import com.ads.conciliamei.integration.cnpj.CnpjClient;
import com.ads.conciliamei.util.CnpjValidator;
import org.springframework.stereotype.Service;

@Service
public class CnpjService {

    private final CnpjClient cnpjClient;

    public CnpjService(CnpjClient cnpjClient) {
        this.cnpjClient = cnpjClient;
    }

    public CompanyResponseDTO consultar(String cnpj) {
        if (!CnpjValidator.isValid(cnpj)) {
            throw new InvalidCnpjException("CNPJ inválido. Verifique os números informados.");
        }

        String cnpjLimpo = cnpj.replaceAll("[^0-9]", "");
        CnpjApiResponse resposta = cnpjClient.consultar(cnpjLimpo);

        if (!"ATIVA".equalsIgnoreCase(resposta.situacaoCadastral())) {
            throw new IncompatibleCnpjStatusException(
                    "Não é possível concluir o cadastro: situação cadastral '"
                            + resposta.situacaoCadastral() + "'.");
        }

        return toConsultaResponse(resposta);
    }

    private CompanyResponseDTO toConsultaResponse(CnpjApiResponse r) {
        String endereco = r.logradouro() != null
                ? r.logradouro() + ", " + r.numero()
                : null;

        return new CompanyResponseDTO(
                r.cnpj(), r.razaoSocial(), r.nomeFantasia(), r.atividadePrincipal(),
                r.situacaoCadastral(), endereco, r.municipio(), r.uf(),
                r.cep(), r.email(), r.telefone()
        );
    }
}