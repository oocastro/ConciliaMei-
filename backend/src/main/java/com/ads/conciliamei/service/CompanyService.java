package com.ads.conciliamei.service;

import com.ads.conciliamei.domain.company.Company;
import com.ads.conciliamei.domain.user.User;
import com.ads.conciliamei.dto.company.CompanyRegisteredResponseDTO;
import com.ads.conciliamei.dto.company.CompanyResponseDTO;
import com.ads.conciliamei.exception.CnpjAlreadyExistsException;
import com.ads.conciliamei.exception.CompanyAlreadyExistsException;
import com.ads.conciliamei.exception.CompanyNotFoundException;
import com.ads.conciliamei.repositories.CompanyRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final CnpjService cnpjService;

    public CompanyService(CompanyRepository companyRepository, CnpjService cnpjService) {
        this.companyRepository = companyRepository;
        this.cnpjService = cnpjService;
    }

    public CompanyRegisteredResponseDTO register(String cnpj, User authenticatedUser) {
        String cleanedCnpj = cnpj.replaceAll("[^0-9]", "");

        if (companyRepository.existsByCnpj(cleanedCnpj)) {
            throw new CnpjAlreadyExistsException("Esse CNPJ já está cadastrado no sistema.");
        }

        if (companyRepository.findByUsuarioId(authenticatedUser.getId()).isPresent()) {
            throw new CompanyAlreadyExistsException("Você já possui uma empresa cadastrada.");
        }

        // Não confiamos em dados vindos do frontend: consultamos de novo, na fonte oficial.
        CompanyResponseDTO companyData = cnpjService.consultar(cleanedCnpj);

        Company company = new Company();
        company.setCnpj(companyData.cnpj());
        company.setRazaoSocial(companyData.razaoSocial());
        company.setNomeFantasia(companyData.nomeFantasia());
        company.setAtividadePrincipal(companyData.atividadePrincipal());
        company.setSituacaoCadastral(companyData.situacaoCadastral());
        company.setEndereco(companyData.endereco());
        company.setMunicipio(companyData.municipio());
        company.setUf(companyData.uf());
        company.setCep(companyData.cep());
        company.setEmail(companyData.email());
        company.setTelefone(companyData.telefone());
        company.setUsuario(authenticatedUser);
        company.setDataCadastro(LocalDateTime.now());

        Company savedCompany = companyRepository.save(company);
        return toRegisteredResponse(savedCompany);
    }

    public CompanyRegisteredResponseDTO findByUser(User user) {
        Company company = companyRepository.findByUsuarioId(user.getId())
                .orElseThrow(() -> new CompanyNotFoundException(
                        "Você ainda não cadastrou uma empresa."));
        return toRegisteredResponse(company);
    }

    private CompanyRegisteredResponseDTO toRegisteredResponse(Company company) {
        return new CompanyRegisteredResponseDTO(
                company.getId(), company.getCnpj(), company.getRazaoSocial(), company.getNomeFantasia(),
                company.getAtividadePrincipal(), company.getSituacaoCadastral(), company.getEndereco(),
                company.getMunicipio(), company.getUf(), company.getCep(), company.getEmail(), company.getTelefone(),
                company.getDataCadastro()
        );
    }
}