const LoadingLemma = ({ ready }) => {
	if (!ready) {
		return (
			<div className="lemma-loading">
				<div className="lemma-loading-top" />
				<div className="lemma-loading-bottom" />
			</div>
		);
	}
	return null;
};

export default LoadingLemma;
