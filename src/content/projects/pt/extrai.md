---
title: "ExtrAI · Automação e Extração Documental com IA Multimodal"
description: "Automação inteligente e privativa para extração multimodal de documentos brasileiros (RG, CNH, CIN) com IA e preenchimento assistido em portais de Certificação Digital via extensão Chrome MV3."
lang: "pt"
role: "Criador & Engenheiro de Software"
order: 1
featured: true
techs: ["Python", "FastAPI", "Pydantic v2", "PydanticAI", "Chrome Extension (MV3)", "Playwright", "Docker"]
metrics: [
  "95,4% de redução no tempo de atendimento (~5m30s para ~15s por emissão)",
  "Suíte com 219 testes automatizados (unitários e E2E headless com Playwright)",
  "Arquitetura Privacy-by-Design: zero persistência de PII em disco e conformidade estrita com LGPD"
]
githubUrl: "https://github.com/Mateusallz1/ExtrAI"
---

### Situação (Situation)
Durante os atendimentos de emissão de Certificados Digitais ICP-Brasil (Soluti, Certisign, Valid, etc.), agentes de registro precisavam transcrever manualmente mais de 10 campos a partir de documentos de identificação (RG, CNH e a nova CIN). O processo demandava cerca de 5 minutos e meio por cliente, era suscetível a erros de digitação (que levam a glosas do ITI) e envolvia campos com bloqueadores de colagem (`Ctrl + V`) e seletores dinâmicos assíncronos.

### Tarefa (Task)
Idealizar e desenvolver uma solução completa, segura e auditável que automatizasse o ciclo de ponta a ponta: extrair dados estruturados a partir de imagens e PDFs digitalizados, validar os dados algoritmicamente antes de qualquer uso, e preencher o portal legado diretamente pelo navegador sem violar normas da LGPD.

### Ação (Action)
- **Backend de Alta Performance:** Desenvolvi uma API assíncrona com **FastAPI** e **Pydantic v2**, garantindo validação estrita de contratos e tempos de resposta instantâneos.
- **Orquestração Multimodal com PydanticAI:** Integrei modelos de visão multimodal para ler documentos escaneados com orçamentos rigorosos de latência, complementados por validação determinística de regras de negócio (cálculo de dígito verificador do CPF por Módulo 11 da Receita Federal e checagem cronológica estrita *Nascimento < Emissão < Validade*).
- **Extensão Chrome Manifest V3:** Implementei uma extensão que injeta eventos sintéticos nativos no DOM para contornar bloqueadores de colagem, sincroniza requisições com dropdowns AJAX de municípios e executa preenchimentos via atalho global (`Alt + P`).
- **Engenharia de Privacidade (Privacy by Design):** Adotei política de *Zero PII em disco* — os arquivos e dados são processados efemeramente em memória com descarte automático via TTL (30 minutos) e nenhum dado pessoal é mantido em logs.
- **Garantia de Qualidade:** Construí uma suíte de **219 testes automatizados** com **Playwright** e Pytest, validando tanto as rotas da API quanto a interação com o DOM sem gerar custos com chamadas de IA.

### Resultado (Result)
- Redução de **95,4% no tempo total por atendimento**, caindo de ~5m30s para apenas ~15 segundos.
- Mais de 44 horas de trabalho manual e repetitivo eliminadas por ano para cada operador.
- Eliminação de retrabalho e glosas cadastrais por inconsistência de dados.
