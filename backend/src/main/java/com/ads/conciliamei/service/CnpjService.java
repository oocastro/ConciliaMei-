package com.ads.conciliamei.service;

import com.ads.conciliamei.dto.empresa.EmpresaConsultaResponseDTO;
import com.ads.conciliamei.exception.CnpjInvalidoException;
import com.ads.conciliamei.exception.CnpjSituacaoIncompativelException;
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

    public EmpresaConsultaResponseDTO consultar(String cnpj) {
        if (!CnpjValidator.isValid(cnpj)) {
            throw new CnpjInvalidoException("CNPJ inválido. Verifique os números informados.");
        }

        String cnpjLimpo = cnpj.replaceAll("[^0-9]", "");
        CnpjApiResponse resposta = cnpjClient.consultar(cnpjLimpo);

        if (!"ATIVA".equalsIgnoreCase(resposta.situacaoCadastral())) {
            throw new CnpjSituacaoIncompativelException(
                    "Não é possível concluir o cadastro: situação cadastral '"
                            + resposta.situacaoCadastral() + "'.");
        }

        return toConsultaResponse(resposta);
    }

    private EmpresaConsultaResponseDTO toConsultaResponse(CnpjApiResponse r) {
        String endereco = r.logradouro() != null
                ? r.logradouro() + ", " + r.numero()
                : null;

        return new EmpresaConsultaResponseDTO(
                r.cnpj(), r.razaoSocial(), r.nomeFantasia(), r.atividadePrincipal(),
                r.situacaoCadastral(), endereco, r.municipio(), r.uf(),
                r.cep(), r.email(), r.telefone()
        );
    }
}