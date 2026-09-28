import { useState } from 'react'
import UserTable, { userClasses } from './UserTable'
import './UserManagement.css'

export default function UserManagement() {
	const [revision, setRevision] = useState(0)
	return (
		<div className="scope-UserManagement">
			<div className="users-tables">
				{userClasses.map(([userClass, title]) => (
					<UserTable
						key={userClass}
						userClass={userClass}
						title={title}
						revision={revision}
						onChange={() => setRevision((value) => value + 1)}
					/>
				))}
			</div>
		</div>
	)
}
