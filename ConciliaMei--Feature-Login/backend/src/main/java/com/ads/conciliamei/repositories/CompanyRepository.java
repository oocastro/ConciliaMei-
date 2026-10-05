package com.ads.conciliamei.repositories;

import com.ads.conciliamei.domain.company.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, String> {

    boolean existsByCnpj(String cnpj);

    Optional<Company> findByUsuarioId(String usuarioId);
}
