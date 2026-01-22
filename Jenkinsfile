pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        DOCKERHUB_USER  = "${DOCKERHUB_CREDS_USR}"

        FRONTEND_IMAGE = "${DOCKERHUB_USER}/react-vite-frontend"
        BACKEND_IMAGE  = "${DOCKERHUB_USER}/springboot-backend"

        IMAGE_TAG = "latest"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Trueno-YoshJ/Devops.git'
            }
        }

        stage('Build Backend (Spring Boot)') {
    steps {
        echo "Building Spring Boot backend..."
        dir('Devops') { // <-- this should match the folder containing pom.xml
            sh 'mvn clean package -DskipTests'
        }
    }
}


        stage('Build Frontend') {
            steps {
                echo "Building React frontend..."
                dir('frontend') { // <-- switch to frontend folder
                    sh 'npm install'
                    sh 'npm run build' // production-ready build
                }
            }
        }

        stage('Docker Login') {
            steps {
                echo "Logging into Docker Hub..."
                sh """
                echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin
                """
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building Docker images..."
                sh """
                docker build -t $BACKEND_IMAGE:$IMAGE_TAG ./devops
                docker build -t $FRONTEND_IMAGE:$IMAGE_TAG ./frontend
                """
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                echo "Pushing images to Docker Hub..."
                sh """
                docker push $BACKEND_IMAGE:$IMAGE_TAG
                docker push $FRONTEND_IMAGE:$IMAGE_TAG
                """
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                echo "Deploying application using Docker Compose..."
                sh """
                docker compose down || true
                docker compose up -d --build
                """
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
