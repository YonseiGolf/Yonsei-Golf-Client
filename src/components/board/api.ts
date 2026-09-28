import { api, queryString } from '@/lib/api'
import type { Board, BoardDetail, BoardRequest, BoardTemplate, Category, Page } from '@/types/api'

export const categories = { NOTICE: '공지', FREE: '자유게시판' } satisfies Record<Category, string>
export const getBoards = (page: number, category: Category | '', signal?: AbortSignal) =>
	api<Page<Board>>(`/boards${queryString({ page, size: 10, category })}`, { auth: false, signal })
export const getBoard = (id: string, signal?: AbortSignal) =>
	api<BoardDetail>(`/boards/${encodeURIComponent(id)}`, { auth: false, signal })
export const createBoard = (body: BoardRequest) => api('/boards', { method: 'POST', body })
export const updateBoard = (id: number, body: BoardRequest) =>
	api(`/boards/${id}`, { method: 'PATCH', body })
export const deleteBoard = (id: number) => api(`/boards/${id}`, { method: 'DELETE' })
export const postReply = (id: number, content: string) =>
	api(`/boards/${id}/replies`, { method: 'POST', body: { content } })
export const deleteReply = (id: number) => api(`/replies/${id}`, { method: 'DELETE' })
export const getTemplates = (signal?: AbortSignal) =>
	api<{ templates: Pick<BoardTemplate, 'id' | 'title'>[] }>('/admin/boards/templates', { signal })
export const getTemplate = (id: string, signal?: AbortSignal) =>
	api<BoardTemplate>(`/admin/boards/templates/${encodeURIComponent(id)}`, { signal })
export const saveTemplate = (body: Omit<BoardTemplate, 'id'>, id?: number) =>
	api(`/admin/boards/templates${id ? `/${id}` : ''}`, { method: id ? 'PATCH' : 'POST', body })
export const deleteTemplate = (id: number) =>
	api(`/admin/boards/templates/${id}`, { method: 'DELETE' })
