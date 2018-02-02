import AWS from 'aws-sdk';

const s3 = new AWS.S3();

const bucket = undefined;//process.env.aws.S3_BUCKET;
const AWSSecretAccessKey = undefined;//process.env.aws.AWS_SECRET_ACCESS_KEY;

s3.createBucket({Bucket: bucket}, function(err, data) {
    if (err) {  
       console.error(err);  
    }    
});
function uploadFile(file) {

    const params = {Bucket: bucket, Key: AWSSecretAccessKey, Body: file};
    s3.putObject(params, function(err, data) {
        return { err, data };
    });

}
export { uploadFile };