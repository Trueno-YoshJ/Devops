pipeline {
    agent any

    environment {
        // Jenkins credentials (ID = dockerhub-creds)
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        IMAGE_TAG = "latest"

        // Disable buildkit completely
        DOCKER_BUILDKIT = "0"
        COMPOSE_DOCKER_CLI_BUILD = "0"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Trueno-YoshJ/Devops.git'
            }
        }

        stage('Build Backend (Spring Boot)') {
            tools {
                jdk 'JDK21'
            }
            steps {
                echo "Building Spring Boot backend with JDK 21..."
                dir('Devops') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo "Building React frontend..."
                dir('Frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Login') {
            steps {
                echo "Logging into Docker Hub..."
                sh '''
                echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin
                '''
            }
        }

        stage('Build Docker Images (Legacy Builder)') {
            steps {
                echo "Building Docker images with legacy docker builder..."
                sh '''
                docker build -t $DOCKERHUB_CREDS_USR/springboot-backend:$IMAGE_TAG ./Devops
                docker build -t $DOCKERHUB_CREDS_USR/react-vite-frontend:$IMAGE_TAG ./Frontend
                '''
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                echo "Pushing images to Docker Hub..."
                sh '''
                docker push $DOCKERHUB_CREDS_USR/springboot-backend:$IMAGE_TAG
                docker push $DOCKERHUB_CREDS_USR/react-vite-frontend:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy with Docker Compose (No Build)') {
            steps {
                echo "Deploying application using Docker Compose (no buildx)..."
                sh '''
                docker-compose down || true
                docker-compose up -d

                '''
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check Jenkins logs."
        }
        always {
            sh "docker logout"
        }
    }
}
