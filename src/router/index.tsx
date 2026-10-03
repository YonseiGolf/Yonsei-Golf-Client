import AdminPage from '@/components/admin/AdminPage'
import AsyncState from '@/components/common/AsyncState'
import HomePage from '@/components/home/HomePage'
import { useAuthStore } from '@/store'
import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router'

const ApplyInfo = lazy(() => import('@/components/applyinfo/ApplyInfo'))
const ApplicationPage = lazy(() => import('@/components/application/ApplicationPage'))
const ApplicationForm = lazy(() => import('@/components/application/ApplicationForm'))
const LoginPage = lazy(() => import('@/components/user/LoginPage'))
const SignUpPage = lazy(() => import('@/components/user/SignUpPage'))
const CallBack = lazy(() => import('@/components/user/CallBack'))
const BoardHome = lazy(() => import('@/components/board/BoardHome'))
const PostBoard = lazy(() => import('@/components/board/PostBoard'))
const BoardDetail = lazy(() => import('@/components/board/BoardDetail'))
const UserManagement = lazy(() => import('@/components/user/admin/UserManagement'))
const FormManagement = lazy(() => import('@/components/application/admin/FormManagement'))
const ApplicationDetail = lazy(() => import('@/components/application/admin/ApplicationDetail'))
const ApplyAlarm = lazy(() => import('@/components/application/admin/ApplyAlarm'))
const MailTemplates = lazy(() => import('@/components/application/admin/MailTemplates'))
const BoardTemplateHome = lazy(
	() => import('@/components/board/admin/boardtemplate/BoardTemplateHome'),
)
const BoardTemplateDetail = lazy(
	() => import('@/components/board/admin/boardtemplate/BoardTemplateDetail'),
)
const PostTemplate = lazy(() => import('@/components/board/admin/boardtemplate/PostTemplate'))
const ApplyPeriodAdmin = lazy(() => import('@/components/applyinfo/admin/ApplyPeriodAdmin'))

export function RequireAuth({ admin = false }: { admin?: boolean }) {
	const { user, ready } = useAuthStore()
	if (!ready) return <AsyncState loading />
	if (!user)
		return <Navigate to="/login" replace state={{ message: '로그인이 필요한 서비스입니다.' }} />
	if (admin && !user.adminStatus)
		return (
			<div className="page-container" role="alert">
				<h1>권한이 없습니다</h1>
				<p>이 페이지에 접근하려면 관리자 권한이 필요합니다.</p>
			</div>
		)
	return <Outlet />
}

export default function AppRoutes() {
	const { pathname } = useLocation()
	// biome-ignore lint/correctness/useExhaustiveDependencies: Each pathname change resets the scroll position.
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])
	return (
		<Suspense fallback={<AsyncState loading />}>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/recruit" element={<ApplyInfo />} />
				<Route path="/apply" element={<ApplicationPage />} />
				<Route path="/apply/form" element={<ApplicationForm />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignUpPage />} />
				<Route path="/oauth/kakao" element={<CallBack />} />
				<Route path="/board" element={<BoardHome />} />
				<Route path="/board/:boardId" element={<BoardDetail />} />
				<Route element={<RequireAuth />}>
					<Route path="/board/post" element={<PostBoard />} />
				</Route>
				<Route element={<RequireAuth admin />}>
					<Route element={<AdminPage />}>
						<Route path="/admin" element={<Navigate to="/admin/users" replace />} />
						<Route path="/admin/users" element={<UserManagement />} />
						<Route path="/admin/form" element={<FormManagement />} />
						<Route path="/application/:id" element={<ApplicationDetail />} />
						<Route path="/admin/apply/form" element={<ApplicationForm preview />} />
						<Route path="/admin/apply-alarm" element={<ApplyAlarm />} />
						<Route path="/admin/mail-templates" element={<MailTemplates />} />
						<Route path="/admin/board/template" element={<BoardTemplateHome />} />
						<Route path="/admin/board/template/post" element={<PostTemplate />} />
						<Route path="/admin/board/template/:templateId" element={<BoardTemplateDetail />} />
						<Route path="/admin/apply-period" element={<ApplyPeriodAdmin />} />
					</Route>
				</Route>
				<Route
					path="*"
					element={
						<div className="page-container">
							<h1>페이지를 찾을 수 없습니다.</h1>
							<a href="/">홈으로</a>
						</div>
					}
				/>
			</Routes>
		</Suspense>
	)
}
