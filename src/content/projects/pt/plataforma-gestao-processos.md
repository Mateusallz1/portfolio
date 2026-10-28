---
title: "Plataforma de Gestão e Automação de Processos Corporativos"
description: "Sistema web sob medida para centralização de fluxos de trabalho, faturamento e integração contínua de dados entre departamentos."
lang: "pt"
role: "Lead Backend & Fullstack Engineer"
order: 1
featured: true
techs: ["Python", "Django", "uv", "TypeScript", "PostgreSQL", "Docker"]
metrics: [
  "Redução de 70% no tempo de conciliação financeira manual",
  "Tempo médio de resposta de API inferior a 60ms",
  "Zero downtime durante migrações de schema com PostgreSQL"
]
githubUrl: "https://github.com/Mateusallz1"
liveUrl: "https://github.com/Mateusallz1"
---

### Situação (Situation)
Uma organização enfrentava inconsistência no fluxo de aprovação de contratos e notas fiscais devido a planilhas fragmentadas e lentidão na geração de relatórios gerenciais.

### Tarefa (Task)
Construir uma plataforma web centralizada, com permissões granulares por perfil, geração automatizada de relatórios em segundo plano e interface intuitiva e responsiva.

### Ação (Action)
- Desenvolvi a arquitetura backend com **Django** e **PostgreSQL**, estruturando modelos relacionais otimizados com índices compostos.
- Adotei **uv** para gerenciar dependências e criar pipelines de CI ultrarrápidos no GitHub Actions.
- Implementei o frontend com **TypeScript** e **Tailwind CSS**, garantindo validação de formulários dinâmica e consistente.
- Configurei filas assíncronas com **Celery** e **Redis** para envio de notificações por email e processamento pesado sem bloquear requisições HTTP.

### Resultado (Result)
- Eliminação de retrabalho manual em mais de 70% do tempo dos analistas.
- Escalabilidade estável com centenas de operações diárias sem degradação de performance.
