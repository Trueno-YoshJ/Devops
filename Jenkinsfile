pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        IMAGE_TAG = "latest"

        AWS_EC2_IP = "18.234.113.136"
        AWS_USER   = "ec2-user"
        SSH_KEY    = "/var/lib/jenkins/.ssh/terraform-us-east.pem"

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
            tools { jdk 'JDK21' }
            steps {
                dir('Devops') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend (React)') {
            steps {
                dir('Frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Login') {
            steps {
                sh '''
                echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                docker build -t $DOCKERHUB_CREDS_USR/springboot-backend:$IMAGE_TAG ./Devops
                docker build -t $DOCKERHUB_CREDS_USR/react-vite-frontend:$IMAGE_TAG ./Frontend
                '''
            }
        }

        stage('Push Images to DockerHub') {
            steps {
                sh '''
                docker push $DOCKERHUB_CREDS_USR/springboot-backend:$IMAGE_TAG
                docker push $DOCKERHUB_CREDS_USR/react-vite-frontend:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy to AWS EC2') {
    steps {
        sh """
        ssh -o StrictHostKeyChecking=no -i $SSH_KEY $AWS_USER@$AWS_EC2_IP << EOF
        sudo docker login -u $DOCKERHUB_CREDS_USR -p $DOCKERHUB_CREDS_PSW

        # Stop and remove existing containers
        sudo docker stop backend frontend mysql_db || true
        sudo docker rm backend frontend mysql_db || true

        # Run MySQL container
        sudo docker run -d \
          --name mysql_db \
          -e MYSQL_ROOT_PASSWORD=root \
          -e MYSQL_DATABASE=autodb \
          -e MYSQL_USER=appuser \
          -e MYSQL_PASSWORD=apppass \
          -p 3306:3306 \
          mysql:8.0 \
          --default-authentication-plugin=mysql_native_password

        # Wait for MySQL to start
        sleep 15

        # Pull and run backend
        sudo docker pull $DOCKERHUB_CREDS_USR/springboot-backend:latest
        sudo docker run -d \
          --name backend \
          --link mysql_db:mysql \
          -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql_db:3306/autodb?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC \
          -e SPRING_DATASOURCE_USERNAME=appuser \
          -e SPRING_DATASOURCE_PASSWORD=apppass \
          -p 8080:8080 \
          $DOCKERHUB_CREDS_USR/springboot-backend:latest

        # Pull and run frontend
        sudo docker pull $DOCKERHUB_CREDS_USR/react-vite-frontend:latest
        sudo docker run -d \
          --name frontend \
          --link backend:backend \
          -p 80:80 \
          $DOCKERHUB_CREDS_USR/react-vite-frontend:latest
EOF
        """
    }
}

    } // <-- CLOSES stages BLOCK

    post {
        success {
            echo "✅ CI/CD Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
        always {
            sh "docker logout || true"
        }
    }
}
