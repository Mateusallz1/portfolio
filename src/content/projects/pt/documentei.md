---
title: "Documentei · Monitoramento de Licenciamento & Processos Regulatórios"
description: "Plataforma web em Django 6 e Python 3.13 com arquitetura conteinerizada em Docker para monitoramento automatizado de alvarás e licenciamento municipal (SLIC), com executor em background e auditoria imutável."
lang: "pt"
role: "Arquiteto de Software & Engenheiro Backend"
order: 2
featured: true
techs: ["Python", "Django 6", "Docker", "uv", "Caddy", "SQLite", "Pytest", "Tailwind CSS"]
metrics: [
  "Suíte com mais de 1.100 testes automatizados (unitários, integração e segurança)",
  "Automação contínua da checagem de alvarás, graus de risco e anexos da carteira",
  "Trilha de auditoria imutável (Audit Trail) com registro transacional de requisições e downloads"
]
githubUrl: "https://github.com/Mateusallz1/Documentei"
---

### Situação (Situation)
Escritórios contábeis e empresas lidam com centenas de solicitações de licenciamento municipal (SLIC), renovações de alvarás e conformidade de graus de risco por CNAE. Anteriormente, esse monitoramento era executado de maneira fragmentada por meio de planilhas manuais e consultas repetitivas ao portal municipal, sujeitando a carteira a vencimentos despercebidos, multas e perda de prazos.

### Tarefa (Task)
Conceber e implementar uma plataforma centralizada e resiliente para gerenciar a carteira corporativa, automatizar a extração e sincronização de dados do portal municipal em segundo plano, manter um histórico auditável de cada ação e disponibilizar um painel seguro para a equipe interna.

### Ação (Action)
- **Engenharia de Backend com Django 6 & Python 3.13:** Modelei domínios ricos (`licensing`, `companies`, `audit`, `processes`) com regras de negócio expressas e tipagem defensiva, orquestrados pelo gerenciador `uv`.
- **Arquitetura Conteinerizada (Docker) com Executor Assíncrono:** Desenvolvi uma imagem Docker única servindo tanto a aplicação web quanto o worker de coleta em segundo plano, utilizando travas no SQLite e limites compartilhados para evitar requisições simultâneas ou sobrecarga no portal de origem.
- **Trilha de Auditoria Imutável (Audit Trail):** Implementei um mecanismo de auditoria transacional que registra de forma auditável requisições de documentos, alterações de status, coletas executadas e downloads de alvarás, impedindo edições ou exclusões não autorizadas.
- **Segurança Defensiva e Hardening:** Aplicação de políticas de *fail-closed*, proteção contra força bruta no login, mitigação de vulnerabilidades XML em respostas parciais de scraping e pipelines de CI com Gitleaks e Bandit.
- **Infraestrutura em Produção:** Implantei o sistema em VPS com proxy reverso Caddy, emissão automática de HTTPS/TLS, persistência em volumes Docker e rotina validada de backup e restauração.
- **Garantia de Qualidade:** Desenvolvi uma suíte com **mais de 1.100 testes automatizados** utilizando Pytest e fixtures com dados sintéticos e mocks HTTP, assegurando zero regressão e cobertura extensiva.

### Resultado (Result)
- Substituição total do controle disperso em planilhas por um painel unificado com visualização imediata da situação e pendências de cada empresa.
- Redução de horas semanais gastas em consultas repetitivas ao portal municipal, mitigando o risco de multas por alvarás expirados.
- Trilha transparente para compliance e governança sobre quem acessou ou baixou qualquer certidão ou alvará da carteira.
