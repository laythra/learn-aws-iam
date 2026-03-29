export default `
Every **IAM role** has exactly one **trust policy** - they're inseparable.

A **trust policy** is a required JSON document that defines which entities are trusted to assume
this specific role.

The basic structure is straightforward:


* **Principal**: The entity that is allowed to assume the role. It can be an AWS service,
a regular IAM user or even an AWS account
* **Effect**: Whether the principal is allowed or denied the access
* **Action**: The action the principal is allowed to perform, it's almost always \`sts:AssumeRole\`

~~~js
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow", ::badge[ALLOWS THE PRINCIPAL TO ASSUME THIS ROLE]::
      "Principal": {
        "Service": "s3.amazonaws.com" ::badge[THE PRINCIPAL HERE IS THE AMAZON S3 SERVICE]::
      },
      "Action": "sts:AssumeRole" ::badge[THE PRINCIPAL CAN ASSUME THIS ROLE]::
    }
  ]
}|fullwidth
~~~

The Principal can take the following formats:|lg
* **AWS service**:  \`{ "Service": "ec2.amazonaws.com" }\`
* **IAM User**:  \`{ "AWS": "arn:aws:iam::123456789012:user/FinanceUser" }\`
* **AWS Account**:  \`{ "AWS": "arn:aws:iam::123456789012:root" }\`
`;
