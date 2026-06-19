# SEO Scanner — Análisis GEO/SEO para motores de búsqueda con IA

> Optimiza sitios web para motores de búsqueda con IA (ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews) manteniendo fundamentos SEO tradicionales.

---

## Comandos Rápidos

| Comando | Qué Hace |
|---------|----------|
| `geo audit <url>` | Auditoría GEO + SEO completa |
| `geo quick <url>` | Snapshot de visibilidad GEO (60s) |
| `geo citability <url>` | Puntaje de citabilidad para IA |
| `geo crawlers <url>` | Verifica acceso de crawlers IA (robots.txt) |
| `geo llmstxt <url>` | Analiza o genera llms.txt |
| `geo brands <name> <domain>` | Escanea menciones de marca en plataformas IA |
| `geo platforms <url>` | Optimización por plataforma (ChatGPT, Perplexity, Google AIO) |
| `geo schema <url>` | Analiza y genera datos estructurados |
| `geo technical <url>` | Auditoría técnica SEO |
| `geo content <url>` | Evaluación de calidad de contenido y E-E-A-T |

---

## Contexto de Mercado (2026)

- **Mercado GEO**: $850M+ (proyectado $7.3B para 2031)
- **Tráfico referido por IA**: +527% interanual
- **Conversión de tráfico IA vs orgánico**: 4.4x mayor
- **Gartner**: -50% tráfico de búsqueda para 2028
- **Menciones de marca vs backlinks para IA**: 3x correlación más fuerte

---

## Flujo de Auditoría Completa

### Fase 1: Descubrimiento
1. Obtener HTML del homepage
2. Detectar tipo de negocio (SaaS, Local, E-commerce, Publisher, Agencia, Otro)
3. Extraer páginas clave del sitemap.xml o enlaces internos

### Fase 2: Análisis en Paralelo
Ejecutar análisis en simultáneo para:
- **Visibilidad IA**: citabilidad, crawlers, llms.txt, marcas
- **Plataformas**: optimización para ChatGPT, Perplexity, Google AIO
- **SEO Técnico**: Core Web Vitals, SSR, seguridad, móvil
- **Contenido**: E-E-A-T, legibilidad, frescura
- **Schema**: detección, validación y generación de JSON-LD

### Fase 3: Síntesis
1. Recolectar todos los reportes
2. Calcular puntaje GEO compuesto (0-100)
3. Generar plan de acción priorizado

---

## Metodología de Puntuación

| Categoría | Peso |
|-----------|------|
| Citabilidad y Visibilidad IA | 25% |
| Autoridad de Marca | 20% |
| Calidad de Contenido y E-E-A-T | 20% |
| Fundamentos Técnicos | 15% |
| Datos Estructurados | 10% |
| Optimización por Plataforma | 10% |

---

## Herramientas Python

El skill incluye scripts Python para análisis automatizado:

- `scripts/fetch_page.py` — Obtiene y parsea páginas web (HTML, meta tags, headers, structured data, robots.txt, sitemaps)
- `scripts/citability_scorer.py` — Puntúa bloques de contenido para citabilidad IA
- `scripts/brand_scanner.py` — Escanea menciones de marca en YouTube, Reddit, Wikipedia, LinkedIn
- `scripts/llmstxt_generator.py` — Valida y genera archivos llms.txt

### Instalación de dependencias

```bash
pip install -r .opencode/skills/seo-scanner/requirements.txt
```
