import AWS from 'aws-sdk';

const s3 = new AWS.S3();

const bucket = process.env.aws.S3_BUCKET;
const AWSAccessKeyId = process.env.aws.AWS_ACCESS_KEY_ID;
const AWSSecretAccessKey = process.env.aws.AWS_SECRET_ACCESS_KEY;
const region = process.env.aws.AWS_REGION;

s3.createBucket({Bucket: bucket}, function(err, data) {
    if (err) {  
       console.error(err);  
    }    
});
function uploadFile(file) {

    params = {Bucket: bucket, Key: AWSSecretAccessKey, Body: file};
    s3.putObject(params, function(err, data) {
        return { err, data };
    });

}
export { uploadFile };