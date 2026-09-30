package com.ads.conciliamei.domain.company;

import com.ads.conciliamei.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "Company")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String cnpj;

    @Column(name = "razao_social", nullable = false)
    private String razaoSocial;

    @Column(name = "nome_fantasia")
    private String nomeFantasia;

    @Column(name = "atividade_principal")
    private String atividadePrincipal;

    @Column(name = "situacao_cadastral")
    private String situacaoCadastral;

    private String endereco;
    private String municipio;
    private String uf;
    private String cep;
    private String email;
    private String telefone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User usuario;

    @Column(name = "data_cadastro", nullable = false)
    private LocalDateTime dataCadastro;
}