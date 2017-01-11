def image = 'comics'
def serviceName = image
def registry = 'https://registry.wangpedersen.com'
def registryLogin = 'registry-login'

node {
  checkout scm

  wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
    docker.withRegistry(registry, registryLogin) {
      stage 'Build'
      def builtImage = docker.build(image, '--pull .')

      if (env.BRANCH_NAME == 'master') {
          stage 'Push'
          builtImage.push()
      }
    }
  }

  //stage 'Deploy'
  //build job: '/restart-service', parameters: [string(name: 'service', value: serviceName)]
}
