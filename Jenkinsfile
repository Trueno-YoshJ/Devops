pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        IMAGE_TAG = "latest"

        AWS_EC2_IP = "18.234.113.136"
        AWS_USER   = "ec2-user"
        SSH_KEY    = "/var/lib/jenkins/.ssh/terraform-us-east.pem"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Trueno-YoshJ/Devops.git'
            }
        }

        stage('Build Backend & Frontend Docker Images') {
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
                echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin
                docker push $DOCKERHUB_CREDS_USR/springboot-backend:$IMAGE_TAG
                docker push $DOCKERHUB_CREDS_USR/react-vite-frontend:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy to AWS with Docker Compose') {
            steps {
                sh """
                scp -i $SSH_KEY docker-compose.yml $AWS_USER@$AWS_EC2_IP:~/docker-compose.yml

                ssh -i $SSH_KEY $AWS_USER@$AWS_EC2_IP << EOF
                sudo docker-compose -f ~/docker-compose.yml down
                sudo docker-compose -f ~/docker-compose.yml pull
                sudo docker-compose -f ~/docker-compose.yml up -d
EOF
                """
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
