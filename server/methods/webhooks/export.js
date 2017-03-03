import simpleGit from 'simple-git';
import fs from 'fs';
import Comments from '/imports/collections/comments';
import Tenants from '/imports/collections/tenants';

Meteor.method('exportToGit', (exportParams) => {
	check(exportParams.subdomain, String);
	check(exportParams.token, String);

	const exportSettings = Meteor.settings.exportSettings;
	const exportDir = 'export';

	const tenant = Tenants.findOne({ subdomain: exportParams.subdomain });
	const settings = Settings.findOne({ tenantId: tenant._id });

	if (!settings || settings.webhooksToken !== exportParams.token) {
		throw new Meteor.Error('Webhook export not authorized');
	}

	const deleteFolderRecursive = (path) => {
		if (fs.existsSync(path)) {
			fs.readdirSync(path).forEach((file) => {
				const curPath = `${path}/${file}`;
				if (fs.lstatSync(curPath).isDirectory()) { // recurse
					deleteFolderRecursive(curPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	};

	simpleGit().clone(exportSettings.repo, exportDir, [], Meteor.bindEnvironment((err) => {
		if (err) {
			throw new Meteor.Error('git-export', `Error cloning repo ${err}`);
		}

		// When necessary, implement a skip/limit to partition the export files
		const comments = Comments.find().fetch();

		try {
			fs.writeFileSync(`${exportDir}/comments.json`, JSON.stringify(comments), 'utf8');
		} catch (fileErr) {
			throw new Meteor.Error('git-export', `Error writing file ${fileErr}`);
		}

		simpleGit()
			.add(`${exportDir}/comments.json`)
			.commit(`export ${new Date()}`)
			.push('origin', 'master');
	}));

	deleteFolderRecursive(exportDir);
}, {
	url: 'export',
	getArgsFromRequest(request) {
		const content = request.body;
		return [content];
	},
});
