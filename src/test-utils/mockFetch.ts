import { vi } from 'vitest';

export const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));

export function mockResponseOnce(body: string, init?: ResponseInit) {
  fetchMock.mockResolvedValueOnce(new Response(body, init));
}

export function mockRejectOnce(error: unknown) {
  fetchMock.mockRejectedValueOnce(error);
}
