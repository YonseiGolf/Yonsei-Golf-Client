import AsyncState from '@/components/common/AsyncState'
import CommonFooter from '@/components/common/CommonFooter'
import CommonHeader from '@/components/common/CommonHeader'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { initializeAuth } from '@/components/user/api'
import AppRoutes from '@/router'
import { useAuthStore } from '@/store'
import { Component, type ReactNode, useEffect } from 'react'
import { BrowserRouter } from 'react-router'

class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
	state = { failed: false }
	static getDerivedStateFromError() {
		return { failed: true }
	}
	render() {
		return this.state.failed ? (
			<div className="page-container" role="alert">
				<h1>화면을 불러오지 못했습니다.</h1>
				<Button onClick={() => window.location.reload()}>새로고침</Button>
			</div>
		) : (
			this.props.children
		)
	}
}

export default function App() {
	const ready = useAuthStore((state) => state.ready)
	useEffect(() => {
		void initializeAuth()
	}, [])
	return (
		<ErrorBoundary>
			<BrowserRouter>
				<div id="app">
					<header>
						<CommonHeader />
					</header>
					<main>{ready ? <AppRoutes /> : <AsyncState loading />}</main>
					<footer>
						<CommonFooter />
					</footer>
					<ConfirmDialog />
				</div>
			</BrowserRouter>
		</ErrorBoundary>
	)
}
