<?php

namespace App\Http\Requests;

use App\Enums\GuideStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGuideRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('admin') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'cost' => ['nullable', 'string', 'max:255'],
            'where_to_go' => ['nullable', 'string', 'max:255'],
            'requirements' => ['sometimes', 'array'],
            'requirements.*' => ['string', 'max:255'],
            'steps' => ['sometimes', 'array'],
            'steps.*.text' => ['required', 'string', 'max:500'],
            'steps.*.link' => ['nullable', 'url', 'max:255'],
            'steps.*.link_label' => ['nullable', 'string', 'max:100'],
            'steps.*.image' => ['nullable', 'url', 'max:255'],
            'source_url' => ['nullable', 'url', 'max:255'],
            'status' => ['required', Rule::enum(GuideStatus::class)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'category_id' => 'categoría',
            'title' => 'título',
            'summary' => 'resumen',
            'content' => 'contenido',
            'cost' => 'costo',
            'where_to_go' => 'dónde se hace',
            'requirements' => 'requisitos',
            'steps' => 'pasos',
            'source_url' => 'fuente',
            'status' => 'estado',
        ];
    }
}
