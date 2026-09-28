import { Button } from '@/components/ui/button'
export default function AsyncState({
	loading,
	error,
	retry,
}: { loading?: boolean; error?: string; retry?: () => void }) {
	if (loading) return <output className="status-message">불러오는 중입니다…</output>
	if (error)
		return (
			<div className="status-message" role="alert">
				<p>{error}</p>
				{retry && (
					<Button type="button" onClick={retry}>
						다시 시도
					</Button>
				)}
			</div>
		)
	return null
}
