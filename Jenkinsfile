pipeline {
  agent any

  environment {
    REGISTRY = "localhost:5000"
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://your-repo-url.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'yarn install --frozen-lockfile'
      }
    }

    stage('Build Next.js') {
      steps {
        sh 'yarn nx build next-app'
      }
    }

    stage('Build Express.js') {
      steps {
        sh 'yarn nx build express-app'
      }
    }

    stage('Docker Build & Push') {
      steps {
        script {
          docker.build("next-app", "-f Dockerfile.next .").tag("${REGISTRY}/next-app:latest")
          docker.build("express-app", "-f Dockerfile.express .").tag("${REGISTRY}/express-app:latest")

          sh "docker push ${REGISTRY}/next-app:latest"
          sh "docker push ${REGISTRY}/express-app:latest"
        }
      }
    }
  }
}