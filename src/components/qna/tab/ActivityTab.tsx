import FaqList from '../FaqList'

const items = [
	{
		question: 'Q. 연세 골프 활동은 어떻게 진행되나요?',
		answer: 'A. 매주 목요일 오후 6시 신촌역 부근에서 진행합니다.',
	},
	{
		question: 'Q. 동아리 회비가 있나요?',
		answer:
			'A. 회비는 활동 학기당 20만원으로, 동아리 차원에서 제작하는 볼마커, 숙소비 지원 등으로 사용하고 있습니다.',
	},
	{
		question: 'Q. 본인 소유의 클럽이 있어야 하나요?',
		answer:
			'A. 매주 동아리 활동은 대여채를 사용하실 수 있습니다. 하지만 단체 라운딩의 경우 본인 클럽이 필요합니다.',
	},
]

export default function ActivityTab() {
	return <FaqList items={items} />
}
