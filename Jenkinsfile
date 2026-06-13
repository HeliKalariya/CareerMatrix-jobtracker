pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                bat 'docker build -t careermatrix-backend ./backend'
            }
        }

        stage('Build Frontend') {
            steps {
                bat 'docker build -t careermatrix-frontend ./frontend'
            }
        }

        stage('Deploy Containers') {
            steps {
                bat 'docker compose down'
                bat 'docker compose up -d'
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful'
        }

        failure {
            echo 'Deployment Failed'
        }
    }
}