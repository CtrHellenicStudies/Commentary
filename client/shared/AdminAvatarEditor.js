import { Slingshot } from 'meteor/edgee:slingshot';

AutoForm.addInputType('adminAvatarEditor', {
	template: 'adminAvatarEditor',
	valueOut() {
		return this.val();
	},
});

// TODO: this should be passed in
const defaultAvatarUrl = '/images/default_user.jpg';

function getCommenterDoc() {
	const formId = AutoForm.getFormId();
	const formData = AutoForm.getCurrentDataForForm(formId);
	if (formData != null && formData.doc != null) {
		return formData.doc;
	}

	return null;
}

function getCommenterDocId() {
	const doc = getCommenterDoc();
	if (doc != null && doc._id) {
		return doc._id;
	}

	return null;
}

Template.adminAvatarEditor.onCreated(function onCreated() {
      const commenterId = FlowRouter.getParam("_id");
      if (commenterId) {
      	let commenter = Commenters.findOne({ _id: commenterId });
      	this.avatarUrl = commenter.avatar;
      } else {
		this.avatarUrl  = defaultAvatarUrl;
      }
});

Template.adminAvatarEditor.helpers({
	avatarUrl() {
		return Template.instance().avatarUrl;
	},
});

Template.adminAvatarEditor.events({
	'click button[name=selectFile]': () => {
		const commenterId = getCommenterDocId();
		$("#avatar").click();
	},
	'change #avatar': (event) => {
	    event.preventDefault();

          const commenterId = getCommenterDocId();

	    let context = {type: 'commenter', commenterId: commenterId};

	    let uploader = new Slingshot.Upload("uploads", context);

	    uploader.send(event.target.files[0], Meteor.bindEnvironment((error, downloadUrl) => {
	      if (error) {
	        // Log service detailed response
	        console.error('Error uploading', uploader.xhr.response);
	        console.log(error);
	      } else {
              Session.set("commenterAvatar", downloadUrl);

	        this.avatarUrl = downloadUrl;
	        $(".avatar-image").attr("src", downloadUrl);

	     	  console.log('Profile pic has been uploaded');

	      }
	    }));

	},
});
