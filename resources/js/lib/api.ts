/**
 * Minimal JSON POST helper for the few admin endpoints that return plain
 * JSON instead of an Inertia response (Inertia's router only speaks its
 * own protocol, so those can't use `router.post`). Laravel's CSRF guard
 * accepts the XSRF-TOKEN cookie echoed back as a header — no extra setup
 * needed since that cookie is already set for every session.
 */
function xsrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);

    return match ? decodeURIComponent(match[1]) : '';
}

export async function postJson<T>(url: string, body?: unknown): Promise<T> {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': xsrfToken(),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? 'Algo salió mal.');
    }

    return data as T;
}
