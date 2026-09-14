import { useNavigate } from 'react-router'
import BoardEditor from './BoardEditor'
import { createBoard } from './api'
import './PostBoard.css'

export default function PostBoard() {
	const navigate = useNavigate()
	return (
		<div className="scope-PostBoard">
			<div className="board-header-container">
				<h2>글쓰기</h2>
				<hr />
			</div>
			<BoardEditor
				templates
				onSave={async (value) => {
					await createBoard(value)
					navigate('/board')
				}}
			/>
		</div>
	)
}
