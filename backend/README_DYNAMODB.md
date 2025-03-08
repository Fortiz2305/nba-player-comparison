# NBA Player Comparison with DynamoDB

This document explains how to set up and use the DynamoDB implementation for the NBA Player Comparison application.

## Overview

The application has been refactored to use dependency injection with a repository pattern. This allows switching between a file-based repository (for local development) and a DynamoDB-based repository (for production/AWS deployment).

## Setup Instructions

### 1. Install Dependencies

Make sure you have all the required dependencies installed:

```bash
pip install -r requirements.txt
```

### 2. Configure AWS Credentials

To use DynamoDB, you need to configure your AWS credentials. You can do this in several ways:

- Using AWS CLI: `aws configure`
- Setting environment variables: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`
- Using a credentials file: `~/.aws/credentials`

### 3. Migrate Data to DynamoDB

Run the migration script to create the DynamoDB table and populate it with data from your CSV files:

```bash
cd backend
python scripts/migrate_to_dynamodb.py
```

By default, this will:
- Create a table named `nba_player_stats` if it doesn't exist
- Load data from the `data` directory
- Insert all player records into DynamoDB

You can specify a different data directory or table name:

```bash
python scripts/migrate_to_dynamodb.py /path/to/data custom-table-name
```

### 4. Running Locally with DynamoDB

To run the application locally using DynamoDB instead of CSV files, set the `USE_DYNAMODB` environment variable:

```bash
USE_DYNAMODB=true uvicorn app.main:app --reload
```

### 5. Deploying to AWS Lambda

The `serverless.yml` file has been updated to include:
- DynamoDB table creation
- IAM permissions for DynamoDB access
- Environment variables to use DynamoDB

To deploy:

```bash
cd backend
serverless deploy
```

## Implementation Details

### Repository Pattern

The application uses a repository pattern with dependency injection:

- `PlayerRepository`: Abstract base class defining the interface
- `FilePlayerRepository`: Implementation using CSV files
- `DynamoDBPlayerRepository`: Implementation using DynamoDB

### Switching Between Implementations

The application decides which repository to use based on the `USE_DYNAMODB` environment variable:

- `USE_DYNAMODB=true`: Uses DynamoDB
- `USE_DYNAMODB=false` or not set: Uses CSV files

### DynamoDB Table Structure

- Partition Key: `Season` (String)
- Sort Key: `Player` (String)
- Other attributes: All player statistics

## Troubleshooting

### Common Issues

1. **AWS Credentials**: Make sure your AWS credentials are properly configured and have permissions to access DynamoDB.

2. **Table Not Found**: If you get a "Table not found" error, make sure you've run the migration script to create the table.

3. **Region Mismatch**: Ensure the AWS region in your credentials matches the region in `serverless.yml`.

4. **Lambda Size Limit**: If you're still hitting the Lambda size limit, make sure you're not including the CSV files in your deployment package.

### Checking DynamoDB Data

You can verify your data was properly migrated using the AWS Console or AWS CLI:

```bash
aws dynamodb scan --table-name nba_player_stats --limit 5
```

## Additional Resources

- [DynamoDB Developer Guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html)
- [Boto3 DynamoDB Documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html)
- [Serverless Framework Documentation](https://www.serverless.com/framework/docs/)
