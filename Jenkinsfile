pipeline {
    agent {
        node {
            // Label expression that defines which agents may execute builds of this project
            label 'All'
            customWorkspace "/home/jenkins/jenkins/workspace/${env.JOB_NAME}"
        }
    }

    libraries {
        lib('jenkins-common-pipeline-library')
        lib('jenkins-augero-pipeline-library')
    }

    options {
        // This option enables timestamps for console output in the jenkins job
        timestamps()
        timeout(time: 120, unit: 'MINUTES')
    }

    parameters {
		choice(
            choices: [
                 "Consider commit message",
                 "Publish release version",
                 "Don't publish a new version"],
            description: 'Please select how to publish this mtar to Artifactory',
            name: 'userInput'
        )
    }

    environment {
        // This environment sets the name of the repository this file is in so it can be used in the build step
        REPOSITORY_NAME = 'test-component-app'
        ORGANIZATION_NAME = 'Cerner Health Services Deutschland GmbH_DevelopmentPaaS'
	    IMAGE_TIMESTAMP = imageTimestamp() // timestamp for Docker image tagging
    }

    stages {
        stage('Execute Initial Checks') {
            when {
                expression { executeBuildPipeline() }
                expression { sanityChecksSuccessful() }
            }

            stages {
                stage('Parallel: create space, build, unit tests') {
                    failFast true
                    parallel {
                        stage('build & unit tests') {
                            stages {
                                stage('Run Jest tests'){

                                    steps{
                                       sh '''
                                               npm install
                                               npm run test
                                          '''
                                    }
                                    post {
                                       always {
                                           step([$class: 'CoberturaPublisher', coberturaReportFile: '**/*/clover.xml'])
                                       }
                                    }
                                }

                                stage('Build') {
                                    steps {
                                       sh '''
                                               npm run build
                                          '''
                                    }
                                }

                                // stage('Copy TEW') {
                                //     when { branch "master" }
                                //     steps {
                                //         copyTEW(repositoryName: env.REPOSITORY_NAME)
                                //     }
                                // }
                            }
                        }
                    }
                }

                stage('Build Image') {
                    steps {
                        buildAugeroDockerImage(
                            imageName:REPOSITORY_NAME,
                            versionFile:"${WORKSPACE}/package.json",
                            imageFileName:"${WORKSPACE}/.",
                            imageTimestamp:IMAGE_TIMESTAMP
                        )
                    }
                }

                stage('Publish Image') {
                    steps {
                        publishAugeroDockerImage(
                            imageName:REPOSITORY_NAME,
                            versionFile:"${WORKSPACE}/package.json",
                            imageTimestamp:IMAGE_TIMESTAMP
                        )
                    }
                }

		stage('Deployment') {
		    steps {
			script {
			    deployAugero(
				imageName:REPOSITORY_NAME,
				versionFile:"${WORKSPACE}/package.json",
				imageTimestamp:IMAGE_TIMESTAMP)
			}
		    }
		}

                /*
                stage('Deploy for master') {
                    when { branch "master"  }
                        steps {
                            // This step runs deploy on SPACE 'test'
                            deployMbtMtar(workspace: env.WORKSPACE, organizationName: env.ORGANIZATION_NAME, spaceName: 'test', mtarName: env.REPOSITORY_NAME+ '-app')
                        }
                }*/

                /*
                stage('Deploy app for feature branch') {
                    when { expression { BRANCH_NAME ==~ /^feature-[0-9]+.*$/ } }
                    steps {
                        deployMbtMtar(workspace: env.WORKSPACE, organizationName: env.ORGANIZATION_NAME, spaceName: env.BRANCH_NAME, mtarName: env.REPOSITORY_NAME+ '-app')
                        assignRoleToRoleCollection(organization: env.ORGANIZATION_NAME, spaceName: env.BRANCH_NAME, appName: "augero-reporting-router", roleTemplateName: "DocumentationApp", roleName: "DocumentationApp", roleCollection: "DocumentationApp" )
                    }
                }*/

                stage('Run esLint'){
                    steps {
                        sh '''
                              npm run lint
			   '''
                    }
                }


                // Release
                //stage("Release - promote to Artifactory and deploy to Operations systemtest") {
                //    when {
                //        expression {
                //            BRANCH_NAME ==~ /(release-(.*))/
                //        }
                //    }
                //    steps {
                //        promoteMtarToArtifactoryScpIntegration(userInput: params.userInput, mtarDirectory: 'CF/', mtarName: env.REPOSITORY_NAME+ '-app')
                //        deployMtarToOperationsSystemtest(userInput: params.userInput, mtarName: env.REPOSITORY_NAME+ '-app', extensions: 'sap-tenant-operationspass-specifier.ext')
                //    }
                //}

                stage('Transfer quality reports to sonar') {

                    environment {
                        sonarqubeScannerHome = tool name: 'SonarQube Scanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                    }

                    steps {
                        executeSonarQubeScanFrontend(
                            sonarqubeScannerHome: env.sonarqubeScannerHome,
                            sonarProjectName: "${env.REPOSITORY_NAME}",
                            sonarProjectKey: "${env.REPOSITORY_NAME}",
                            testsPaths: "src",
                            testExecutionReportPaths: "test-report.xml",
                            javascriptLcovReportPaths: 'output/coverage/jest/lcov.info',
                            esLintReportPaths: "eslintReport.json",
                            filePathVersionInfo: "package.json"
                        )
                    }
                }
                // This stage waits for the QualityGate status
                stage("Check quality gate") {
                    steps {
                        addSonarQubeQualityGateListener()
                    }
                }
            }
        }

        stage('Notify and cleanup') {
            steps {
                echo 'Send emails and cleanup directory'
            }
        }
    }

    post {
        success {
            deleteDir()
        }

        unsuccessful {
            sendEmails()
        }
    }
}