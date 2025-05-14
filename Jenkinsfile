pipeline {
  agent any

  environment {
    REGISTRY = 'myregistry.local'
    BASE_IMAGE = 'nx-builder-base'
    NEXT_IMAGE = "${REGISTRY}/next-app:latest"
    EXPRESS_IMAGE = "${REGISTRY}/express-app:latest"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Node Test') {
      steps {
        sh 'node -v && npm -v'
      }
    }

    stage('Build Nx Base Image') {
      steps {
        script {
          sh '''
            docker build -f Dockerfile.builder-base -t $BASE_IMAGE .
          '''
        }
      }
    }

  }

  post {
    failure {
      echo 'Build failed!'
    }
    success {
      echo 'All images built and pushed successfully.'
    }
  }
}