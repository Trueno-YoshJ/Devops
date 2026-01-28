pipeline {
    agent any

    environment {
        // DockerHub credentials stored in Jenkins
        DOCKERHUB_CREDS = credentials('dockerhub-creds') 
        IMAGE_TAG       = "latest"

        // AWS EC2 access
        AWS_EC2_IP      = "18.234.113.136"
        AWS_USER        = "ec2-user"
        SSH_KEY         = "/var/lib/jenkins/.ssh/terraform-us-east.pem"

        // Docker build options
        DOCKER_BUILDKIT           = "0"
        COMPOSE_DOCKER_CLI_BUILD  = "0"
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
                // Retry Docker login 3 times in case of network issues
                sh '''
                for i in 1 2 3; do
                    echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin && break
                    echo "Retrying Docker login..."
                    sleep 5
                done
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
                set -e

                # Docker login on EC2
                for i in 1 2 3; do
                    echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin && break
                    echo "Retrying Docker login on EC2..."
                    sleep 5
                done

                # Stop and remove existing containers
                docker stop backend frontend mysql_db || true
                docker rm backend frontend mysql_db || true

                # Run MySQL container
                docker run -d \\
                  --name mysql_db \\
                  -e MYSQL_ROOT_PASSWORD=root \\
                  -e MYSQL_DATABASE=autodb \\
                  -e MYSQL_USER=appuser \\
                  -e MYSQL_PASSWORD=apppass \\
                  -p 3306:3306 \\
                  mysql:8.0 --default-authentication-plugin=mysql_native_password

                # Wait for MySQL to be ready
                until docker exec mysql_db mysql -uappuser -papppass -e "SELECT 1"; do
                  echo "Waiting for MySQL to be ready..."
                  sleep 5
                done

                # Pull and run backend
                docker pull $DOCKERHUB_CREDS_USR/springboot-backend:latest
                docker run -d \\
                  --name backend \\
                  --link mysql_db:mysql \\
                  -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql_db:3306/autodb?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC \\
                  -e SPRING_DATASOURCE_USERNAME=appuser \\
                  -e SPRING_DATASOURCE_PASSWORD=apppass \\
                  -p 8080:8080 \\
                  $DOCKERHUB_CREDS_USR/springboot-backend:latest

                # Pull and run frontend
                docker pull $DOCKERHUB_CREDS_USR/react-vite-frontend:latest
                docker run -d \\
                  --name frontend \\
                  --link backend:backend \\
                  -p 80:80 \\
                  $DOCKERHUB_CREDS_USR/react-vite-frontend:latest

EOF
                """
            }
        }

    } // End of stages

    post {
        success {
            echo "✅ CI/CD Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
        always {
            // Logout Docker locally
            sh "docker logout || true"
        }
    }
}
