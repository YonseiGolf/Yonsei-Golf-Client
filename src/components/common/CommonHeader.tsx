import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { logout } from '@/components/user/api'
import { useAction } from '@/hooks/useAction'
import { useAuthStore } from '@/store'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import AsyncState from './AsyncState'
import './CommonHeader.css'

const logo = 'https://minio.up-api.kr/yg-img-storage/store-image/yg-mark.pngPhLjHNx7Kt'
export default function CommonHeader() {
	const user = useAuthStore((state) => state.user)
	const [open, setOpen] = useState(false)
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const action = useAction()
	// biome-ignore lint/correctness/useExhaustiveDependencies: Back/forward navigation also closes the menu.
	useEffect(() => {
		setOpen(false)
	}, [pathname])
	useEffect(() => {
		const desktop = window.matchMedia('(min-width: 1025px)')
		const onResize = () => {
			if (desktop.matches) setOpen(false)
		}
		desktop.addEventListener('change', onResize)
		return () => desktop.removeEventListener('change', onResize)
	}, [])
	const links = [
		['/', 'Home'],
		...(user?.adminStatus ? [['/admin', '어드민']] : []),
		['/recruit', '모집안내'],
		['/apply', '지원하기'],
	]
	function navigation(mobile = false) {
		return (
			<>
				{links.map(([to, label]) => (
					<li key={to}>
						<NavLink to={to} end={to === '/'} onClick={() => setOpen(false)}>
							{label}
						</NavLink>
					</li>
				))}
				<li>
					{user ? (
						<Button
							variant="ghost"
							className={
								mobile
									? 'w-full justify-center text-lg font-bold text-primary'
									: 'h-auto min-h-0 p-0 font-bold text-white hover:bg-transparent hover:text-white/80'
							}
							disabled={action.pending}
							onClick={() =>
								void action.run(async () => {
									await logout()
									setOpen(false)
									navigate('/')
								})
							}
						>
							로그아웃
						</Button>
					) : (
						<NavLink to="/login" onClick={() => setOpen(false)}>
							로그인
						</NavLink>
					)}
				</li>
			</>
		)
	}
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<div className="scope-CommonHeader">
				<div className="header-container">
					<Link to="/" aria-label="연세골프 홈" className="logo">
						<img src={logo} alt="연세골프" width={60} height={60} />
					</Link>
					<nav aria-label="주 메뉴">
						<ul className="header-nav">{navigation()}</ul>
					</nav>
					<div className="mobile_btn">
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-12 text-white hover:bg-white/10 hover:text-white"
								aria-label="메뉴 열기"
							>
								<Menu className="size-10" aria-hidden="true" />
							</Button>
						</SheetTrigger>
					</div>
				</div>
				<AsyncState error={open ? undefined : action.error} />
			</div>
			<SheetContent
				side="left"
				id="mobile-menu"
				showCloseButton={false}
				className="w-full sm:max-w-none"
			>
				<SheetHeader className="items-center border-b border-border px-6 py-6">
					<Link to="/" aria-label="연세골프 홈" onClick={() => setOpen(false)}>
						<img src={logo} alt="" width={80} height={80} />
					</Link>
					<SheetTitle className="sr-only">연세골프 메뉴</SheetTitle>
					<SheetDescription className="sr-only">이동할 페이지를 선택해주세요.</SheetDescription>
				</SheetHeader>
				<SheetClose asChild>
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-4 top-4"
						aria-label="메뉴 닫기"
					>
						<X aria-hidden="true" />
					</Button>
				</SheetClose>
				<nav aria-label="모바일 메뉴" className="mobile-navigation">
					<ul>{navigation(true)}</ul>
				</nav>
				<AsyncState error={action.error} />
			</SheetContent>
		</Sheet>
	)
}
