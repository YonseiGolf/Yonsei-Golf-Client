import './ClubIntroduction.css'

export default function ClubIntroduction() {
	return (
		<div className="scope-ClubIntroduction">
			<div className="white-container" />
			<div className="info-container">
				<h2>연골 동아리 소개</h2>

				<div className="statistic-cards">
					<div className="card">
						<div className="info-title">
							<br />
							창립 년도
							<br />
							<br />
							<br />
						</div>
						<div className="data">
							2019<span id="for-media">년</span>
							<br />
							<br />
						</div>
					</div>
					<div className="card">
						<span>
							<br />
							누적 회원 <br />
							<br />
							<br />
						</span>
						<span className="data">
							130+ <span id="for-media">명</span>
							<br />
							<br />
						</span>
					</div>
					<div className="card">
						<span>
							<br />
							활동 회원 <br />
							<br />
							<br />
						</span>
						<span className="data">
							70+ <span id="for-media">명</span>
							<br />
							<br />
						</span>
					</div>
				</div>
			</div>
			<div className="white-container" />
		</div>
	)
}
