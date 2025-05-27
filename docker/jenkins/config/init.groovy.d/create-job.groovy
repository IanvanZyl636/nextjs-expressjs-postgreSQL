import jenkins.model.*
import hudson.plugins.git.*
import hudson.model.*
import org.jenkinsci.plugins.workflow.job.*
import org.jenkinsci.plugins.workflow.cps.*
import hudson.triggers.Trigger

def jenkins = Jenkins.getInstance()
def jobName = "nextjs-expressjs-postgreSQL"

if (jenkins.getItem(jobName) == null) {
    println "--> Creating pipeline job '${jobName}'"

    def job = new WorkflowJob(jenkins, jobName)

    def scm = new GitSCM("https://github.com/IanvanZyl636/nextjs-expressjs-postgreSQL.git")
    scm.branches = [new BranchSpec("*/master")]
    scm.userRemoteConfigs = [new UserRemoteConfig("https://github.com/IanvanZyl636/nextjs-expressjs-postgreSQL.git", null, null, null)]
    scm.extensions = []

    def definition = new CpsScmFlowDefinition(scm, "docker/jenkins/config/Jenkinsfile")
    definition.setLightweight(true)

    job.definition = definition

    jenkins.reload()
    jenkins.add(job, jobName)
    job.save()

    println "--> Job '${jobName}' created successfully."
} else {
    println "--> Job '${jobName}' already exists. Skipping creation."
}