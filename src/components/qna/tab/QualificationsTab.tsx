import FaqList from '../FaqList'

const items = [
	{
		question: 'Q: 연세 골프의 지원 자격',
		answer: 'A: 골프에 관심있는 모든 연세인',
	},
	{
		question: 'Q. 재학생만 지원 가능한가요?',
		answer: 'A. 목요일 정기활동 일정 참여에 제한이 없다면 졸업생, 대학원생도 지원 가능합니다.',
	},
	{
		question: 'Q. 골프를 처음 하는 사람도 지원 가능한가요?',
		answer: 'A. 골프에 대한 열정이 있고, 레슨 계획만 있으시다면 지원 가능합니다.',
	},
	{
		question: 'Q. 추가적인 질문은 어디로 하나요?',
		answer: 'A. @yonsei__golf 인스타그램으로 DM 주시면 됩니다.',
	},
]

export default function QualificationsTab() {
	return <FaqList items={items} />
}
