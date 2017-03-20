import Tenants from '/imports/collections/tenants';


const Pages = new Meteor.Collection('pages');

Pages.schema = new SimpleSchema({
	title: {
		type: String,
	},
	subtitle: {
		type: String,
		optional: true,
	},
	headerImage: {
		type: [String],
		optional: true,
		autoform: {
			type: 'ufs',
			collection: 'images',
			store: 'ImageStore',
			publication: 'images',
			thumbnails: 'thumbnails',
		},
	},
	slug: {
		type: String,
		optional: true,
		autoform: {
			type: 'hidden',
			label: false,
		},
	},
	tenantId: {
	    type: String,
	    label: "Tenant",
	    optional: true,
	    autoform: {
	    	afFieldInput: {
	    		type: "select",
		      options: function () {
		      	var tenants = [];
		        _.map(Tenants.find().fetch(), function (tenant) {

		          tenants.push({
		            label: tenant.subdomain,
		            value: tenant._id
		          });

		        });
		        return tenants;
		      }
	    	}
	    }
	},
	content: {
		type: String,
		autoform: {
			afFieldInput: {
				type: 'summernote',
				class: 'editor', // optional
				settings: {
					height: 500,
					callbacks: {
						onImageUpload(files) {
							// upload image to server and create imgNode...
							// console.log(this, this.id);
							/*
							const editorId = this.id;
							const ONE_MB = 1024 * 100;
							_.each(files, (file) => {
								const uploader = new UploadFS.Uploader({
									adaptive: false,
									chunkSize: ONE_MB * 16.66,
									maxChunkSize: ONE_MB * 20,
									data: file,
									file,
									store: ImageStore,
									maxTries: 3,
								});
								uploader.onAbort = function onAbort(currentFile) {
									console.log(`${currentFile.name} upload aborted`);
								};
								uploader.onComplete = function onComplete(currentFile) {
									console.log(`${currentFile.name} upload completed`);
									const url = currentFile.url;
									// console.log(file.url, editorId, $(editorId));
									$(`#${editorId}`).summernote('insertImage', url, () => {
										console.log('image inserted');
									// $image.css('width', $image.width() / 3);
									// $image.css('margin', 15);
									// $image.attr('data-filename', 'retriever');
									});
									// return file._id;
								};
								uploader.onCreate = function onCreate(currentFile) {
									workers[currentFile._id] = this;
									console.log(`${currentFile.name} created`);
								};
								uploader.onError = function onError(err, currentFile) {
									console.error(`${currentFile.name} could not be uploaded`, err);
								};
								uploader.onProgress = function onProgress(currentFile, progress) {
									console.log(`${currentFile.name} :
											\n${(progress * 100).toFixed(2)}%
											\n${(this.getSpeed() / 1024).toFixed(2)}KB/s
											\nelapsed: ${(this.getElapsedTime() / 1000).toFixed(2)}s
											\nremaining: ${(this.getRemainingTime() / 1000).toFixed(2)}s`);
								};
								uploader.start();
							});
							// Meteor.call('uploadFiles', files, function(err, res){
							//     console.log(res);
							// });
							*/
						},
					},
				},
			},
		},
	},
});

Pages.attachSchema(Pages.schema);
Pages.friendlySlugs('title');
Pages.attachBehaviour('timestampable');

export default Pages;
