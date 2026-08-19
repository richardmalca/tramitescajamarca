<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:255'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'description' => 'descripción',
            'icon' => 'ícono',
            'order' => 'orden',
        ];
    }

    /**
     * @return array{name: string, description: ?string, icon: ?string, order: int}
     */
    public function categoryData(): array
    {
        return [
            'name' => (string) $this->validated('name'),
            'description' => $this->validated('description'),
            'icon' => $this->validated('icon'),
            'order' => (int) ($this->validated('order') ?? 0),
        ];
    }
}
