---
title: "Cheatsheet prático de comandos diários com uv"
pubDate: 2026-03-24
lang: "pt"
category: "uv"
tags: ["uv", "Python", "CLI", "Produtividade"]
---

Comandos mais utilizados no fluxo de trabalho com uv:

```bash
# Executar script sem ativar venv manualmente
uv run python manage.py runserver

# Rodar linter ou testes diretamente
uv run ruff check .
uv run pytest

# Adicionar dependência com lock automático
uv add django-cors-headers

# Adicionar dependência apenas para desenvolvimento
uv add --dev pytest-django factory-boy

# Sincronizar ambiente com o lockfile
uv sync
```
