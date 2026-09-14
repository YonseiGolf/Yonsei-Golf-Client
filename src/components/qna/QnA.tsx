import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import ActivityTab from './tab/ActivityTab'
import InterviewTab from './tab/InterviewTab'
import QualificationsTab from './tab/QualificationsTab'
import './QnA.css'

const tabs = [
	['qualifications', '지원자격', QualificationsTab],
	['interview', '면접', InterviewTab],
	['activity', '활동', ActivityTab],
] as const
export default function QnA() {
	const [active, setActive] = useState('qualifications')
	return (
		<section className="scope-QnA" aria-label="자주 묻는 질문">
			<h1>자주 묻는 질문</h1>
			<Tabs value={active} onValueChange={setActive}>
				<TabsList
					aria-label="질문 분류"
					className="mx-auto mt-2 mb-10 h-14 w-[95%] max-w-[540px] rounded-full border border-primary bg-background p-1"
				>
					{tabs.map(([id, label]) => (
						<TabsTrigger
							key={id}
							value={id}
							className="h-full rounded-full text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
						>
							{label}
						</TabsTrigger>
					))}
				</TabsList>
				{tabs.map(([id, , Component]) => (
					<TabsContent key={id} value={id} forceMount hidden={active !== id}>
						<Component />
					</TabsContent>
				))}
			</Tabs>
			<div className="white-container" />
		</section>
	)
}
