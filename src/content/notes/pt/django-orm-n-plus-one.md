---
title: "Evitando o problema N+1 no Django ORM com prefetch_related"
pubDate: 2026-03-22
lang: "pt"
category: "Django"
tags: ["Django", "ORM", "Performance", "Python"]
---

Quando você acessa relacionamentos `ManyToMany` ou reversos de `ForeignKey` em um loop, o Django realiza uma nova consulta SQL para cada iteração (problema clássico N+1).

### Exemplo rápido de resolução

```python
# Ruim: 1 query para autores + N queries para livros
autores = Autor.objects.all()
for autor in autores:
    print([l.titulo for l in autor.livros.all()])

# Bom: Apenas 2 queries ao banco com prefetch_related
autores = Autor.objects.prefetch_related('livros').all()
for autor in autores:
    print([l.titulo for l in autor.livros.all()])
```

Use `select_related` para chaves estrangeiras diretas (SQL JOIN) e `prefetch_related` para relacionamentos múltiplos ou reversos.
