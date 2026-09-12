import json
import os
import boto3

# ==========================================
# CONFIGURATION & PLACEHOLDERS
# ==========================================
# Tip: In AWS Lambda, it's best practice to use Environment Variables or IAM Roles 
# instead of hardcoding credentials. But you can replace these placeholders for local testing.

AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "<YOUR_AWS_ACCESS_KEY_ID>")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY", "<YOUR_AWS_SECRET_ACCESS_KEY>")
AWS_REGION = os.environ.get("AWS_REGION", "<YOUR_AWS_REGION_E_G_us-east-1>")

THIRD_PARTY_API_KEY = os.environ.get("THIRD_PARTY_API_KEY", "<YOUR_THIRD_PARTY_API_KEY>")

# Initialize clients (e.g., S3) using the credentials
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

def lambda_handler(event, context):
    """
    Lambda function 1: API Handler Example
    Modify this function based on your specific architecture needs.
    """
    try:
        # Example: Parse incoming API Gateway request
        body = json.loads(event.get("body", "{}"))
        
        # TODO: Add your custom logic here (e.g., calling an external API)
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'API Lambda executed successfully',
                'data_received': body
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
