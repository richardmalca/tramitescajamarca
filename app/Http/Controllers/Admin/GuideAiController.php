<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Guide;
use App\Services\GuideAiAssistant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class GuideAiController extends Controller
{
    public function __construct(
        private readonly GuideAiAssistant $assistant,
    ) {}

    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'topic' => ['required', 'string', 'max:255'],
            'category_id' => ['nullable', 'exists:categories,id'],
        ]);

        $categoryName = isset($validated['category_id'])
            ? Category::find($validated['category_id'])?->name
            : null;

        return $this->respondWithDraft(fn () => $this->assistant->generate($validated['topic'], $categoryName));
    }

    public function improve(Request $request, Guide $guide): JsonResponse
    {
        return $this->respondWithDraft(fn () => $this->assistant->improve($guide->title, $guide->summary, $guide->content));
    }

    private function respondWithDraft(callable $draft): JsonResponse
    {
        try {
            return response()->json(['draft' => $draft()]);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
