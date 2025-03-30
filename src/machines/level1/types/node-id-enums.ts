import _ from 'lodash';

export const UserNodeID = {
  TutorialUser: _.uniqueId('user-'),
  FirstUser: _.uniqueId('user-'),
};

export const ResourceNodeID = {
  PublicImagesS3Bucket: _.uniqueId('resource-s3bucket-'),
};

export const PolicyNodeID = {
  S3ReadPolicy: _.uniqueId('policy-'),
};
