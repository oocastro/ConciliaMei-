package com.ads.conciliamei.integration.cnpj;

import com.ads.conciliamei.exception.CnpjConsultaIndisponivelException;
import com.ads.conciliamei.exception.CnpjNaoEncontradoException;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class CnpjClient {

    private static final String BRASIL_API_URL = "https://brasilapi.com.br/api/cnpj/v1/{cnpj}";

    private final RestTemplate restTemplate;

    public CnpjClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public CnpjApiResponse consultar(String cnpj) {
        try {
            return restTemplate.getForObject(BRASIL_API_URL, CnpjApiResponse.class, cnpj);
        } catch (HttpClientErrorException.NotFound e) {
            throw new CnpjNaoEncontradoException(
                    "Não encontramos uma empresa com esse CNPJ.");
        } catch (ResourceAccessException e) {
            throw new CnpjConsultaIndisponivelException(
                    "Não foi possível consultar o CNPJ no momento. Tente novamente.");
        } catch (RestClientException e) {
            throw new CnpjConsultaIndisponivelException(
                    "Erro ao consultar o CNPJ. Tente novamente em instantes.");
        }
    }
}