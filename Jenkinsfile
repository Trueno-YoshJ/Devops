pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        IMAGE_TAG = "latest"

        AWS_EC2_IP = "3.80.6.226"
        AWS_USER = "ubuntu"

        MYSQL_ROOT_PASSWORD = "0716300615"
        MYSQL_DATABASE = "automirage"
        DOCKER_NETWORK = "devops-net"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Trueno-YoshJ/Devops.git',
                    credentialsId: 'github-creds'
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
                  echo $DOCKERHUB_CREDS_PSW | docker login \
                  -u $DOCKERHUB_CREDS_USR --password-stdin
                '''
            }
        }

        stage('Build & Push Images') {
    steps {
        dir('Devops') {
            sh '''
            ls -lh target
            docker build -t $DOCKERHUB_CREDS_USR/springboot-backend:$IMAGE_TAG .
            docker push $DOCKERHUB_CREDS_USR/springboot-backend:$IMAGE_TAG
            '''
        }
    }
}


        stage('Deploy to AWS EC2') {
            steps {
                sshagent(credentials: ['aws-ec2-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no $AWS_USER@$AWS_EC2_IP << 'EOF'
                        sudo docker network create $DOCKER_NETWORK || true

                        sudo docker stop mysql-db backend frontend || true
                        sudo docker rm mysql-db backend frontend || true

                        sudo docker run -d --name mysql-db --network $DOCKER_NETWORK \
                          -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
                          -e MYSQL_DATABASE=$MYSQL_DATABASE \
                          -p 3306:3306 mysql:8.0

                        sleep 20

                        sudo docker pull $DOCKERHUB_CREDS_USR/springboot-backend:$IMAGE_TAG
                        sudo docker run -d --name backend --network $DOCKER_NETWORK \
                          -p 9090:9090 \
                          -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql-db:3306/$MYSQL_DATABASE \
                          -e SPRING_DATASOURCE_USERNAME=root \
                          -e SPRING_DATASOURCE_PASSWORD=$MYSQL_ROOT_PASSWORD \
                          $DOCKERHUB_CREDS_USR/springboot-backend:$IMAGE_TAG

                        sudo docker pull $DOCKERHUB_CREDS_USR/react-vite-frontend:$IMAGE_TAG
                        sudo docker run -d --name frontend -p 80:80 \
                          $DOCKERHUB_CREDS_USR/react-vite-frontend:$IMAGE_TAG
                    EOF
                    """
                }
            }
        }
    }

    post {
        success { echo "✅ CI/CD Pipeline completed successfully!" }
        failure { echo "❌ Pipeline failed!" }
        always { sh 'docker logout || true' }
    }
}
