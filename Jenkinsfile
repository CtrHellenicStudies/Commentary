node {
  def project = 'archimedes-01201'
  def appName = 'ahcip-app'
  def feSvcName = "${appName}-frontend"
  // def imageTag = "us.gcr.io/${project}/${appName}:${env.BRANCH_NAME}.${env.BUILD_NUMBER}"
  def imageTag = "us.gcr.io/${project}/${appName}:latest"

  checkout scm

  stage 'Running tests and building application/image:'
  sh("./bin/build")
  sh("./bin/build_image")

  stage 'Pushing container image to registry:'
  sh("gcloud docker push ${imageTag}")

  stage 'Deploying Application:'
	sh("kubectl apply -f k8s/develop/")
	sh("echo http://`kubectl get service/${feSvcName} --output=json | jq -r '.status.loadBalancer.ingress[0].ip'` > ${feSvcName}")
}
