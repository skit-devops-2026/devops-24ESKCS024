pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm install --legacy-peer-deps'
                    } else {
                        bat 'npm install --legacy-peer-deps'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run test:ci'
                    } else {
                        bat 'npm run test:ci'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run build'
                    } else {
                        bat 'npm run build'
                    }
                }
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'coverage/**, dist/**, .output/**', allowEmptyArchive: true, fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'HostelFix pipeline succeeded: tests passed and build produced.'
        }
        failure {
            echo 'HostelFix pipeline failed. Check the Test or Build stage output.'
        }
        always {
            cleanWs(deleteDirs: true, notFailBuild: true)
        }
    }
}