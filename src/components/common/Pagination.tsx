import { Button } from '@/components/ui/button'
import {
	PaginationContent,
	PaginationItem,
	Pagination as PaginationRoot,
} from '@/components/ui/pagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({
	page,
	totalPages,
	onChange,
}: { page: number; totalPages: number; onChange: (page: number) => void }) {
	return (
		<PaginationRoot className="my-6" aria-label="페이지 이동">
			<PaginationContent className="gap-3">
				<PaginationItem>
					<Button variant="outline" disabled={page <= 0} onClick={() => onChange(page - 1)}>
						<ChevronLeft aria-hidden="true" />
						이전
					</Button>
				</PaginationItem>
				<PaginationItem>
					<span className="px-1 text-sm" aria-live="polite">
						{totalPages === 0 ? 0 : page + 1} / {totalPages}
					</span>
				</PaginationItem>
				<PaginationItem>
					<Button
						variant="outline"
						disabled={page + 1 >= totalPages}
						onClick={() => onChange(page + 1)}
					>
						다음
						<ChevronRight aria-hidden="true" />
					</Button>
				</PaginationItem>
			</PaginationContent>
		</PaginationRoot>
	)
}
