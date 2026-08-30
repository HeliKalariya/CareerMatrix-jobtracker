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
                bat 'docker build -t careermatrix-backend:local ./backend'
            }
        }

        stage('Build Frontend') {
            steps {
                bat 'docker build -t careermatrix-frontend:local ./frontend'
            }
        }

        stage('Deploy Containers') {
            steps {
                bat 'copy /Y C:\\Jenkins-Secrets\\careermatrix.env backend\\.env'
                bat 'docker compose up -d --no-build --remove-orphans'
                bat 'docker compose ps'
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
