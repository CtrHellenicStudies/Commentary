export default function AvatarIcon(props) {
	let url = '/images/default_user.jpg';

	if (props.avatar && props.avatar.url) {
		url = props.avatar.url;
	} else if (props.defaultUrl) {
		url = prop.defaultUrl;
	}

	return <img src={url} alt="icon" />;
}

AvatarIcon.propTypes = {
	defaultUrl: React.PropTypes.string,
	avatar: React.PropTypes.object,
};
