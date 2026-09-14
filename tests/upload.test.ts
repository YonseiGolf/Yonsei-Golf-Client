import { MAX_IMAGE_SIZE, uploadPhoto } from '@/components/application/api'
import { afterEach, expect, it, vi } from 'vitest'
import { ok } from './fixtures'

afterEach(() => vi.unstubAllGlobals())
it('uploads bytes to the presigned URL with exactly the returned storage headers', async () => {
	const file = new File(['image'], 'photo.png', { type: 'image/png' })
	const headers = { 'Content-Type': 'image/png', 'x-amz-acl': 'public-read' }
	const fetcher = vi
		.fn()
		.mockResolvedValueOnce(
			ok({
				uploadUrl: 'https://storage.example/photo',
				imageKey: 'store-image/key.png',
				uploadHeaders: headers,
			}),
		)
		.mockResolvedValueOnce(new Response(null, { status: 200 }))
	vi.stubGlobal('fetch', fetcher)
	expect(await uploadPhoto(file)).toBe('store-image/key.png')
	expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({
		fileName: 'photo.png',
		contentType: 'image/png',
		fileSize: 5,
	})
	expect(fetcher.mock.calls[1]).toEqual([
		'https://storage.example/photo',
		{ method: 'PUT', headers, body: file, credentials: 'omit' },
	])
})
it('does not return a photo key when storage upload fails', async () => {
	vi.stubGlobal(
		'fetch',
		vi
			.fn()
			.mockResolvedValueOnce(ok({ uploadUrl: 'https://storage.example/photo', imageKey: 'key' }))
			.mockResolvedValueOnce(new Response(null, { status: 403 })),
	)
	await expect(
		uploadPhoto(new File(['image'], 'photo.png', { type: 'image/png' })),
	).rejects.toThrow('사진 업로드에 실패')
})
it('rejects unsupported, empty and oversized images before requesting an upload URL', async () => {
	const fetcher = vi.fn()
	vi.stubGlobal('fetch', fetcher)
	await expect(
		uploadPhoto(new File(['image'], 'photo.svg', { type: 'image/svg+xml' })),
	).rejects.toThrow('파일만')
	await expect(uploadPhoto(new File([], 'photo.png', { type: 'image/png' }))).rejects.toThrow(
		'10MB',
	)
	await expect(
		uploadPhoto(new File([new Uint8Array(MAX_IMAGE_SIZE + 1)], 'photo.png', { type: 'image/png' })),
	).rejects.toThrow('10MB')
	expect(fetcher).not.toHaveBeenCalled()
})
