<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Drafts or improves guide content with Claude. This never touches the
 * database — it returns a draft the admin reviews and edits in the form
 * before actually saving anything, same as if they'd typed it themselves.
 */
class GuideAiAssistant
{
    private const string MODEL = 'claude-haiku-4-5-20251001';

    private const string DRAFT_TOOL = 'draft_guide';

    /**
     * @return array<string, mixed>
     */
    public function generate(string $topic, ?string $categoryName = null): array
    {
        $context = $categoryName ? " Pertenece a la categoría \"{$categoryName}\"." : '';

        return $this->callClaude(
            "Redacta una guía de trámite ciudadano para Cajamarca, Perú, sobre: \"{$topic}\".{$context} ".
            'Sé concreto y realista sobre requisitos y costos típicos en Perú; si no estás seguro de un dato '.
            'exacto (costo, dirección exacta), dilo en términos generales ("verificar tarifa vigente") en vez de inventar cifras.'
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function improve(string $title, string $summary, string $content): array
    {
        return $this->callClaude(
            'Mejora la claridad y redacción de esta guía de trámite existente, sin inventar datos nuevos '.
            'que no estén ya insinuados en el texto. Devuelve solo title, summary y content mejorados — '.
            "no incluyas requirements ni steps, esta guía ya los tiene definidos y no los estás viendo aquí:\n\n".
            "Título: {$title}\nResumen: {$summary}\nContenido: {$content}"
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function callClaude(string $instructions): array
    {
        $key = config('services.anthropic.key');

        if (! $key) {
            throw new RuntimeException('ANTHROPIC_API_KEY no está configurada.');
        }

        $response = Http::withHeaders([
            'x-api-key' => $key,
            'anthropic-version' => '2023-06-01',
        ])->timeout(30)->post('https://api.anthropic.com/v1/messages', [
            'model' => self::MODEL,
            'max_tokens' => 1500,
            'system' => 'Eres un redactor de contenido cívico para una guía ciudadana de Cajamarca, Perú. '.
                'Escribes en español claro, directo, sin jerga legal innecesaria.',
            'messages' => [
                ['role' => 'user', 'content' => $instructions],
            ],
            'tools' => [$this->draftToolSchema()],
            'tool_choice' => ['type' => 'tool', 'name' => self::DRAFT_TOOL],
        ]);

        if ($response->failed()) {
            throw new RuntimeException('Claude no respondió correctamente: '.$response->body());
        }

        $toolUse = collect($response->json('content'))
            ->firstWhere('type', 'tool_use');

        if (! $toolUse) {
            throw new RuntimeException('Claude no devolvió un borrador estructurado.');
        }

        return $toolUse['input'];
    }

    /**
     * @return array<string, mixed>
     */
    private function draftToolSchema(): array
    {
        return [
            'name' => self::DRAFT_TOOL,
            'description' => 'Entrega el borrador de una guía de trámite con todos sus campos.',
            'input_schema' => [
                'type' => 'object',
                'properties' => [
                    'title' => ['type' => 'string', 'description' => 'Título corto y claro del trámite'],
                    'summary' => ['type' => 'string', 'description' => 'Una línea que resuma el trámite'],
                    'content' => ['type' => 'string', 'description' => 'Explicación detallada, en párrafos'],
                    'cost' => ['type' => 'string', 'description' => 'Costo típico, o "Varía" si no es fijo'],
                    'where_to_go' => ['type' => 'string', 'description' => 'Entidad y lugar donde se hace'],
                    'requirements' => ['type' => 'array', 'items' => ['type' => 'string']],
                    'steps' => [
                        'type' => 'array',
                        'items' => [
                            'type' => 'object',
                            'properties' => [
                                'text' => ['type' => 'string'],
                            ],
                            'required' => ['text'],
                        ],
                    ],
                ],
                'required' => ['title', 'summary', 'content'],
            ],
        ];
    }
}
