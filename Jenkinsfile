#!/usr/bin/env groovy

/**

Jenkinsfile for deploying build projects to AWS S3

*/
import java.util.Date
import groovy.json.JsonOutput
import groovy.json.JsonSlurper


def displayName = env.JOB_NAME
def bucketName = "identity-mapping"
def branchName = env.BRANCH_NAME == "dev"
def start = new Date()
def err = null


String jobInfoShort = "${env.JOB_NAME} ${env.BUILD_DISPLAY_NAME}"
String jobInfo = "${env.JOB_NAME} ${env.BUILD_DISPLAY_NAME} \n${env.BUILD_URL}"
String buildStatus
String timeSpent

currentBuild.result = "SUCCESS"

try {
    node {
        def app
                
        deleteDir()
        env.NODEJS_HOME = "${tool 'Node 6.14.1'}"
        env.PATH = "${env.NODEJS_HOME}/bin:${env.PATH}"
        
        // Mark the code checkout 'stage'
        
        stage ('Checkout') {
            checkout scm
        }
        
        stage ('Install Dependencies') {
            sh "npm install"
        }

        stage ("Deploy to Serverless"){
            sh "cp env.yml env.yml.tmp"
            sh "python /bin/envswaper/main.py path env.yml serverless dev"
            sh "export AWS_DEFAULT_REGION=eu-west-1"
            sh "npm install && npm install serverless"
            sh "serverless deploy --region eu-west-1 --stage dev  > serverless-export.txt"
            sh "rm -rf env.yml"
            sh "mv env.yml.tmp env.yml"
            def response = sh(returnStdout: true, script: "grep -r -A2 'endpoints' serverless-export.txt")
            def logResponse = JsonOutput.toJson(["ref": "ref", "description": "description", "msg": "${response}", "required_contexts": []])
            slackSend (color: 'good', message: "${response}")
            sh "rm -rf serverless-export.txt"
        }
        
    }
} catch (caughtError) {
    err = caughtError
    currentBuild.result = "FAILURE"
} finally {
    
    timeSpent = "\nTime spent: ${timeDiff(start)}"

    if (err) {
        slackSend (color: 'danger', message: "_Build failed_: ${jobInfo} ${timeSpent}")
        throw err
    } else {
        if (currentBuild.previousBuild == null) {
            buildStatus = '_First time build_'
        } else if (currentBuild.previousBuild.result == 'SUCCESS') {
            buildStatus = '_Build complete_'
        } else {
            buildStatus = '_Back to normal_'
        }

        slackSend (color: 'good', message: "${buildStatus}: ${jobInfo} ${timeSpent}")
        slackSend (color: 'good', message: "*${env.BRANCH_NAME}* branch deployed to Serverless ")
        
    }


}


def timeDiff(st) {
    def delta = (new Date()).getTime() - st.getTime()
    def seconds = delta.intdiv(1000) % 60
    def minutes = delta.intdiv(60 * 1000) % 60

    return "${minutes} min ${seconds} sec"
}



