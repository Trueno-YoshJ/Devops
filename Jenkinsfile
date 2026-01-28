pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        IMAGE_TAG = "latest"
        AWS_EC2_IP = "18.234.113.136"
        AWS_USER = "ec2-user"
        SSH_KEY = "/var/lib/jenkins/.ssh/terraform-us-east.pem"
        MYSQL_ROOT_PASSWORD = "0716300615"
        MYSQL_DATABASE = "automirage"
        DOCKER_NETWORK = "devops-net"
        DOCKER_BUILDKIT = "0"
        COMPOSE_DOCKER_CLI_BUILD = "0"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Trueno-YoshJ/Devops.git'
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
                    ssh -o StrictHostKeyChecking=no -i $SSH_KEY $AWS_USER@$AWS_EC2_IP << 'EOF'
                        # Create Docker network if not exists
                        sudo docker network create $DOCKER_NETWORK || true

                        # Stop & remove any existing containers
                        sudo docker stop mysql-db backend frontend || true
                        sudo docker rm mysql-db backend frontend || true

                        # Start MySQL container (root only)
                        sudo docker run -d --name mysql-db --network $DOCKER_NETWORK \
                            -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
                            -e MYSQL_DATABASE=$MYSQL_DATABASE \
                            -p 3306:3306 \
                            mysql:8.0

                        # Wait for MySQL to fully initialize
                        echo "Waiting 20 seconds for MySQL..."
                        sleep 20

                        # Pull and run backend container on same network
                        sudo docker pull $DOCKERHUB_CREDS_USR/springboot-backend:$IMAGE_TAG
                        sudo docker run -d --name backend --network $DOCKER_NETWORK \
                            -p 9090:9090 \
                            -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql-db:3306/$MYSQL_DATABASE \
                            -e SPRING_DATASOURCE_USERNAME=root \
                            -e SPRING_DATASOURCE_PASSWORD=$MYSQL_ROOT_PASSWORD \
                            $DOCKERHUB_CREDS_USR/springboot-backend:$IMAGE_TAG

                        # Pull and run frontend container (no network dependency)
                        sudo docker pull $DOCKERHUB_CREDS_USR/react-vite-frontend:$IMAGE_TAG
                        sudo docker run -d --name frontend -p 80:80 \
                            $DOCKERHUB_CREDS_USR/react-vite-frontend:$IMAGE_TAG
EOF
                """
            }
        }
    }

    post {
        success { echo "✅ CI/CD Pipeline completed successfully!" }
        failure { echo "❌ Pipeline failed!" }
        always { sh "docker logout || true" }
    }
}
