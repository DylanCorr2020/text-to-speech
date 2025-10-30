#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CognitoStack } from "../lib/cognito-stack";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import { StorageAndLambdaStack } from "../lib/storage-lambda-stack";


const app = new cdk.App();

//Cognito Authentication Stack ---
const authStack = new CognitoStack(app, "CognitoStack");

//Storage and Lambda Stack 
const storageLambdaStack = new StorageAndLambdaStack(app , "StorageAndLambdaStack")



