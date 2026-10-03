import { Button } from '@/components/ui/button'
import { NavLink, Outlet, useLocation } from 'react-router'
import './AdminPage.css'

const links = [
	['/admin/users', '회원 관리'],
	['/admin/form', '지원서 관리'],
	['/admin/apply-alarm', '지원 대기 명단'],
	['/admin/apply/form', '지원서 양식'],
	['/admin/mail-templates', '메일 양식'],
	['/admin/apply-period', '지원 기간 관리'],
	['/admin/board/template', '게시판 양식'],
]
export default function AdminPage() {
	const { pathname } = useLocation()
	return (
		<div className="scope-AdminPage">
			<h1>어드민 페이지</h1>
			<nav aria-label="관리자 메뉴">
				<ul className="tab-container">
					{links.map(([to, label]) => (
						<li key={to}>
							<Button
								asChild
								variant={
									pathname.startsWith(to) ||
									(to === '/admin/form' && pathname.startsWith('/application/'))
										? 'secondary'
										: 'ghost'
								}
							>
								<NavLink to={to}>{label}</NavLink>
							</Button>
						</li>
					))}
				</ul>
			</nav>
			<div className="router-container">
				<Outlet />
			</div>
		</div>
	)
}
