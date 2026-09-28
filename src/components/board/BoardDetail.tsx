import AsyncState from '@/components/common/AsyncState'
import { confirmAction } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAction } from '@/hooks/useAction'
import { useQuery } from '@/hooks/useQuery'
import { formatDateTime } from '@/lib/format'
import { useAuthStore } from '@/store'
import type { BoardDetail as BoardData } from '@/types/api'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import BoardEditor from './BoardEditor'
import { categories, deleteBoard, deleteReply, getBoard, postReply, updateBoard } from './api'
import './BoardDetail.css'
import './PostBoard.css'

export default function BoardDetail() {
	const { boardId = '' } = useParams()
	const query = useQuery(`board:${boardId}`, (signal) => getBoard(boardId, signal))
	return (
		<>
			<AsyncState {...query} retry={query.reload} />
			{query.data && <BoardContent key={query.data.id} board={query.data} reload={query.reload} />}
		</>
	)
}

function BoardContent({ board, reload }: { board: BoardData; reload: () => void }) {
	const user = useAuthStore((state) => state.user)
	const [editing, setEditing] = useState(false)
	const [reply, setReply] = useState('')
	const action = useAction()
	const navigate = useNavigate()
	if (editing)
		return (
			<div className="scope-PostBoard">
				<h2>게시글 수정</h2>
				<BoardEditor
					initial={board}
					submitLabel="저장"
					onCancel={() => setEditing(false)}
					onSave={async ({ category, title, content }) => {
						await updateBoard(board.id, { category, title, content })
						setEditing(false)
						reload()
					}}
				/>
			</div>
		)
	return (
		<div className="scope-BoardDetail">
			<div className="board-container">
				<p className="detail-category">{categories[board.category]}</p>
				<h1 className="detail-title">{board.title}</h1>
				<div className="board-user">{board.writer}</div>
				<div className="post-header">
					<span className="board-time">{formatDateTime(board.createdAt)}</span>
					{board.writerId === user?.id && (
						<div className="post-actions">
							<Button
								type="button"
								variant="outline"
								className="edit-delete-post"
								onClick={() => setEditing(true)}
							>
								수정
							</Button>
							<Button
								type="button"
								variant="destructive"
								className="edit-delete-post"
								disabled={action.pending}
								onClick={() =>
									void action.run(async () => {
										if (await confirmAction('게시글을 삭제하시겠습니까?')) {
											await deleteBoard(board.id)
											navigate('/board')
										}
									})
								}
							>
								삭제
							</Button>
						</div>
					)}
				</div>
				<hr />
				<p className="detail-content preserve-lines">{board.content}</p>
				<hr />
			</div>
			<div className="reply-container">
				<h3 className="replies-title">댓글 {board.replies?.replies.length ?? 0}개</h3>
				<ul className="replies-list">
					{board.replies?.replies.map((item) => (
						<li className="reply" key={item.id}>
							<span className="reply-writer">{item.writer}</span>
							<span className="reply-content preserve-lines">{item.content}</span>
							<div className="reply-header">
								<span className="reply-date">{formatDateTime(item.createdAt)}</span>
								{item.writerId === user?.id && (
									<Button
										type="button"
										aria-label={`${item.writer} 댓글 삭제`}
										className="edit-delete-post"
										disabled={action.pending}
										onClick={() =>
											void action.run(async () => {
												if (await confirmAction('댓글을 삭제하시겠습니까?')) {
													await deleteReply(item.id)
													reload()
												}
											})
										}
									>
										삭제
									</Button>
								)}
							</div>
						</li>
					))}
				</ul>
			</div>
			<AsyncState error={action.error} />
			<div className="reply-form-container">
				{user ? (
					<form
						onSubmit={(event) => {
							event.preventDefault()
							if (reply.trim())
								void action.run(async () => {
									await postReply(board.id, reply.trim())
									setReply('')
									reload()
								})
						}}
					>
						<Textarea
							aria-label="댓글"
							value={reply}
							required
							maxLength={200}
							placeholder="댓글을 입력하세요..."
							onChange={(event) => setReply(event.target.value)}
						/>
						<Button type="submit" className="post-reply" disabled={!reply.trim() || action.pending}>
							댓글 등록
						</Button>
					</form>
				) : (
					<Link to="/login">로그인 후 댓글을 작성할 수 있습니다.</Link>
				)}
			</div>
			<Link to="/board">목록으로</Link>
		</div>
	)
}
