import FaqList from '../FaqList'

const items = [
	{
		question: 'Q. 연세 골프 면접은 언제 진행하나요?',
		answer: 'A. 서류 마감 후, 합격자들에 한해 개별적으로 면접 일정을 안내드리고 있습니다.',
	},
	{
		question: 'Q. 면접 결과는 언제 알 수 있나요?',
		answer: 'A. 모든 면접이 끝난 후, 지원서에 작성해수신 이메일로 결과를 안내해 드립니다.',
	},
]

export default function InterviewTab() {
	return <FaqList items={items} />
}
