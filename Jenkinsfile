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
    tools {
        jdk 'JDK21' // must match the name you set in Jenkins
    }
    steps {
        echo "Building Spring Boot backend with JDK 21..."
        dir('Devops') { // folder where pom.xml is
            sh 'mvn clean package -DskipTests'
        }
    }
}


stage('Build Frontend') {
    agent {
        docker {
            image 'node:22-alpine'
            args '-u root:root'
        }
    }
    steps {
        dir('Frontend') {  // Make sure folder name matches
            sh 'npm install'
            sh 'npm run build'
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
