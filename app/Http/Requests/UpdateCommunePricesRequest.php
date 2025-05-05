<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCommunePricesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'prices' => ['required', 'array'],
            'prices.*.id' => ['required', 'integer', 'exists:communes,id'],
            'prices.*.delivery_price' => ['required', 'numeric'],
            'prices.*.return_price' => ['required', 'numeric'],
        ];
    }
}
