# Backlog de mejoras

Tareas pequeñas y acotadas para el agente diario. Cada una debe poder
implementarse, testearse y commitearse en una sola rama sin tocar `main`.

Formato: `- [ ] descripción` (pendiente) → `- [x] descripción` (hecho, con
fecha y rama entre paréntesis).

## Pendientes

- [ ] SEO básico: `<meta name="description">` dinámico por página pública
      (home, directorio, cada guía) usando `summary`/`title` de cada trámite.
- [ ] Open Graph tags (`og:title`, `og:description`, `og:type`) en las
      mismas páginas públicas.
- [ ] `sitemap.xml` generado dinámicamente con todas las guías publicadas
      (ruta pública, actualizado en cada visita o cacheado unas horas).
- [ ] Revisar `public/robots.txt` — permitir crawl de `/tramites/*`,
      bloquear `/admin/*`.
- [ ] Mejorar la búsqueda pública para que también busque en `content` y
      en el texto de `steps`, no solo en `title`/`summary`.
- [ ] Página 404 pública con el mismo estilo cálido del resto del sitio
      (actualmente usa la de Laravel por defecto).
- [ ] En `guides/index.tsx`, mostrar un contador de resultados ("12
      trámites encontrados") arriba de la lista.
- [ ] Agregar un campo `updated_at` visible en la vista de detalle de
      guía ("Actualizado hace 3 días") para que la gente sepa qué tan
      vigente es la info.

## Reglas para quien tome una tarea de aquí

1. Una tarea por rama, rama nueva desde `master` actualizado.
2. Corre `npm run lint:check`, `npm run types:check`, `./vendor/bin/pint --test`
   y `php artisan test` antes de comitear. Si algo falla, arréglalo o no
   comitees.
3. Nunca hagas push ni merge a `master`/`main` sin que un humano revise.
4. Marca la tarea como hecha en este archivo, en la misma rama.
5. Si la tarea resulta ser más grande de lo que parecía, divídela en
   sub-tareas nuevas en vez de intentar todo de una vez.
