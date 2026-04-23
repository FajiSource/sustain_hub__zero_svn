<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProjectStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'initiative_id' => ['required', 'exists:initiatives,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'status' => ['required', 'in:planned,active,completed,paused'],
            'progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'deadline' => ['nullable', 'date'],
            'committee_name' => ['nullable', 'string', 'max:120'],
        ];
    }
}
